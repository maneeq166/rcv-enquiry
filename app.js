require("dotenv").config();
const express = require("express");
const path = require("path");
const oAuth2Client = require('./utils/oAuthClient');
// Importing Routes
const homeRoutes = require('./routes/home.routes');
const formRoutes = require('./routes/form.routes');

const app = express();
// Express Configuration
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Routes
app.use('/', homeRoutes);
app.use('/submit', formRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});

// Export the app for testing
module.exports = app;