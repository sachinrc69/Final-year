const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema(
  {
    aadhar_no: {
      type: Number,
      required:true,
      unique: true
    },
    // email: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   trim: true,
    //   lowercase: true,
    // },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    }
  }
); 

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
      return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const userModel = mongoose.model("users", userSchema);
module.exports = {userModel,userSchema};
