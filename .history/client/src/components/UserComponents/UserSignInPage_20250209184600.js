import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import login from "../../Images/blockchain1.svg";
import "../../styles/styles.css";
import { Button } from "@mui/material"; // ✅ Import MUI components
import { toast, ToastContainer } from "react-toastify"; // ✅ Import Toastify
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toastify styles

const UserLoginPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ Added confirm password
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userinfo");
    if (userInfo) {
      navigate("/events");
    }
  }, [navigate]);

  // ✅ Show toast notifications
  const showToast = (message, type = "info") => {
    toast[type](message, { autoClose: 3000 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword || !phone) {
      showToast("Please fill all fields", "warning");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }

    showToast("Login Successful!", "success");

    localStorage.setItem("userinfo", JSON.stringify({ email, name, phone }));
    setTimeout(() => navigate("/events"), 3000); // ✅ Wait 3 seconds before redirecting
  };

  // Function to handle navigation to the sign-in page
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
          <h2 className="text-center font-weight-bold mb-4">User Login</h2>
          <Form
            className="w-100"
            style={{ maxWidth: "400px" }}
            onSubmit={handleSubmit}
          >
            <Form.Group controlId="formName">
              <Form.Control
                type="text"
                placeholder="Name"
                className="py-3 shadow-sm bg-light"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mt-3">
              <Form.Control
                type="email"
                placeholder="Email"
                className="py-3 shadow-sm bg-light"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            {/* ✅ Confirm Password Field */}
            <Form.Group controlId="formConfirmPassword" className="mt-3">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                className="py-3 shadow-sm bg-light"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPhone" className="mt-3">
              <Form.Control
                type="text"
                placeholder="Phone Number"
                className="py-3 shadow-sm bg-light"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
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

      {/* ✅ React-Toastify Container */}
      <ToastContainer position="top-right" />
    </Container>
  );
};

export default UserLoginPage;
