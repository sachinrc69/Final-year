import React, { useState, useEffect, useContext } from "react";
import Web3 from "web3";
import { toast, ToastContainer } from "react-toastify";
import "../../styles/VoterRegistration.css";
import axios from "axios";
import { BlockchainContext } from "../../providers/BlockChainProvider";
import { CircularProgress } from "@mui/material";

const VoterRegistration = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const { web3, account, contractInstance } = useContext(BlockchainContext);
  const [voterStatus, setVoterStatus] = useState(null);

  useEffect(() => {
    if (contractInstance && account) {
      fetchVoterStatus();
    }
  }, [contractInstance, account]);

  const fetchVoterStatus = async () => {
    try {
      const voter = await contractInstance.methods.voterDetails(account).call();
      if (voter.isRegistered) {
        setVoterStatus(voter);
        setIsRegistered(true);
      }
    } catch (error) {
      console.error("Error fetching voter status:", error);
    }
  };

  const showToast = (message, type = "info") => {
    toast[type](message, { autoClose: 3000 });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!/\d{12}$/.test(aadhaarNumber)) {
      setErrorMessage("Invalid Aadhaar number. Must be 12 digits.");
      return;
    }
    setLoadingOtp(true);
    try {
      await axios.post("http://localhost:5000/api/users/send_otp", {
        aadhar_no: aadhaarNumber,
      });
      showToast("OTP sent successfully!", "success");
      setOtpSent(true);
      setErrorMessage("");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to send OTP", "error");
    }
    setLoadingOtp(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoadingVerify(true);
    try {
      await axios.post("http://localhost:5000/api/users/verifyOTP", {
        aadhar_no: aadhaarNumber,
        otp,
      });
      showToast("OTP Verified!", "success");
      await contractInstance.methods
        .registerVoter(name, aadhaarNumber)
        .send({ from: account, gas: 1000000 });
      setSuccessMessage("Voter registered successfully!");
      setOtpSent(false);
      setErrorMessage("");
      setAadhaarNumber("");
      setName("");
      setOtp("");
      fetchVoterStatus();
    } catch (error) {
      setErrorMessage("Registration failed. Please try again.");
      showToast(
        error.response?.data?.message || "Failed to verify OTP",
        "error"
      );
    }
    setLoadingVerify(false);
  };

  return (
    <div className="container">
      <h2>Voter Registration</h2>
      {voterStatus ? (
        <div className="alert alert-info mt-3">
          <h4>Registration Status</h4>
          <p>
            <strong>Name:</strong> {voterStatus.name}
          </p>
          <p>
            <strong>Address:</strong> {voterStatus.voterAddress}
          </p>
          <p>
            <strong>Verified:</strong>{" "}
            {voterStatus.isVerified ? "✅ Verified" : "❌ Not Verified"}
          </p>
          <p>
            <strong>Has Voted:</strong>{" "}
            {voterStatus.hasVoted ? "🗳️ Yes" : "❌ No"}
          </p>
        </div>
      ) : !otpSent ? (
        <form onSubmit={handleSendOtp}>
          <div className="form-group">
            <label htmlFor="aadhaarNumber">Aadhaar Number:</label>
            <input
              type="text"
              id="aadhaarNumber"
              className="form-control"
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
              required
              disabled={isRegistered}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isRegistered}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-3"
            disabled={isRegistered || loadingOtp}
          >
            {loadingOtp ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <div className="form-group">
            <label htmlFor="otp">Enter OTP:</label>
            <input
              type="text"
              id="otp"
              className="form-control"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-3"
            disabled={loadingVerify}
          >
            {loadingVerify ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>
      )}
      {successMessage && (
        <div className="alert alert-success mt-3">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="alert alert-danger mt-3">{errorMessage}</div>
      )}
      <ToastContainer position="top-right" />
    </div>
  );
};

export default VoterRegistration;
