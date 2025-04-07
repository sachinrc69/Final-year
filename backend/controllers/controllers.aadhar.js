const { aadharModel } = require("../models/models.aadhar");


// Get user details by Aadhar ID
async function getUserByAadhar(req, res) {
  const { aadhar_no } = req.params;
  try {
    const user = await aadharModel.findOne({ aadhar_no });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Error getting user details:", err);
    res.status(500).json({ message: "Error retrieving user details" });
  }
}

// Get user email by Aadhar ID
async function getUserMailByAadhar(req, res) {
  const { aadhar_no } = req.params;
  try {
    const user = await aadharModel.findOne({ aadhar_no });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ email: user.email });
  } catch (err) {
    console.error("Error getting user email:", err);
    res.status(500).json({ message: "Error retrieving user email" });
  }
}

//save aadhar records
const addUser = async (req, res) => {
  try {
    const { aadhar_no } = req.body;
    const existingUser = await aadharModel.findOne({ aadhar_no });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new aadharModel(req.body);
    await user.save();

    res
      .status(201)
      .json({ message: "aadhar detials added successfully", success: true, user });
  } catch (error) {
    console.error("Error adding user:", error);
    res
      .status(500)
      .json({ message: "Error adding user", error: error.message });
  }
};

module.exports = {addUser,getUserByAadhar,getUserMailByAadhar}