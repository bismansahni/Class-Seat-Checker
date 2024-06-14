const express = require('express');
const dotenv = require('dotenv');
const checkingSeatsHandler = require('./checkingseats');

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
});
