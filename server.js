const express = require('express');
const dotenv = require('dotenv');
const checkingSeatsHandler = require('./checkingseats');
const { pendingNotifications, sendEmail } = require('./checkingseats');
const schedule = require('node-schedule');

dotenv.config();

const app = express();
const port = process.env.PORT || 4567;

// Middleware to serve static files from the 'frontend' directory
app.use(express.static('frontend'));

// API endpoint to check seats
app.get('/checkSeats', checkingSeatsHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    // Schedule periodic checks every minute
    schedule.scheduleJob('*/20 * * * * *', () => {
        console.log('Running periodic seat availability check...');
        checkPendingNotifications();
    });
});

// Function to check pending notifications
async function checkPendingNotifications() {
    const fetch = await import('node-fetch').then(mod => mod.default);
    for (const [key, { email, className }] of pendingNotifications.entries()) {
        const [term, classNbr] = key.split('-');
        const url = `https://eadvs-cscc-catalog-api.apps.asu.edu/catalog-microservices/api/v1/search/classes?term=${term}&classNbr=${classNbr}`;
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': 'Bearer null',
                },
            });
            if (!response.ok) {
                throw new Error(`Unexpected response ${response.statusText}`);
            }

            const jsonResponse = await response.json();
            const totalSeats = jsonResponse.hits.hits[0]._source.ENRLCAP;
            const enrolledSeats = jsonResponse.hits.hits[0]._source.ENRLTOT;
            const availableSeats = totalSeats - enrolledSeats;

            if (availableSeats > 0) {
                await sendEmail(email, className, availableSeats);
                pendingNotifications.delete(key);
                console.log(`Seats available for ${className}. Email sent to ${email}`);
            }
        } catch (error) {
            console.error(`Error checking pending notification for ${key}:`, error);
        }
    }
}
