import React from "react";
import "./UserType.css";

import { Link, useNavigate } from "react-router-dom";

import {
  FaShieldAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheck,
  FaArrowLeft,
} from "react-icons/fa";

const UserType = () => {

  const navigate = useNavigate();

  return (

    <div className="user-container">

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

    <button className="admin-login-btn">

      🔒 Admin Login

    </button>

  </div>

</div>
      {/* ================= BACK BUTTON ================= */}

      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >

        <FaArrowLeft />

      </button>

      {/* ================= USER SECTION ================= */}

      <section className="user-section">

        {/* TOP LOGO */}

        <div className="top-logo">

          <FaShieldAlt className="top-icon" />

          <span className="top-logo-text">

            Report<span className="highlight">It</span>

          </span>

        </div>

        <h1>

          Select User Type

        </h1>

        {/* USER CARDS */}

        <div className="user-cards">

          {/* ================= CITIZEN ================= */}

          <Link
            to="/citizen-signup"
            className="card-link"
          >

            <div className="user-card">

              <img
                src="/citizen.png"
                alt="citizen"
                className="user-image"
              />

              <h2>

                Citizen

              </h2>

              <div className="points">

                <p>

                  <FaCheck className="check-icon" />

                  Report crimes & suspicious activities

                </p>

                <p>

                  <FaCheck className="check-icon" />

                  Submit evidence (images, videos, etc.)

                </p>

                <p>

                  <FaCheck className="check-icon" />

                  Track complaint status in real-time

                </p>

              </div>

            </div>

          </Link>

          {/* ================= OFFICER ================= */}

          <Link
            to="/officer-login"
            className="card-link"
          >

            <div className="user-card">

              <img
                src="/officer.png"
                alt="officer"
                className="user-image"
              />

              <h2>

                Officer

              </h2>

              <div className="points">

                <p>

                  <FaCheck className="check-icon" />

                  Manage assigned case reports

                </p>

                <p>

                  <FaCheck className="check-icon" />

                  Update status & add investigation notes

                </p>

                <p>

                  <FaCheck className="check-icon" />

                  View statistics & performance metrics

                </p>

              </div>

            </div>

          </Link>

          {/* ================= ADMIN ================= */}

          <Link
            to="/admin-login"
            className="card-link"
          >

            <div className="user-card">

              <div className="admin-circle">

                <FaShieldAlt className="admin-shield" />

              </div>

              <h2>

                Admin

              </h2>

              <div className="points">

                <p>

                  <FaCheck className="check-icon" />

                  Manage users, officers & categories

                </p>

                <p>

                  <FaCheck className="check-icon" />

                  View analytics & generate reports

                </p>

                <p>

                  <FaCheck className="check-icon" />

                  Monitor system-wide statistics

                </p>

              </div>

            </div>

          </Link>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer">

        {/* LEFT */}

        <div className="footer-box">

          <div className="logo footer-logo">

            <FaShieldAlt className="logo-icon" />

            <span className="logo-text">

              Report<span className="highlight">It</span>

            </span>

          </div>

          <p>

            ReportIt is a smart platform that allows citizens
            to report crimes and suspicious activities easily,
            helping authorities respond faster and improve
            community safety.

          </p>

        </div>

        {/* QUICK LINKS */}

        <div className="footer-box">

          <h4>

            Quick Links

          </h4>

          <ul>

            <li>
              Home
            </li>

            <li>
              About
            </li>

            <li>
              Contact
            </li>

            <li>
              Privacy Policy
            </li>

          </ul>

        </div>

        {/* HOTLINE */}

        <div className="footer-box">

          <h4>

            Emergency Hotline

          </h4>

          <p>
            Safety City Police HQ
          </p>

          <p>
            +91 63695 74855
          </p>

          <p>
            +91 63814 87829
          </p>

          <p>
            Police Emergency: 100
          </p>

        </div>

        {/* CONTACT */}

        <div className="footer-box">

          <h4>

            Contact

          </h4>

          <p>

            <FaPhoneAlt className="footer-icon" />

            (800) 123-4567

          </p>

          <p>

            <FaEnvelope className="footer-icon" />

            support@reportitnow.com

          </p>

          <p>

            <FaMapMarkerAlt className="footer-icon" />

            123 Safety St, Anytown, USA

          </p>

        </div>

      </footer>

    </div>

  );

};

export default UserType;