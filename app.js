require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const user = require("./models/user");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// OAuth2 Credentials
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function createTransporter() {
  console.log("Client ID:", process.env.CLIENT_ID);
console.log("Client Secret:", process.env.CLIENT_SECRET);
console.log("Refresh Token:", process.env.REFRESH_TOKEN);

  const accessToken = await oAuth2Client.getAccessToken();
  
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });
}

app.get("/", (req, res) => {
  res.render("index", { success: false });
});

app.post("/submit", async (req, res) => {
  try {
    let { name, email, mobile, location, type, budget, timeline, income, preference, profession } = req.body;
    
    // Save user data to the database
    const newUser = new user({
      name, email, mobile, location, type, budget, timeline, income, preference, profession,
    });
    
    await newUser.save();

    // Create transporter
    const transporter = await createTransporter();

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "RCV Enquiry Submitted",
      text: `Hello ${name},\n\nThank you for submitting your enquiry. Our team will get back to you soon.\n\nDetails:\nName: ${name}\nMobile: ${mobile}\nEmail: ${email}\nLocation: ${location}\nFlat: ${type}\nBudget: ${budget}\nTimeline: ${timeline}\nIncome: ${income}\nLocality: ${preference}\nProfession: ${profession}\n\nBest Regards,\nRCV Team`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to", email);

    res.render("index", { success: true });

  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
