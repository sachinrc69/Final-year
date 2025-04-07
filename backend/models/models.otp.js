const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    aadhar_no: { type: Number, required: true, unique: true },
    otp: { type: String, required: true },
    otp_expiry: { type: Date, required: true },
});

const otpModel = mongoose.model("otps", otpSchema);

module.exports = otpModel