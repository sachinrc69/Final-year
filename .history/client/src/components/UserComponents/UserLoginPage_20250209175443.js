import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import login from "../../Images/blockchain1.svg";
import "../../styles/styles.css";
import { Button, Snackbar, Alert } from "@mui/material";
import axios from "axios";

const UserLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate();

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  // Email validation regex
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Function to validate form fields
  const validateForm = () => {
    let newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Send email and password to backend for verification
      const response = await axios.post(
        "http://localhost:5000/api/users/user_login",
        { email, password }
      );

      // Handle successful response
      if (response.data.success) {
        showToast("Login successful!", "success");
        navigate("/dashboard");
      } else {
        showToast("Invalid email or password", "error");
      }
    } catch (error) {
      showToast("An error occurred. Please try again later.", "error");
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
          <h2 className="text-center font-weight-bold mb-4">User Login</h2>
          <Form
            className="w-100"
            style={{ maxWidth: "400px" }}
            onSubmit={handleSubmit}
          >
            <Form.Group controlId="formEmail">
              <Form.Control
                type="email"
                placeholder="Email"
                className="py-3 shadow-sm bg-light"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
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
              Login
            </Button>

            {/* Sign Up Button */}
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

      {/* MUI Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserLoginPage;
