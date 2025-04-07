import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import login from "../../Images/blockchain1.svg";
import "../../styles/styles.css";
import { Button as MUIButton } from "@mui/material"; // For MUI button
import { Snackbar, Alert } from "@mui/material"; // For MUI Snackbar (Toast)
import axios from "axios"; // For handling API requests

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // To show loading spinner
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success"); // "success", "error", "warning", etc.

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      setToastMessage("Please fill all the fields");
      setToastSeverity("warning");
      setOpenSnackbar(true);
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      await axios.post(
        "http://localhost:5000/api/admin/admin_login", // Updated API endpoint for admin login
        { email, password },
        config
      );
      setToastMessage("Admin Login Successful");
      setToastSeverity("success");
      setOpenSnackbar(true);
      setLoading(false);
    } catch (error) {
      setToastMessage(error.response?.data?.message || "Something went wrong");
      setToastSeverity("error");
      setOpenSnackbar(true);
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
          <h2 className="text-center font-weight-bold mb-4">Admin Sign In</h2>
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
            <MUIButton
              variant="contained"
              color="primary"
              type="submit"
              className="w-100 mt-4 py-3 shadow-sm d-flex align-items-center justify-content-center"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </MUIButton>
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

      {/* MUI Snackbar for toast notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={toastSeverity}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SignUpPage;
