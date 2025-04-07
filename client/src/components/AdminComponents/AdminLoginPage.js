import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { Container, Row, Col, Form } from "react-bootstrap";
import login from "../../Images/blockchain1.svg";
import "../../styles/styles.css";
import { Button as MUIButton } from "@mui/material"; // MUI button
import axios from "axios"; // API requests
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import { useAuth } from "../../providers/AuthProvider";

const SignUpPage = () => {
  const navigate = useNavigate();
  const {loginAction} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // To show loading spinner

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.warn("Please fill all fields", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      var data = {email,password}
      loginAction(data,"admin")
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    finally{
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

      {/* Toastify Notifications */}
      <ToastContainer />
    </Container>
  );
};

export default SignUpPage;
