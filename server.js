


const express = require('express');
const dotenv = require('dotenv');
const checkingSeatsHandler = require('./checkingseats');
const { pendingNotifications, sendEmail, checkPendingNotifications, stopTrackingHandler, cleanUpOldNotifications } = require('./checkingseats');
const schedule = require('node-schedule');
const { loadPendingNotifications } = require('./storage');

dotenv.config();

const app = express();
const port = process.env.PORT || 4567;

// Middleware to serve static files from the 'frontend' directory
app.use(express.static('frontend'));

// API endpoint to check seats
app.get('/checkSeats', checkingSeatsHandler.handler);

// API endpoint to stop tracking
app.post('/stopTracking', stopTrackingHandler);

// Load pending notifications when the server starts
(async () => {
    const loadedPendingNotifications = await loadPendingNotifications();
    for (const [key, value] of loadedPendingNotifications.entries()) {
        pendingNotifications.set(key, value);
    }
    console.log('Pending notifications loaded from server file');
    cleanUpOldNotifications(); // Initial cleanup on server start
})();

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    // Schedule periodic checks every 20 seconds
    schedule.scheduleJob('*/20 * * * * *', () => {
        console.log('Running periodic seat availability check...');
        checkPendingNotifications();
        cleanUpOldNotifications(); // Cleanup old notifications periodically
    });
});
