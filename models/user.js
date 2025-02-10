const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../utils/dbClient');

// Connect to MongoDB
connectDB();

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        mobile: { type: String, required: true },
        email: { type: String, required: true },
        location: { type: String, required: true },
        type: { type: String, required: true },
        budget: { type: String, required: true },
        timeline: { type: String, required: true },
        income: { type: String, required: true },
        preference: { type: String, required: true },
        profession: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
