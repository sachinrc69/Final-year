import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import login from "../../Images/blockchain1.svg";
import "../../styles/styles.css";
import { Button, CircularProgress } from "@mui/material"; // ✅ Import CircularProgress for spinner
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useAuth } from "../../providers/AuthProvider";

const UserSignUpPage = () => {
  const [name, setName] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false); // ✅ New state for OTP loading
  const { loginAction } = useAuth();

  const navigate = useNavigate();

  const showToast = (message, type = "info") => {
    toast[type](message, { autoClose: 3000 });
  };

  const handleSendOtp = async () => {
    if (!aadhar) {
      showToast("Please enter Aadhar number first", "warning");
      return;
    }

    setOtpLoading(true); // Start loading spinner
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/users/send_otp",
        { aadhar_no: aadhar }
      );
      setOtp(data.otp);
      showToast("OTP sent successfully!", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to send OTP", "error");
    } finally {
      setOtpLoading(false); // Stop loading spinner
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !aadhar || !password || !confirmPassword || !otp) {
      showToast("Please fill all fields", "warning");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/users/sign_up",
        {
          name,
          aadhar_no: aadhar,
          password,
          otp,
        }
      );

      showToast("Registration Successful! Please login.", "success");

      localStorage.setItem("userinfo", JSON.stringify(data));
      setTimeout(() => navigate("/sign-in"), 3000);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Registration Failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate("/sign-in");
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center bg-light"
      style={{ minHeight: "100vh" }}
    >
      <Row
        className="shadow-lg rounded-lg bg-white overflow-hidden w-100"
        style={{ maxWidth: "1200px" }}
      >
        <Col
          lg={6}
          className="d-flex flex-column justify-content-center align-items-center p-5"
        >
          <h2 className="text-center font-weight-bold mb-4">User SignUp</h2>
          <Form
            className="w-100"
            style={{ maxWidth: "400px" }}
            onSubmit={handleSubmit}
          >
            <Form.Group controlId="formaadhar" className="mt-3">
              <Form.Control
                type="text"
                placeholder="Aadhar Number"
                className="py-3 shadow-sm bg-light"
                value={aadhar}
                onChange={(e) => setAadhar(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formName" className="mt-3">
              <Form.Control
                type="text"
                placeholder="Name"
                className="py-3 shadow-sm bg-light"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Control
                type="password"
                placeholder="Password"
                className="py-3 shadow-sm bg-light"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formConfirmPassword" className="mt-3">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                className="py-3 shadow-sm bg-light"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Row className="mt-3">
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Enter OTP"
                  className="py-3 shadow-sm bg-light"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </Col>
              <Col xs="auto">
                <Button
                  variant="contained"
                  className="shadow-sm"
                  onClick={handleSendOtp}
                  disabled={otpLoading} // ✅ Disable while sending OTP
                  sx={{
                    backgroundColor: "#6c4ccf",
                    "&:hover": { backgroundColor: "#5a3bb5" },
                  }}
                >
                  {otpLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Send OTP"
                  )}{" "}
                  {/* ✅ Show spinner */}
                </Button>
              </Col>
            </Row>

            <Button
              variant="contained"
              type="submit"
              className="w-100 mt-4 py-3 shadow-sm"
              disabled={loading}
              sx={{
                backgroundColor: "#6c4ccf",
                "&:hover": { backgroundColor: "#5a3bb5" },
              }}
            >
              {loading ? "Loading..." : "Sign Up"}
            </Button>

            <Button
              variant="outlined"
              className="w-100 mt-4 py-3 shadow-sm"
              onClick={handleSignUp}
              sx={{
                backgroundColor: "#fff",
                borderColor: "#6c4ccf",
                color: "#6c4ccf",
                "&:hover": { backgroundColor: "#6c4ccf", color: "#fff" },
              }}
            >
              Already have an account? Sign In
            </Button>
          </Form>
        </Col>

        <Col
          lg={6}
          className="d-none d-lg-flex justify-content-center align-items-center bg-primary text-white"
        >
          <img
            className="m-5"
            src={login}
            alt="Illustration"
            style={{
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              height: "500px",
              width: "100%",
            }}
          />
        </Col>
      </Row>

      <ToastContainer position="top-right" />
    </Container>
  );
};

export default UserSignUpPage;
