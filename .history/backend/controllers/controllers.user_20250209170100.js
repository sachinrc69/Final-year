const { userModel } = require("../models/models.user");

async function getUserByAadhar(req, res) {
  const { aadharid } = req.params;
  try {
    const user = await userModel.findOne({ aadharid: aadharid });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error in getting user details" });
  }
}

async function getUserMailByAadhar(req, res) {
  const { aadharid } = req.params;
  try {
    const user = await userModel.findOne({ aadharid: aadharid });
    console.log(user, "\n", user.email);
    res.status(200).json(user.email);
  } catch (err) {
    res.status(500).json({ message: "Error in getting user details" });
  }
}

const SaveUser = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({
      aadharid: req.body.aadharid,
    });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    } else {
      const user = new userModel(req.body);
      await user.save();
      res
        .status(200)
        .json({ message: "User signed in successfully", success: true, user });
    }
  } catch (error) {
    console.error(error);
  }
};
async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Return a success message with user details
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
module.exports = { getUserByAadhar, getUserMailByAadhar, SaveUser, loginUser };
