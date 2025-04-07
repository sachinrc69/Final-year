const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const userRoutes = require("./routes/routes.user");
const adminRoutes = require("./routes/routes.admin");
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

app.use("/api/users", userRoutes);
app.use("/api/admin", userRoutes);
app.listen(port, () => console.log(`Server listening on port ${port}`));
