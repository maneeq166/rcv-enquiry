require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const user = require("./models/user");
const nodemailer = require("nodemailer");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, 
  service: "gmail",
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APPPASS,
  },
});

// Verify connection to email server
transporter.verify((error, success) => {
  if (error) {
    console.log("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

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

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "RCV Enquiry Submitted",
      text: `Hello ${name},\n\nThank you for submitting your enquiry. Our team will get back to you soon.\n\nDetails:\nMobile: ${mobile}\nLocation: ${location}\nBudget: ${budget}\n\nBest Regards,\nRCV Team`,
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
