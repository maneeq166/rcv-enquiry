const { google } = require("googleapis");
require("dotenv").config();

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REDIRECT_URI) {
    throw new Error("Missing required OAuth2 environment variables");
}

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

module.exports = oAuth2Client;