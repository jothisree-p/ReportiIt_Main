import React from "react";

import "./Contact.css";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {

  FaShieldAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
  FaAt,
  FaRegCheckSquare,

} from "react-icons/fa";

const Contact = () => {

  const navigate = useNavigate();

  return (

    <div className="contact-container">

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

      {/* ================= CONTACT SECTION ================= */}

      <section className="contact-section">

        {/* ================= LEFT ================= */}

        <div className="contact-left">

          <h1>

            Contact
            <span>
              Us
            </span>

          </h1>

          <p>

            We are here to help you anytime.
            Feel free to contact us regarding complaints,
            support, or emergency assistance.

          </p>

          {/* ================= FORM ================= */}

          <form className="contact-form">

            {/* NAME */}

            <div className="input-box">

              <FaUser className="input-icon" />

              <input
                type="text"
                placeholder="Your Name"
              />

            </div>

            {/* EMAIL */}

            <div className="input-box">

              <FaAt className="input-icon" />

              <input
                type="email"
                placeholder="Your Email"
              />

            </div>

            {/* SUBJECT */}

            <div className="input-box">

              <FaRegCheckSquare className="input-icon" />

              <input
                type="text"
                placeholder="Subject"
              />

            </div>

            {/* MESSAGE */}

            <textarea
              placeholder="Your Message"
              rows="6"
            ></textarea>

            {/* BUTTON */}

            <button
              type="submit"
              className="send-btn"
            >

              Send Message

            </button>

          </form>

        </div>

        {/* ================= RIGHT ================= */}

        <div className="contact-right">

          <img
            src="/contact.png"
            alt="contact"
            className="contact-image"
          />

          {/* ================= CONTACT CARDS ================= */}

          <div className="contact-cards">

            {/* CARD 1 */}

            <div className="contact-card">

              <FaPhoneAlt className="contact-card-icon" />

              <div>

                <h3>
                  Call Us
                </h3>

                <p>
                  +91 98765 43210
                </p>

              </div>

            </div>

            {/* CARD 2 */}

            <div className="contact-card">

              <FaEnvelope className="contact-card-icon" />

              <div>

                <h3>
                  Email Us
                </h3>

                <p>
                  support@reportit.com
                </p>

              </div>

            </div>

            {/* CARD 3 */}

            <div className="contact-card">

              <FaMapMarkerAlt className="contact-card-icon" />

              <div>

                <h3>
                  Visit Us
                </h3>

                <p>
                  Chennai, India
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer">

        {/* FOOTER 1 */}

        <div className="footer-box">

          <div className="footer-logo">

            <FaShieldAlt className="logo-icon" />

            <span>Report<span className="highlight">It</span></span>

          </div>

          <p>

            ReportIt helps citizens report crimes and
            suspicious activities quickly and securely
            for safer communities.

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
            Emergency
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

export default Contact;