// const express = require('express');
// const dotenv = require('dotenv');
// const checkingSeatsHandler = require('./checkingseats');
// const { pendingNotifications, sendEmail } = require('./checkingseats');
// const schedule = require('node-schedule');

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 4567;

// // Middleware to serve static files from the 'frontend' directory
// app.use(express.static('frontend'));

// // API endpoint to check seats
// app.get('/checkSeats', checkingSeatsHandler);

// // Start the server
// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
//     // Schedule periodic checks every 20 seconds
//     schedule.scheduleJob('*/20 * * * * *', () => {
//         console.log('Running periodic seat availability check...');
//         checkPendingNotifications();
//     });
// });

// // Function to check pending notifications
// async function checkPendingNotifications() {
//     const fetch = await import('node-fetch').then(mod => mod.default);
//     console.log('Checking pending notifications for the following classes:');
//     for (const [key, { email, className }] of pendingNotifications.entries()) {
//         console.log(`Class: ${className}, Term: ${key.split('-')[0]}, Class Number: ${key.split('-')[1]}`);
//     }
    
//     for (const [key, { email, className }] of pendingNotifications.entries()) {
//         const [term, classNbr] = key.split('-');
//         const url = `https://eadvs-cscc-catalog-api.apps.asu.edu/catalog-microservices/api/v1/search/classes?term=${term}&classNbr=${classNbr}`;
//         try {
//             const response = await fetch(url, {
//                 headers: {
//                     'Authorization': 'Bearer null',
//                 },
//             });
//             if (!response.ok) {
//                 throw new Error(`Unexpected response ${response.statusText}`);
//             }

//             const jsonResponse = await response.json();
//             const totalSeats = jsonResponse.hits.hits[0]._source.ENRLCAP;
//             const enrolledSeats = jsonResponse.hits.hits[0]._source.ENRLTOT;
//             const availableSeats = totalSeats - enrolledSeats;

//             if (availableSeats > 0) {
//                 await sendEmail(email, className, availableSeats);
//                 pendingNotifications.delete(key);
//                 console.log(`Seats available for ${className}. Email sent to ${email}`);
//             }
//         } catch (error) {
//             console.error(`Error checking pending notification for ${key}:`, error);
//         }
//     }
// }






const express = require('express');
const dotenv = require('dotenv');
const checkingSeatsHandler = require('./checkingseats');
const { pendingNotifications, sendEmail, checkPendingNotifications } = require('./checkingseats');
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
    // Schedule periodic checks every 20 seconds
    schedule.scheduleJob('*/20 * * * * *', () => {
        console.log('Running periodic seat availability check...');
        checkPendingNotifications();
    });
});

// Function to check pending notifications
async function checkPendingNotifications() {
    const fetch = await import('node-fetch').then(mod => mod.default);
    console.log('Checking pending notifications for the following classes:');
    
    for (const [key, notifications] of pendingNotifications.entries()) {
        notifications.forEach(({ email, className }) => {
            console.log(`Class: ${className}, Term: ${key.split('-')[0]}, Class Number: ${key.split('-')[1]}, Email: ${email}`);
        });
    }
    
    for (const [key, notifications] of pendingNotifications.entries()) {
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
                for (const notification of notifications) {
                    const { email, className } = notification;
                    await sendEmail(email, className, availableSeats);
                    console.log(`Seats available for ${className}. Email sent to ${email}`);
                }
                pendingNotifications.delete(key); // Remove the key after notifying all pending requests
            }
        } catch (error) {
            console.error(`Error checking pending notification for ${key}:`, error);
        }
    }
}

module.exports = handler;
module.exports.pendingNotifications = pendingNotifications;
module.exports.sendEmail = sendEmail;
module.exports.checkPendingNotifications = checkPendingNotifications;
