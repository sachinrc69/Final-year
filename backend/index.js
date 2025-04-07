const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { aadharModel } = require("./models/models.aadhar");
const AdminModel = require("./models/models.admin"); // ✅ update path as needed

const userRoutes = require("./routes/routes.user");
const adminRoutes = require("./routes/routes.admin");
const aadharRoutes = require("./routes/routes.aadhar");
const app = express();

app.use(cookieParser());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(express.json());
app.use(cors());

const port = process.env.PORT;
const uri = process.env.DBURI;

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err));

// mongoose
//   .connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("MongoDB connected!");

//     const dummyData = [
//       {
//         aadhar_no: "123456789012",
//         email: "john.doe@example.com",
//         name: "John Doe",
//         age: 30,
//         phone: 9876543210,
//       },
//       {
//         aadhar_no: "234567890123",
//         email: "jane.smith@example.com",
//         name: "Jane Smith",
//         age: 28,
//         phone: 9123456789,
//       },
//       {
//         aadhar_no: "345678901234",
//         email: "rahul.sharma@example.com",
//         name: "Rahul Sharma",
//         age: 35,
//         phone: 9988776655,
//       },
//     ];

//     return aadharModel.insertMany(dummyData);
//   })
//   .then(() => {
//     console.log("Dummy documents inserted successfully!");
//     mongoose.disconnect();
//   })
//   .catch((err) => {
//     console.error("Error inserting data:", err);
//     mongoose.disconnect();
//   });
//console.log(adminRoutes);
//console.log(userRoutes);

// mongoose
//   .connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("MongoDB connected!");

//     const adminUsers = [
//       {
//         email: "sachinrc04@gmail.com",
//         name: "Sachin",
//         password: "qwertyui", // In real apps, hash before storing
//       },
//     ];

//     return AdminModel.insertMany(adminUsers);
//   })
//   .then(() => {
//     console.log("Dummy admin users inserted successfully!");
//     mongoose.disconnect();
//   })
//   .catch((err) => {
//     console.error("Error inserting admin users:", err);
//     mongoose.disconnect();
//   });

app.use("/api/users", userRoutes);
app.use("/api/aadhar", aadharRoutes);
app.use("/api/admin", adminRoutes);
app.listen(port, () => console.log(`Server listening on port ${port}`));
