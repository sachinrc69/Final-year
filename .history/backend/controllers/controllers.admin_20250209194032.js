const Admin = require("../models/models.admin"); // ✅ Ensure this path is correct
//console.log(Admin);
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

    // Compare passwords (Plain-text match)
    if (admin.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      admin: {
        email: admin.email,
        name: admin.name,
        phoneNumber: admin.phoneNumber,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

module.exports = { loginAdmin };
