import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import login from "../../Images/blockchain1.svg";
import { useAuth } from "../../providers/AuthProvider";
import "../../styles/styles.css";
import { Button, CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserLoginPage = () => {
  const [aadhar_no, setAadhar_no] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { loginAction } = useAuth();

  const isValidAadhar_no = (aadhar_no) => /^\d{12}$/.test(aadhar_no);

  const showToast = (message, type = "info") => {
    toast[type](message, { autoClose: 3000 });
  };

  const handleSendOtp = async () => {
    if (!aadhar_no) {
      showToast("Please enter Aadhar number first", "warning");
      return;
    }
    setOtpLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/users/send_otp",
        { aadhar_no }
      );
      setOtp(data.otp);
      showToast("OTP sent successfully!", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to send OTP", "error");
    } finally {
      setOtpLoading(false);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!aadhar_no) {
      newErrors.aadhar_no = "Aadhar number is required";
    } else if (!isValidAadhar_no(aadhar_no)) {
      newErrors.aadhar_no = "Invalid Aadhar number format";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    if (!otp) {
      newErrors.otp = "OTP is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const data = { aadhar_no, password, otp };
      loginAction(data, "user");
    } catch (error) {
      showToast(error.response?.data?.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-center font-weight-bold mb-4">User SignIn</h2>
          <Form
            className="w-100"
            style={{ maxWidth: "400px" }}
            onSubmit={handleSubmit}
          >
            <Form.Group controlId="formaadhar_no">
              <Form.Control
                type="text"
                placeholder="Aadhar Number"
                className="py-3 shadow-sm bg-light"
                value={aadhar_no}
                onChange={(e) => setAadhar_no(e.target.value)}
                isInvalid={!!errors.aadhar_no}
              />
              <Form.Control.Feedback type="invalid">
                {errors.aadhar_no}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Control
                type="password"
                placeholder="Password"
                className="py-3 shadow-sm bg-light"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Row className="mt-3">
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Enter OTP"
                  className="py-3 shadow-sm bg-light"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  isInvalid={!!errors.otp}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.otp}
                </Form.Control.Feedback>
              </Col>
              <Col xs="auto">
                <Button
                  variant="contained"
                  className="shadow-sm"
                  onClick={handleSendOtp}
                  disabled={otpLoading}
                  sx={{
                    backgroundColor: "#6c4ccf",
                    "&:hover": { backgroundColor: "#5a3bb5" },
                  }}
                >
                  {otpLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Send OTP"
                  )}
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
              {loading ? "Logging in..." : "Login"}
            </Button>
            <Button
              variant="outlined"
              className="w-100 mt-4 py-3 shadow-sm"
              onClick={() => navigate("/sign-up")}
              sx={{
                backgroundColor: "#fff",
                borderColor: "#6c4ccf",
                color: "#6c4ccf",
                "&:hover": { backgroundColor: "#6c4ccf", color: "#fff" },
              }}
            >
              Don't have an account? Sign Up
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

export default UserLoginPage;
