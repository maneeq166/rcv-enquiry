require('dotenv').config();
const express = require('express');
const configureExpress = require('./config/expressConfig');
const oAuth2Client = require('./utils/oAuthClient');

// Importing Routes
const homeRoutes = require('./routes/home.routes');
const formRoutes = require('./routes/form.routes');

const app = express();

// Configure Express
configureExpress(app);

// OAuth2 Setup
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Routes
app.use('/', homeRoutes);
app.use('/submit', formRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
});

// Export the app for testing
module.exports = app;
