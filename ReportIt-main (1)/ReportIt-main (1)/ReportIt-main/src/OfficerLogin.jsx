import React, { useState } from "react";

import "./OfficerLogin.css";

import {
  FaEnvelope,
  FaLock,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { login, sendOtp } from "./api/auth";
import { ApiError } from "./api/http";
import { setCurrentOfficer, setCurrentOfficerByEmail } from "./officerSession";
import { showAppPopup } from "./appPopups";

const OfficerLogin = () => {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
    useState({

      email: "",
      password: "",

    });

  const [sendingOtp, setSendingOtp] =
    useState(false);

  const [showForgotPopup, setShowForgotPopup] =
    useState(false);

  const [forgotEmail, setForgotEmail] =
    useState("");

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value,

    });

  };

  /* ================= LOGIN ================= */

  const handleLogin = async (e) => {

    e.preventDefault();

    if (
      !formData.email ||
      !formData.password
    ) {

      alert(
        "Please fill all fields"
      );

      return;

    }

    if(!formData.email.endsWith("@reportit.com")){

      alert(
        "Officer email must end with @reportit.com"
      );

      return;

    }

    try {
      const auth = await login(formData.email, formData.password, "OFFICER");
      setCurrentOfficer({
        id: auth.userId,
        userId: auth.userId,
        name: auth.fullName,
        email: auth.email,
        position: "Officer",
      });
      // Enrich profile in background (do not block login)
      setCurrentOfficerByEmail(formData.email).catch(() => {});
      showAppPopup("Officer Login Successful!");
      navigate("/officer-dashboard");
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Login failed");
    }

  };

  const handleForgotPassword = async () => {
    if (sendingOtp) return;

    const email = forgotEmail.trim();

    if (!email) {
      alert("Enter official email to receive OTP");
      return;
    }

    if (!email.endsWith("@reportit.com")) {
      alert("Officer email must end with @reportit.com");
      return;
    }

    try {
      setSendingOtp(true);
      const result = await sendOtp(email, "FORGOT_PASSWORD");
      alert(result.message || "OTP sent successfully!");
      if (!result.cooldown) {
        setShowForgotPopup(false);
        navigate("/verify-otp", {
          state: { email, returnTo: "/officer-login" },
        });
      }
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  return (

    <div className="officer-login-container">

      {/* ================= LEFT ================= */}

      <div className="officer-left">

        <img
          src="/splashscreen.jpeg"
          alt="background"
          className="bg-image"
        />

        <div className="overlay"></div>

        <div className="left-content">

          <div className="logo-box">

            <FaShieldAlt className="logo-icon" />

          </div>

          <h1>

            Report
            <span>It</span>

          </h1>

          <p>
Report Crimes & Suspicious Activities

          </p>

        </div>

      </div>

      {/* ================= RIGHT ================= */}

      <div className="officer-right">

        {/* BACK BUTTON */}

        <button
          className="back-btn"
          onClick={() =>
            navigate("/user-type")
          }
        >

          <FaArrowLeft />

        </button>

        <div className="login-card">

          <h1>

            Officer Login

          </h1>

          <p>

            Login using official credentials

          </p>

          <form
            onSubmit={handleLogin}
          >

            {/* EMAIL */}

            <label>

              Official Email

            </label>

            <div className="input-box">

              <FaEnvelope className="input-icon" />

              <input
                type="email"
                name="email"
                placeholder="Enter official email"
                value={formData.email}
                onChange={handleChange}
              />

            </div>

            {/* PASSWORD */}

            <label>

              Password

            </label>

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

              <button
                type="button"
                className="password-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

            </div>

            {/* FORGOT PASSWORD */}

            <div className="forgot-password">

              <span
                onClick={() => {
                  setForgotEmail(formData.email);
                  setShowForgotPopup(true);
                }}
                className={sendingOtp ? "is-disabled" : ""}
              >
                Forgot Password?
              </span>

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-btn"
            >

              Login

            </button>

          </form>

        </div>

      </div>

      {showForgotPopup && (
        <div className="popup-overlay">
          <div className="forgot-popup">
            <h3>Forgot Password</h3>
            <p>Enter official email to receive OTP</p>

            <div className="input-box">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Enter official email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </div>

            <div className="popup-buttons">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForgotPopup(false)}
                disabled={sendingOtp}
              >
                Cancel
              </button>

              <button
                type="button"
                className="send-btn"
                onClick={handleForgotPassword}
                disabled={sendingOtp}
              >
                {sendingOtp ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

  );

};

export default OfficerLogin;
