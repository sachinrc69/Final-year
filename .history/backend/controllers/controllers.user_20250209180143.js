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
const registerUser = async (req, res) => {
  try {
    const { email, name, password, phoneNumber } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email or phone number",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      name,
      password,
      phoneNumber,
    });
    await newUser.save();
    res.status(201).json({ message: "User saved successfully", user: newUser });
  } catch (error) {
    console.error("Error occurred:", error); // Log the error
    res
      .status(500)
      .json({ message: "Error saving user", error: error.message });
  }
};
async function loginUser(req, res) {
  console.log(email, password);
  const { email, password } = req.body;
  console.log(email, password);
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
module.exports = {
  getUserByAadhar,
  getUserMailByAadhar,
  SaveUser,
  registerUser,
  loginUser,
};
