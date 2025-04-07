const bcrypt = require("bcrypt");
const { userModel } = require("../models/models.user");

// Get user details by Aadhar ID
async function getUserByAadhar(req, res) {
  const { aadharid } = req.params;
  try {
    const user = await userModel.findOne({ aadharid });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Error getting user details:", err);
    res.status(500).json({ message: "Error retrieving user details" });
  }
}

// Get user email by Aadhar ID
async function getUserMailByAadhar(req, res) {
  const { aadharid } = req.params;
  try {
    const user = await userModel.findOne({ aadharid });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ email: user.email });
  } catch (err) {
    console.error("Error getting user email:", err);
    res.status(500).json({ message: "Error retrieving user email" });
  }
}

// Save new user (sign up)
const SaveUser = async (req, res) => {
  try {
    const { aadharid } = req.body;
    const existingUser = await userModel.findOne({ aadharid });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new userModel(req.body);
    await user.save();

    res
      .status(201)
      .json({ message: "User signed up successfully", success: true, user });
  } catch (error) {
    console.error("Error saving user:", error);
    res
      .status(500)
      .json({ message: "Error saving user", error: error.message });
  }
};

// Register new user with hashed password
const registerUser = async (req, res) => {
  try {
    const { email, name, password, phoneNumber } = req.body;

    // Check if user exists
    const existingUser = await userModel.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email or phone number",
      });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      email,
      name,
      password: hashedPassword,
      phoneNumber,
    });

    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// User login function
async function loginUser(req, res) {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
}

module.exports = {
  getUserByAadhar,
  getUserMailByAadhar,
  SaveUser,
  registerUser,
  loginUser,
};
