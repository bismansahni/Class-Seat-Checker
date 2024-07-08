// // const dotenv = require('dotenv');

// // dotenv.config();

// // const EMAILJS_USER_ID = process.env.EMAILJS_USER_ID;
// // const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
// // const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
// // const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

// // const pendingNotifications = new Map();

// // async function handler(req, res) {
// //     if (req.method !== 'GET') {
// //         return res.status(405).json({ message: 'Method Not Allowed' });
// //     }

// //     const { term, classNbr, email } = req.query;

// //     try {
// //         const fetch = await import('node-fetch').then(mod => mod.default);
// //         const url = `https://eadvs-cscc-catalog-api.apps.asu.edu/catalog-microservices/api/v1/search/classes?term=${term}&classNbr=${classNbr}`;
// //         const response = await fetch(url, {
// //             headers: {
// //                 'Authorization': 'Bearer null',
// //             },
// //         });

// //         if (!response.ok) {
// //             throw new Error(`Unexpected response ${response.statusText}`);
// //         }

// //         const jsonResponse = await response.json();
// //         const totalSeats = jsonResponse.hits.hits[0]._source.ENRLCAP;
// //         const enrolledSeats = jsonResponse.hits.hits[0]._source.ENRLTOT;
// //         const availableSeats = totalSeats - enrolledSeats;
// //         const className = jsonResponse.hits.hits[0]._source.COURSETITLELONG;

// //         let message;
// //         if (availableSeats > 0) {
// //             await sendEmail(email, className, availableSeats);
// //             message = `Class: ${className}, Available Seats: ${availableSeats}`;
// //         } else {
// //             pendingNotifications.set(`${term}-${classNbr}`, { email, className });
// //             message = `Class: ${className}, Available Seats: 0. Right now there are no seats available. You will be notified via email as soon as a seat becomes available.`;
// //         }

// //         res.status(200).json({
// //             success: true,
// //             className,
// //             seats: availableSeats,
// //             message,
// //         });
// //     } catch (error) {
// //         console.error(`Error in API handler:`, error);
// //         res.status(500).json({
// //             success: false,
// //             message: error.message,
// //         });
// //     }
// // }

// // async function sendEmail(email, className, seats) {
// //     const fetch = await import('node-fetch').then(mod => mod.default);
// //     const emailParams = {
// //         from_name: 'Class Seat Checker',
// //         to_email: email,
// //         className: className,
// //         seats: seats,
// //         reply_to: 'no-reply@classseatchecker.com',
// //     };

// //     const requestBody = {
// //         service_id: EMAILJS_SERVICE_ID,
// //         template_id: EMAILJS_TEMPLATE_ID,
// //         user_id: EMAILJS_USER_ID,
// //         template_params: emailParams,
// //     };

// //     const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
// //         method: 'POST',
// //         headers: {
// //             'Content-Type': 'application/json',
// //             'Authorization': `Bearer ${EMAILJS_PRIVATE_KEY}`,
// //         },
// //         body: JSON.stringify(requestBody),
// //     });

// //     if (!response.ok) {
// //         throw new Error(`Email sending failed: ${response.statusText}`);
// //     }
// // }

// // module.exports = handler;
// // module.exports.pendingNotifications = pendingNotifications;
// // module.exports.sendEmail = sendEmail;






// const dotenv = require('dotenv');

// dotenv.config();

// const EMAILJS_USER_ID = process.env.EMAILJS_USER_ID;
// const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
// const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
// const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

// const pendingNotifications = new Map();

// async function handler(req, res) {
//     if (req.method !== 'GET') {
//         return res.status(405).json({ message: 'Method Not Allowed' });
//     }

//     const { term, classNbr, email } = req.query;

//     try {
//         const fetch = await import('node-fetch').then(mod => mod.default);
//         const url = `https://eadvs-cscc-catalog-api.apps.asu.edu/catalog-microservices/api/v1/search/classes?term=${term}&classNbr=${classNbr}`;
//         const response = await fetch(url, {
//             headers: {
//                 'Authorization': 'Bearer null',
//             },
//         });

//         if (!response.ok) {
//             throw new Error(`Unexpected response ${response.statusText}`);
//         }

//         const jsonResponse = await response.json();
//         const totalSeats = jsonResponse.hits.hits[0]._source.ENRLCAP;
//         const enrolledSeats = jsonResponse.hits.hits[0]._source.ENRLTOT;
//         const availableSeats = totalSeats - enrolledSeats;
//         const className = jsonResponse.hits.hits[0]._source.COURSETITLELONG;

//         let message;
//         if (availableSeats > 0) {
//             await sendEmail(email, className, availableSeats);
//             message = `Class: ${className}, Available Seats: ${availableSeats}`;
//         } else {
//             const key = `${term}-${classNbr}`;
//             if (!pendingNotifications.has(key)) {
//                 pendingNotifications.set(key, []);
//             }
//             pendingNotifications.get(key).push({ email, className });
//             message = `Class: ${className}, Available Seats: 0. Right now there are no seats available. You will be notified via email as soon as a seat becomes available.`;
//         }

//         res.status(200).json({
//             success: true,
//             className,
//             seats: availableSeats,
//             message,
//         });
//     } catch (error) {
//         console.error(`Error in API handler:`, error);
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// }

// async function sendEmail(email, className, seats) {
//     const fetch = await import('node-fetch').then(mod => mod.default);
//     const emailParams = {
//         from_name: 'Class Seat Checker',
//         to_email: email,
//         className: className,
//         seats: seats,
//         reply_to: 'no-reply@classseatchecker.com',
//     };

//     const requestBody = {
//         service_id: EMAILJS_SERVICE_ID,
//         template_id: EMAILJS_TEMPLATE_ID,
//         user_id: EMAILJS_USER_ID,
//         template_params: emailParams,
//     };

//     const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${EMAILJS_PRIVATE_KEY}`,
//         },
//         body: JSON.stringify(requestBody),
//     });

//     if (!response.ok) {
//         throw new Error(`Email sending failed: ${response.statusText}`);
//     }
// }

// async function checkPendingNotifications() {
//     const fetch = await import('node-fetch').then(mod => mod.default);
//     console.log('Checking pending notifications for the following classes:');
    
//     for (const [key, notifications] of pendingNotifications.entries()) {
//         notifications.forEach(({ email, className }) => {
//             console.log(`Class: ${className}, Term: ${key.split('-')[0]}, Class Number: ${key.split('-')[1]}, Email: ${email}`);
//         });
//     }
    
//     for (const [key, notifications] of pendingNotifications.entries()) {
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
//                 for (const notification of notifications) {
//                     const { email, className } = notification;
//                     await sendEmail(email, className, availableSeats);
//                     console.log(`Seats available for ${className}. Email sent to ${email}`);
//                 }
//                 pendingNotifications.delete(key); // Remove the key after notifying all pending requests
//             }
//         } catch (error) {
//             console.error(`Error checking pending notification for ${key}:`, error);
//         }
//     }
// }

// module.exports = handler;
// module.exports.pendingNotifications = pendingNotifications;
// module.exports.sendEmail = sendEmail;
// module.exports.checkPendingNotifications = checkPendingNotifications;






const dotenv = require('dotenv');
const { savePendingNotifications, loadPendingNotifications } = require('./storage');

dotenv.config();

const EMAILJS_USER_ID = process.env.EMAILJS_USER_ID;
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

let pendingNotifications = new Map();

(async () => {
    pendingNotifications = await loadPendingNotifications();
    console.log('Pending notifications loaded');
    cleanUpOldNotifications();
})();

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { term, classNbr, email } = req.query;

    try {
        const fetch = await import('node-fetch').then(mod => mod.default);
        const url = `https://eadvs-cscc-catalog-api.apps.asu.edu/catalog-microservices/api/v1/search/classes?term=${term}&classNbr=${classNbr}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer null',
            },
        });

        if (!response.ok) {
            throw new Error(`Unexpected response ${response.statusText}`);
        }

        const jsonResponse = await response.json();

        // Check if the class data is present
        if (!jsonResponse.hits.hits.length) {
            return res.status(400).json({ 
                success: false, 
                message: 'The term number or class number is incorrect.' 
            });
        }

        const totalSeats = jsonResponse.hits.hits[0]._source.ENRLCAP;
        const enrolledSeats = jsonResponse.hits.hits[0]._source.ENRLTOT;
        const availableSeats = totalSeats - enrolledSeats;
        const className = jsonResponse.hits.hits[0]._source.COURSETITLELONG;

        let message;
        if (availableSeats > 0) {
            await sendEmail(email, className, availableSeats);
            message = `Class: ${className}, Available Seats: ${availableSeats}`;
        } else {
            const key = `${term}-${classNbr}`;
            if (!pendingNotifications.has(key)) {
                pendingNotifications.set(key, []);
            }
            pendingNotifications.get(key).push({ email, className, timestamp: Date.now() });
            await savePendingNotifications(pendingNotifications);
            console.log(`New entry created: Email: ${email}, Class: ${classNbr}, Term: ${term}`);
            message = `Class: ${className}, Available Seats: 0. Right now there are no seats available. You will be notified via email as soon as a seat becomes available.`;
        }

        res.status(200).json({
            success: true,
            className,
            seats: availableSeats,
            message,
        });
    } catch (error) {
        console.error(`Error in API handler:`, error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function stopTrackingHandler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { term, classNbr, email } = req.query;

    const key = `${term}-${classNbr}`;
    if (pendingNotifications.has(key)) {
        const notifications = pendingNotifications.get(key);
        const updatedNotifications = notifications.filter(notification => notification.email !== email);
        const className = notifications[0]?.className; // Get the class name from the existing notifications
        if (updatedNotifications.length > 0) {
            pendingNotifications.set(key, updatedNotifications);
        } else {
            pendingNotifications.delete(key);
        }
        await savePendingNotifications(pendingNotifications);
        console.log(`Entry destroyed: Email: ${email}, Class: ${classNbr}, Term: ${term}`);
        return res.status(200).json({
            success: true,
            className,
            message: `Stopped tracking for class ${classNbr} in term ${term} for ${email}.`,
        });
    } else {
        return res.status(404).json({
            success: false,
            message: `No tracking found for class ${classNbr} in term ${term} for ${email}.`,
        });
    }
}

async function sendEmail(email, className, seats) {
    const fetch = await import('node-fetch').then(mod => mod.default);
    const emailParams = {
        from_name: 'Class Seat Checker',
        to_email: email,
        className: className,
        seats: seats,
        reply_to: 'no-reply@classseatchecker.com',
    };

    const requestBody = {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_USER_ID,
        template_params: emailParams,
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${EMAILJS_PRIVATE_KEY}`,
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        throw new Error(`Email sending failed: ${response.statusText}`);
    }
}

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
                await savePendingNotifications(pendingNotifications);
            }
        } catch (error) {
            console.error(`Error checking pending notification for ${key}:`, error);
        }
    }
}

async function cleanUpOldNotifications() {
    const now = Date.now();
    const hundredDaysInMillis = 100 * 24 * 60 * 60 * 1000;

    let changed = false;
    for (const [key, notifications] of pendingNotifications.entries()) {
        const updatedNotifications = notifications.filter(notification => (now - notification.timestamp) < hundredDaysInMillis);
        if (updatedNotifications.length > 0) {
            pendingNotifications.set(key, updatedNotifications);
        } else {
            pendingNotifications.delete(key);
            console.log(`Entry destroyed after 100 days: Class: ${key.split('-')[1]}, Term: ${key.split('-')[0]}`);
        }
        changed = true;
    }

    if (changed) {
        await savePendingNotifications(pendingNotifications);
    }
}

module.exports = {
    handler,
    stopTrackingHandler,
    pendingNotifications,
    sendEmail,
    checkPendingNotifications,
    cleanUpOldNotifications
};
