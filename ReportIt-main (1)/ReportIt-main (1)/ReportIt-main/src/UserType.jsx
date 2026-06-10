import React from "react";
import "./UserType.css";
import PublicFooter from "./PublicFooter";

import { Link, useNavigate } from "react-router-dom";

import {
  FaShieldAlt,
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

    <button className="admin-login-btn" onClick={() => navigate("/admin-login")}>

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

      <PublicFooter />

    </div>

  );

};

export default UserType;
