import React, { useState } from "react";

import "./CitizenLogin.css";

import { Link, useNavigate } from "react-router-dom";

import {
  FaShieldAlt,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
} from "react-icons/fa";
import { login, sendOtp } from "./api/auth";
import { ApiError } from "./api/http";
import { setCurrentCitizen } from "./citizenSession";

const CitizenLogin = () => {

  const navigate = useNavigate();

  /* ================= STATES ================= */

  const [formData, setFormData] =
  useState({

    email:"",
    password:"",

  });

  const [showPassword,
  setShowPassword] =
  useState(false);

  const [showForgotPopup,
  setShowForgotPopup] =
  useState(false);

  const [forgotEmail,
  setForgotEmail] =
  useState("");

  const [sendingOtp, setSendingOtp] =
  useState(false);

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value,

    });

  };

  /* ================= LOGIN ================= */

  const handleLogin = async (event) => {
    event?.preventDefault();

    const {
      email,
      password,
    } = formData;

    if(
      !email ||
      !password
    ){

      alert(
        "Please fill all fields"
      );

      return;

    }

    try {
      const auth = await login(email, password, "CITIZEN");
      setCurrentCitizen({
        fullName: auth.fullName,
        email: auth.email,
        phone: auth.phone || "",
        userId: auth.userId,
      });
      alert("Login Successful!");
      navigate("/citizen-dashboard");
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Login failed");
    }

  };

  /* ================= OTP ================= */

  const handleSendOTP = async () => {
    if (sendingOtp) return;

    if(
      forgotEmail.trim() === ""
    ){

      alert("Enter email");

      return;

    }

    try {
      setSendingOtp(true);
      const result = await sendOtp(forgotEmail, "FORGOT_PASSWORD");
      alert(result.message || "OTP sent successfully!");
      if (!result.cooldown) {
        navigate("/verify-otp", {
          state: { email: forgotEmail, returnTo: "/citizen-login" },
        });
      }
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }

  };

  return (

    <div className="login-container">

      {/* ================= LEFT SECTION ================= */}

      <div className="citizen-left">

        <div className="overlay">

          <div className="brand-section">

            <div className="shield-circle">

              <FaShieldAlt className="shield-icon" />

            </div>

            <h1>

              Report
              <span>It</span>

            </h1>

            <p>

              Report Crimes &
              Suspicious Activities

            </p>

          </div>

        </div>

      </div>

      {/* ================= RIGHT SECTION ================= */}

      <div className="citizen-right">

        {/* BACK BUTTON */}

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >

          <FaArrowLeft />

        </button>

        {/* LOGIN CARD */}

        <form className="login-card" onSubmit={handleLogin}>

          <h2>

            Citizen Login

          </h2>

          <p className="login-subtitle">

            Login using your registered account

          </p>

          {/* EMAIL */}

          <label>Email</label>

          <div className="input-box">

            <FaEnvelope className="input-icon" />

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

          {/* PASSWORD */}

          <label>Password</label>

          <div className="input-box">

            <FaLock className="input-icon" />

            <input
              type={
                showPassword
                ? "text"
                : "password"
              }
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />

            <div
              className="eye-icon"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >

              {

                showPassword
                ? <FaEyeSlash />
                : <FaEye />

              }

            </div>

          </div>

          {/* FORGOT PASSWORD */}

          <div className="forgot-password">

            <span
              onClick={() =>
                setShowForgotPopup(true)
              }
            >

              Forgot Password?

            </span>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="continue-btn"
          >

            Login

          </button>

          {/* SIGNUP LINK */}

          <p className="bottom-text">

            Don't have an account?

            <Link to="/citizen-signup">

              <span> Signup</span>

            </Link>

          </p>

        </form>

      </div>

      {/* ================= FORGOT PASSWORD POPUP ================= */}

      {

        showForgotPopup && (

          <div className="popup-overlay">

            <div className="forgot-popup">

              <h3>

                Forgot Password

              </h3>

              <p>

                Enter your email to receive OTP

              </p>

              <div className="input-box">

                <FaEnvelope className="input-icon" />

                <input
                  type="email"
                  placeholder="Enter email"
                  value={forgotEmail}
                  onChange={(e) =>
                    setForgotEmail(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="popup-buttons">

                <button
                  className="cancel-btn"
                  onClick={() =>
                    setShowForgotPopup(false)
                  }
                >

                  Cancel

                </button>

                <button
                  className="send-btn"
                  onClick={handleSendOTP}
                  disabled={sendingOtp}
                >

                  {sendingOtp ? "Sending..." : "Send OTP"}

                </button>

              </div>

            </div>

          </div>

        )

      }

    </div>

  );
};

export default CitizenLogin;
