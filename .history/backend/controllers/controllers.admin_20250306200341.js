const bcrypt = require("bcrypt");
const Admin = require("../models/models.admin");
const { createSecretToken } = require("../services/JWTService");
const Election = require("../models/models.election");

const loginAdmin = async (req, res) => {
  console.log(Admin);
  const { email, password } = req.body;
  console.log("Admin Login Request:", { email, password });

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (!admin.password) {
      return res
        .status(500)
        .json({ message: "Server error: Password missing" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("Password Match:", isMatch);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const data = {
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

const storeElection = async (req, res) => {
  try {
    const { electionName, electionDescription, winner, candidates } = req.body;

    if (!electionName || !winner || !candidates) {
      return res.status(400).json({ message: "Missing required fields" });
    }

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

const getAllElections = async (req, res) => {
  try {
    const elections = await Election.find();
    res.status(200).json({ success: true, elections });
  } catch (error) {
    console.error("Error fetching elections:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { loginAdmin, storeElection, getAllElections };
