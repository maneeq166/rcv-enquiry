const express = require('express');
const router = express.Router();
const User = require("../models/user");
const createTransporter = require("../config/nodemailerConfig");
const sendWhatsAppMessage = require('../utils/whatsAppClient');

router.post("/", async (req, res) => {
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

module.exports = router;