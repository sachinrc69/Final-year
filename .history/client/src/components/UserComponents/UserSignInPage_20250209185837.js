import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import login from "../../Images/blockchain1.svg";
import "../../styles/styles.css";
import { Button } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"; // ✅ Import Axios

const UserLoginPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Show toast notifications
  const showToast = (message, type = "info") => {
    toast[type](message, { autoClose: 3000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword || !phoneNumber) {
      showToast("Please fill all fields", "warning");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }

    setLoading(true);

    try {
      // ✅ Send data to backend
      const { data } = await axios.post(
        "http://localhost:5000/api/users/user_register",
        {
          name,
          email,
          password,
          phoneNumber,
        }
      );

      showToast("Login Successful!", "success");

      // ✅ Store user info in local storage
      localStorage.setItem("userinfo", JSON.stringify(data));

      setTimeout(() => navigate("/events"), 3000);
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
                value={phoneNumber}
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
              {loading ? "Loading..." : "Login"}
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

export default UserLoginPage;
