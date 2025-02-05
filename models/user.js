const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/testing')

const userSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    email: String,
    location: String,
    type: String,
    budget: String,
    timeline: String,
    income: String,
    preference: String,
    profession: String,
});

module.exports = mongoose.model("User", userSchema);