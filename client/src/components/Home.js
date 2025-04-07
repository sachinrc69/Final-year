import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Carousel } from "react-bootstrap";
import FirstImage from "../Images/first.svg"; // Image for nomination phase
import SecondImage from "../Images/second.svg"; // Image for voting phase
import ThirdImage from "../Images/third.svg"; // Image for blockchain security
import Logo from "../Images/BlockVote.jpg";
import "../styles/Home.css";

const Home = () => {

  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="header">
        <div className="logo-section">
          <img src={Logo} alt="Website Logo" className="logo" />
          <h1 className="site-title">
            BlockVote: Secure & Transparent E-Voting
          </h1>
        </div>
        <nav>
          <a href="/sign-in" className="login-button">
            User
          </a>
          <a href="/admin-signin" className="login-button">
            Admin
          </a>
        </nav>
      </header>

      {/* Slider Section */}
      <div className="hero">
        <Carousel>
          <Carousel.Item>
            <div className="carousel-content">
              <div className="carousel-text">
                <h3>Candidates Nomination</h3>
                <p>
                  Nominate yourself for leadership roles securely. Your
                  nomination details are recorded on the blockchain for
                  transparency.
                </p>
              </div>
              <img
                className="carousel-image"
                src={FirstImage}
                alt="First slide"
              />
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div className="carousel-content">
              <div className="carousel-text">
                <h3>Blockchain Voting</h3>
                <p>
                  Vote securely using blockchain technology. Your vote is
                  immutable and recorded transparently, ensuring fair elections.
                </p>
              </div>
              <img
                className="carousel-image"
                src={SecondImage}
                alt="Second slide"
              />
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div className="carousel-content">
              <div className="carousel-text">
                <h3>Decentralized & Secure</h3>
                <p>
                  Every vote is stored in a decentralized ledger, preventing
                  fraud and ensuring transparency in the electoral process.
                </p>
              </div>
              <img
                className="carousel-image"
                src={ThirdImage}
                alt="Third slide"
              />
            </div>
          </Carousel.Item>
        </Carousel>
      </div>

      {/* Description Section */}
      <div className="content-section">
        <h2>Welcome to the Blockchain-Based Voting Portal!</h2>
        <p>
          BlockVote leverages blockchain technology to ensure a secure,
          transparent, and tamper-proof voting experience for campus elections.
          With decentralized ledger technology, every vote is permanently
          recorded, making manipulation impossible.
        </p>
        <h3>How It Works</h3>
        <h4>Nomination Phase:</h4>
        <p>
          Candidates submit their nominations, which are encrypted and stored on
          the blockchain. This ensures authenticity and prevents unauthorized
          changes.
        </p>
        <h4>Voting Phase:</h4>
        <p>
          Each voter is assigned a unique cryptographic key. Votes are recorded
          on the blockchain, ensuring complete transparency and immutability.
        </p>
        <h4>Result Declaration:</h4>
        <p>
          Once voting ends, the blockchain network verifies the results
          instantly, eliminating manual counting errors and ensuring accuracy.
        </p>
        <h4>Key Features:</h4>
        <p>
          <strong>Immutable Ledger:</strong> Every vote is securely stored and
          cannot be altered. <br />
          <strong>Decentralized System:</strong> No central authority controls
          the voting, ensuring trust and fairness. <br />
          <strong>Transparent & Secure:</strong> Voters can verify their votes
          without compromising anonymity.
        </p>
      </div>

      {/* FAQ Section */}
      <section className="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h4>How does blockchain ensure vote security?</h4>
          <p>
            Blockchain encrypts each vote, ensuring that it cannot be modified.
            The decentralized nature prevents tampering.
          </p>
        </div>
        <div className="faq-item">
          <h4>Can I verify my vote?</h4>
          <p>
            Yes, voters can verify their vote on the blockchain without
            revealing their identity, ensuring transparency.
          </p>
        </div>
        <div className="faq-item">
          <h4>Is my vote anonymous?</h4>
          <p>
            Yes, blockchain ensures anonymity while maintaining transparency
            through encryption and hashing techniques.
          </p>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <h4>Contact Us</h4>
          <p>Email: blockchainvoting@aspirevote.com</p>
          <p>Phone: +123 456 7890</p>
          <p>Address: 123 Blockchain Lane, City, Country</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
