const mongoose = require("mongoose");
const aadharSchema = mongoose.Schema({
    aadhar_no: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: String,
    age: {
        type: Number,
        required: true
    },
    phone: Number
})

const aadharModel=mongoose.model("aadhar",aadharSchema)
module.exports={aadharModel,aadharSchema}