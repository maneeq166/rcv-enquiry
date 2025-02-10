const express = require("express");
const path = require("path");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const configureExpress = (app) => {
    // Security Middleware
    app.use(helmet());
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    }));

    // Express Configuration
    app.set("view engine", "ejs");
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, "..", "public")));

    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).render('error', { error: 'Something went wrong!' });
    });
};

module.exports = configureExpress;
