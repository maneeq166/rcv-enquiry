require("dotenv").config();
const express = require("express");
const path = require("path");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const oAuth2Client = require('./utils/oAuthClient');
// Importing Routes
const homeRoutes = require('./routes/home.routes');
const formRoutes = require('./routes/form.routes');

const app = express();

// Security Middleware
app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));

// Express Configuration
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Routes
app.use('/', homeRoutes);
app.use('/submit', formRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
});

// Export the app for testing
module.exports = app;