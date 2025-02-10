const { google } = require("googleapis");

// OAuth2 Credentials for Gmail API
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

module.exports = oAuth2Client;