import React, { useState } from "react";

import "./CitizenSignup.css";

import { Link, useNavigate } from "react-router-dom";

import {
  FaShieldAlt,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
} from "react-icons/fa";
import { registerCitizen } from "./api/auth";
import { ApiError } from "./api/http";
import { setCurrentCitizen } from "./citizenSession";

const CitizenSignup = () => {

  const navigate = useNavigate();

  /* ================= STATES ================= */

  const [formData, setFormData] =
  useState({

    fullName:"",
    email:"",
    phone:"",
    password:"",
    confirmPassword:"",

  });

  const [showPassword,
  setShowPassword] =
  useState(false);

  const [showConfirmPassword,
  setShowConfirmPassword] =
  useState(false);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value,

    });

  };

  /* ================= SIGNUP ================= */

  const handleSignup = async () => {

    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
    } = formData;

    if(
      !fullName ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ){

      alert(
        "Please fill all fields"
      );

      return;

    }

    if(password !== confirmPassword){

      alert(
        "Passwords do not match"
      );

      return;

    }

    try {
      const auth = await registerCitizen({ fullName, email, phone, password });
      setCurrentCitizen({
        fullName,
        email,
        phone,
        userId: auth.userId,
      });
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Signup failed");
      return;
    }

    alert(
      "Account Created Successfully"
    );

    navigate(
      "/citizen-login"
    );

  };

  return (

    <div className="signup-container">

      {/* ================= LEFT SECTION ================= */}

      <div className="signup-left">

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

      <div className="signup-right">

        {/* BACK BUTTON */}

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >

          <FaArrowLeft />

        </button>

        {/* SIGNUP CARD */}

        <div className="signup-card">

          <h2>

            Citizen Signup

          </h2>

          <p className="signup-subtitle">

            Create your citizen account

          </p>

          {/* FULL NAME */}

          <label>

            Full Name

          </label>

          <div className="input-box">

            <FaUser className="input-icon" />

            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
            />

          </div>

          {/* EMAIL */}

          <label>

            Email

          </label>

          <div className="input-box">

            <FaEnvelope className="input-icon" />

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />

          </div>

          {/* PHONE */}

          <label>

            Phone Number

          </label>

          <div className="input-box">

            <FaPhoneAlt className="input-icon" />

            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
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

          {/* CONFIRM PASSWORD */}

          <label>

            Confirm Password

          </label>

          <div className="input-box">

            <FaLock className="input-icon" />

            <input
              type={
                showConfirmPassword
                ? "text"
                : "password"
              }
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <div
              className="eye-icon"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >

              {

                showConfirmPassword
                ? <FaEyeSlash />
                : <FaEye />

              }

            </div>

          </div>

          {/* BUTTON */}

          <button
            className="signup-btn"
            onClick={handleSignup}
          >

            Create Account

          </button>

          {/* LOGIN LINK */}

          <p className="bottom-text">

            Already have an account?

            <Link to="/citizen-login">

              <span> Login</span>

            </Link>

          </p>

        </div>

      </div>

    </div>

  );
};

export default CitizenSignup;
