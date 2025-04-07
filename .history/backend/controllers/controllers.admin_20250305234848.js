const bcrypt = require("bcrypt");
const Admin = require("../models/models.admin");
const { createSecretToken } = require("../services/JWTService");
const Election = require("../models/models.election");
const loginAdmin = async (req, res) => {
  console.log(Admin);
  const { email, password } = req.body;
  console.log("Admin Login Request:", { email, password });

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Ensure the password field exists
    if (!admin.password) {
      return res
        .status(500)
        .json({ message: "Server error: Password missing" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("Password Match:", isMatch);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    data = {
      email: admin.email,
      name: admin.name,
      role: "admin",
    };

    const token = createSecretToken(data);
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
const storeElectionResults = async (req, res) => {
  try {
    const { electionName, electionDescription, winner, candidates } = req.body;
    console.log("hello", electionDescription);
    // Validate required fields
    if (!electionName || !winner || !candidates) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new election result entry
    const newElection = new Election({
      electionName,
      electionDescription,
      winner,
      candidates,
    });

    await newElection.save();
    res.status(201).json({ message: "Election results stored successfully!" });
  } catch (error) {
    console.error("Error storing election results:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { loginAdmin, storeElectionResults };
