import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import login from "../../Images/blockchain1.svg";
import "../../styles/styles.css";
import { Button, Snackbar, Alert } from "@mui/material"; // ✅ Import MUI components

const UserLoginPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userinfo");
    if (userInfo) {
      navigate("/events");
    }
  }, [navigate]);

  const showToast = (message, severity = "info") => {
    setToast({ open: true, message, severity });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) {
      showToast("Please fill all fields", "warning");
      return;
    }

    showToast("Login Successful!", "success");

    localStorage.setItem("userinfo", JSON.stringify({ email, name, phone }));
    navigate("/events");
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

      {/* ✅ MUI Toast Notification */}
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
