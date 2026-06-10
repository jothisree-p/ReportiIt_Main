import React from "react";

import "./Contact.css";
import PublicFooter, { REPORTIT_EMAIL, REPORTIT_LOCATION, REPORTIT_PHONE } from "./PublicFooter";

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
                  <a href="tel:+916369574855">{REPORTIT_PHONE}</a>
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
                  <a href={`mailto:${REPORTIT_EMAIL}`}>{REPORTIT_EMAIL}</a>
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
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Coimbatore%2C%20India"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {REPORTIT_LOCATION}
                  </a>
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      <PublicFooter />

    </div>

  );

};

export default Contact;
