require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const User = require("./models/user"); // Ensure this model is correctly defined

const app = express();
// Express Configuration
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// OAuth2 Credentials for Gmail API
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Function to Create Email Transporter
async function createTransporter() {
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
}

// Function to Send WhatsApp Message
async function sendWhatsAppMessage(to, message) {
  try {
    const url = `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

    const response = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: to, // Format: "91XXXXXXXXXX" (International Format)
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("WhatsApp Message Sent:", response.data);
  } catch (error) {
    console.error("Error Sending WhatsApp Message:", error.response ? error.response.data : error.message);
  }
}

// Home Route
app.get("/", (req, res) => {
  res.render("index", { success: false });
});

// Form Submission Route
app.post("/submit", async (req, res) => {
  try {
    const { name, email, mobile, location, type, budget, timeline, income, preference, profession } = req.body;

    // Save User Data to Database
    const newUser = new User({
      name,
      email,
      mobile,
      location,
      type,
      budget,
      timeline,
      income,
      preference,
      profession,
    });

    await newUser.save();

    // Create Email Transporter
    const transporter = await createTransporter();

    // Email Options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "RCV Enquiry Submitted",
      text: `Hello ${name},\n\nThank you for submitting your enquiry. Our team will get back to you soon.\n\nDetails:\nName: ${name}\nMobile: ${mobile}\nEmail: ${email}\nLocation: ${location}\nFlat: ${type}\nBudget: ${budget}\nTimeline: ${timeline}\nIncome: ${income}\nLocality: ${preference}\nProfession: ${profession}\n\nBest Regards,\nRCV Team`,
    };

    // Send Email
    await transporter.sendMail(mailOptions);
    console.log("Email Sent to:", email);

    // WhatsApp Message
    const whatsappMessage = `Hello ${name},\n\nThank you for submitting your enquiry. Our team will get back to you soon.\n\nDetails:\nName: ${name}\nMobile: ${mobile}\nEmail: ${email}\nLocation: ${location}\nFlat: ${type}\nBudget: ${budget}\nTimeline: ${timeline}\nIncome: ${income}\nLocality: ${preference}\nProfession: ${profession}\n\nBest Regards,\nRCV Team`;

    await sendWhatsAppMessage(mobile, whatsappMessage);

    res.render("index", { success: true });

  } catch (error) {
    console.error("Error Occurred:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});