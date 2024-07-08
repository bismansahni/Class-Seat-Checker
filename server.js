// // const express = require('express');
// // const dotenv = require('dotenv');
// // const checkingSeatsHandler = require('./checkingseats');
// // const { pendingNotifications, sendEmail } = require('./checkingseats');
// // const schedule = require('node-schedule');

// // dotenv.config();

// // const app = express();
// // const port = process.env.PORT || 4567;

// // // Middleware to serve static files from the 'frontend' directory
// // app.use(express.static('frontend'));

// // // API endpoint to check seats
// // app.get('/checkSeats', checkingSeatsHandler);

// // // Start the server
// // app.listen(port, () => {
// //     console.log(`Server running on http://localhost:${port}`);
// //     // Schedule periodic checks every 20 seconds
// //     schedule.scheduleJob('*/20 * * * * *', () => {
// //         console.log('Running periodic seat availability check...');
// //         checkPendingNotifications();
// //     });
// // });

// // // Function to check pending notifications
// // async function checkPendingNotifications() {
// //     const fetch = await import('node-fetch').then(mod => mod.default);
// //     console.log('Checking pending notifications for the following classes:');
// //     for (const [key, { email, className }] of pendingNotifications.entries()) {
// //         console.log(`Class: ${className}, Term: ${key.split('-')[0]}, Class Number: ${key.split('-')[1]}`);
// //     }
    
// //     for (const [key, { email, className }] of pendingNotifications.entries()) {
// //         const [term, classNbr] = key.split('-');
// //         const url = `https://eadvs-cscc-catalog-api.apps.asu.edu/catalog-microservices/api/v1/search/classes?term=${term}&classNbr=${classNbr}`;
// //         try {
// //             const response = await fetch(url, {
// //                 headers: {
// //                     'Authorization': 'Bearer null',
// //                 },
// //             });
// //             if (!response.ok) {
// //                 throw new Error(`Unexpected response ${response.statusText}`);
// //             }

// //             const jsonResponse = await response.json();
// //             const totalSeats = jsonResponse.hits.hits[0]._source.ENRLCAP;
// //             const enrolledSeats = jsonResponse.hits.hits[0]._source.ENRLTOT;
// //             const availableSeats = totalSeats - enrolledSeats;

// //             if (availableSeats > 0) {
// //                 await sendEmail(email, className, availableSeats);
// //                 pendingNotifications.delete(key);
// //                 console.log(`Seats available for ${className}. Email sent to ${email}`);
// //             }
// //         } catch (error) {
// //             console.error(`Error checking pending notification for ${key}:`, error);
// //         }
// //     }
// // }



// const express = require('express');
// const dotenv = require('dotenv');
// const checkingSeatsHandler = require('./checkingseats');
// const { pendingNotifications, sendEmail, checkPendingNotifications } = require('./checkingseats');
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
    console.log('Pending notifications loaded');
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
