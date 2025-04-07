const bcrypt = require("bcrypt");
const { userModel } = require("../models/models.user");
const { aadharModel } = require("../models/models.aadhar");
const OTPService = require("../services/OTPService"); // Service to generate and send OTP
const otpModel = require("../models/models.otp");
const { createSecretToken } = require("../services/JWTService");
const { verify } = require("jsonwebtoken");

// Sending OTP
const userVerification = async (req, res) => {
  try {
    const { aadhar_no } = req.body;

    // Validate request body
    if (!aadhar_no) {
      return res.status(400).json({ message: "Aadhar number is required" });
    }

    // Check if user exists in Aadhar database
    const aadharUser = await aadharModel.findOne({ aadhar_no });
    if (!aadharUser) {
      return res.status(404).json({ message: "Aadhar details not found" });
    }

    const email = aadharUser.email;
    if (!email) {
      return res
        .status(400)
        .json({ message: "No email found for this Aadhar number" });
    }

    // Generate and send OTP
    const otp = OTPService.generateOTP(); // Implement OTP generation
    await OTPService.sendOTP(email, otp); // Implement email sending

    // Store OTP temporarily in the database
    await otpModel.updateOne(
      { aadhar_no },
      { $set: { otp, otp_expiry: Date.now() + 300000 } }, // 5 minutes expiry
      { upsert: true }
    );

    return res.status(200).json({ message: "OTP sent successfully", email });
  } catch (error) {
    console.error("Error in userVerification:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Sign up
const registerUser = async (req, res) => {
  try {
    const { aadhar_no, name, password, otp } = req.body;
    console.log();
    // Validate request body
    if (!aadhar_no || !name || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user and verify OTP
    const otps = await otpModel.findOne({ aadhar_no });
    if (!otps || otps.otp !== otp || otps.otp_expiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const newUser = new userModel({
      aadhar_no,
      name,
      password,
    });
    // Register the user
    await newUser.save();

    return res
      .status(201)
      .json({ message: "User registered successfully", name, aadhar_no });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// OTP Verification
async function verifyOTP(req, res) {
  const { aadhar_no, otp } = req.body;
  const otps = await otpModel.findOne({ aadhar_no });
  console.log(otps.otp, "---HEllo---", otp);
  if (!otps || otps.otp !== otp || otps.otp_expiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  } else {
    return res.status(200).json({ message: "OTP Verified!!" });
  }
}

// Login
async function loginUser(req, res) {
  const { aadhar_no, password, otp } = req.body;
  console.log("Login Request Received:", { aadhar_no, password });

  try {
    // Check if user exists
    const user = await userModel.findOne({ aadhar_no });
    console.log(user);
    //console.log("User Found:", user); // Debugging statement
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure the password field exists
    if (!user.password) {
      console.error("User password is missing in the database");
      return res
        .status(500)
        .json({ message: "Server error: Password missing" });
    }

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const otps = await otpModel.findOne({ aadhar_no });
    if (!otps || otps.otp !== otp || otps.otp_expiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    data = {
      aadhar_no: user.aadhar_no,
      name: user.name,
      role: "user",
    };
    const token = createSecretToken(data);
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
}

module.exports = {
  registerUser,
  loginUser,
  userVerification,
  verifyOTP,
};
