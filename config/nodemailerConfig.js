const nodemailer = require("nodemailer");
require("dotenv").config();
// Function to Create Email Transporter
async function createTransporter() {
   try {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN,
      },
    });
   } catch (error) {
    console.error("Error Creating Email Transporter:", error);
    throw error;
   }
  }


module.exports = createTransporter;