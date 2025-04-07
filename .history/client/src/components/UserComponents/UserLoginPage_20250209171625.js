import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import login from "../Images/login.svg";
import "../Styles/styles.css";
import { useToast } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

const UserLoginPage = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    // Check if user info already exists in local storage
    const userInfo = localStorage.getItem("userinfo");
    if (userInfo) {
      navigate("/events"); // Redirect to events page if user is already logged in
    }
  }, [navigate]);

  const handleSendOTP = () => {
    if (!email) {
      toast({
        title: "Please enter your email",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    // Simulating OTP sending process
    setLoading(true);
    setTimeout(() => {
      setOtpSent(true); // Show OTP input field
      toast({
        title: "OTP Sent!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      startResendTimer(); // Start the resend timer
    }, 2000); // Simulate a 2-second delay for sending OTP
  };

  const handleResendOTP = () => {
    if (resendDisabled) {
      toast({
        title: "Please wait before resending OTP",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setLoading(true);
    // Simulating OTP resend process
    setTimeout(() => {
      toast({
        title: "OTP Resent!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      startResendTimer(); // Start the resend timer
    }, 2000); // Simulate a 2-second delay for resending OTP
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !otp) {
      toast({
        title: "Please enter all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    // Simulate OTP verification and login
    toast({
      title: "Login Successful!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
    localStorage.setItem("userinfo", JSON.stringify({ email }));
    navigate("/events");
  };

  const startResendTimer = () => {
    setResendDisabled(true);
    setTimer(30); // Set to 30 seconds for demo; adjust as necessary
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      setResendDisabled(false);
      setTimer(0);
    };
  }, []);

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
              />
            </Form.Group>

            {!otpSent && (
              <Button
                variant="primary"
                className="w-100 mt-4 py-3 shadow-sm"
                isLoading={loading}
                onClick={handleSendOTP}
                style={{ backgroundColor: "#6c4ccf" }}
              >
                Send OTP
              </Button>
            )}

            {otpSent && (
              <>
                <Form.Group controlId="formOTP" className="mt-3">
                  <Form.Control
                    type="text"
                    placeholder="Enter your OTP"
                    className="py-3 shadow-sm bg-light"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </Form.Group>
                <div className="note">
                  NOTE: Please check your junk mails too
                </div>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mt-4 py-3 shadow-sm"
                  isLoading={loading}
                  style={{ backgroundColor: "#6c4ccf" }}
                >
                  Login
                </Button>

                <Button
                  variant="primary"
                  className="w-100 mt-3 py-3 shadow-sm"
                  onClick={handleResendOTP}
                  disabled={resendDisabled} // Disable when timer is active
                  style={{ backgroundColor: "#6c4ccf" }}
                >
                  {resendDisabled ? `Resend OTP (${timer}s)` : "Resend OTP"}
                </Button>
              </>
            )}
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
    </Container>
  );
};

export default UserLoginPage;
