import React from "react";

import "./SplashScreen.css";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {

  FaShieldAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBell,
  FaLock,
  FaFileAlt,

} from "react-icons/fa";

const SplashScreen = () => {

  const navigate = useNavigate();

  return (

    <div className="splash-container">

      {/* ================= NAVBAR ================= */}

      <div className="navbar">

        {/* LOGO */}

        <Link to="/" className="logo">

          <FaShieldAlt className="logo-icon" />

          <div className="logo-text">Report<span className="logo-highlight">It</span></div>

        </Link>

        {/* RIGHT */}

        <div className="nav-right">

          <ul className="nav-links">

            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/about">About</Link>
            </li>

            <li>
              <Link to="/contact">Contact</Link>
            </li>

          </ul>

          {/* ADMIN LOGIN */}

          <button
            className="admin-login-btn"
            onClick={() =>
              navigate("/admin-login")
            }
          >

            🔒 Admin Login

          </button>

        </div>

      </div>

      {/* ================= HERO SECTION ================= */}

      <div className="hero-section">

        {/* LEFT */}

        <div className="hero-left">

          <h1>

            Report Crimes &

            <span>
              Suspicious Activities
            </span>

          </h1>

          <p>

            ReportIt empowers citizens to easily report crimes and suspicious
            activities directly to local authorities.

            Help keep your community safe and informed.

          </p>

          <Link
            to="/user-type"
            className="start-btn"
          >

            Get Started →

          </Link>

        </div>

        {/* RIGHT */}

        <div className="hero-right">

          <img
            src="/splashscreen.jpeg"
            alt="crime-report"
            className="hero-image"
          />

        </div>

      </div>

      {/* ================= FEATURES ================= */}

      <div className="features-section">

        <h2>
          Why Choose ReportIt?
        </h2>

        <div className="features">

          {/* CARD 1 */}

          <div className="feature-card">

            <div className="feature-icon">

              <FaFileAlt />

            </div>

            <h3>
              Easy Reporting
            </h3>

            <p>

              Quickly report incidents with a clean and user-friendly interface.

            </p>

          </div>

          {/* CARD 2 */}

          <div className="feature-card">

            <div className="feature-icon">

              <FaLock />

            </div>

            <h3>
              Stay Anonymous
            </h3>

            <p>

              Submit reports anonymously while protecting your privacy.

            </p>

          </div>

          {/* CARD 3 */}

          <div className="feature-card">

            <div className="feature-icon">

              <FaBell />

            </div>

            <h3>
              Alerts & Updates
            </h3>

            <p>

              Receive instant notifications and updates about your complaints.

            </p>

          </div>

        </div>

      </div>

      {/* ================= FOOTER ================= */}

      <footer className="footer">

        {/* FOOTER 1 */}

        <div className="footer-box">

          <div className="footer-logo">

            <FaShieldAlt className="logo-icon" />

            <span>Report<span className="highlight">It</span></span>

          </div>

          <p>

            ReportIt is a smart platform helping citizens report crimes
            and suspicious activities quickly and securely.

          </p>

        </div>

        {/* FOOTER 2 */}

        <div className="footer-box">

          <h4>
            Quick Links
          </h4>

          <ul>

            <li>Home</li>

            <li>About</li>

            <li>Contact</li>

            <li>Privacy Policy</li>

            <li>Terms & Conditions</li>

          </ul>

        </div>

        {/* FOOTER 3 */}

        <div className="footer-box">

          <h4>
            Emergency Hotline
          </h4>

          <p>Police Emergency : 100</p>

          <p>Ambulance : 108</p>

          <p>Women Helpline : 1091</p>

          <p>Cyber Crime : 1930</p>

        </div>

        {/* FOOTER 4 */}

        <div className="footer-box">

          <h4>
            Contact
          </h4>

          <p>

            <FaPhoneAlt className="footer-icon" />
            +91 98765 43210

          </p>

          <p>

            <FaEnvelope className="footer-icon" />
            support@reportit.com

          </p>

          <p>

            <FaMapMarkerAlt className="footer-icon" />
            Chennai, India

          </p>

        </div>

      </footer>

    </div>

  );

};

export default SplashScreen;