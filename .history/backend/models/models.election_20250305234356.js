const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  votes: { type: Number, required: true },
});

const ElectionSchema = new mongoose.Schema({
  electionName: { type: String, required: true },
  electionDescription: { type: String, required: true },
  winner: { type: String, required: true },
  candidates: [CandidateSchema], // Array of candidates with votes
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Election", ElectionSchema);
