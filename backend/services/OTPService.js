const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

// Configure transporter with your email provider's SMTP settings
const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email provider (e.g., Gmail, Outlook, SMTP service)
    auth: {
        user: process.env.EMAIL_USER, // Store credentials in .env
        pass: process.env.EMAIL_PASS,
    },
});

// Function to generate a 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP email
const sendOTP = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            text: `Your One-Time Password (OTP) is: ${otp}. It is valid for 5 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent successfully to ${email}`);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send OTP");
    }
};

module.exports = { generateOTP, sendOTP };
