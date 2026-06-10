import React, { useMemo, useState } from "react";

import "./CitizenSignup.css";

import { Link, useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaCheckCircle,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaPhoneAlt,
  FaShieldAlt,
  FaUser,
} from "react-icons/fa";
import { registerCitizen, sendSignupVerification, verifySignupPhone } from "./api/auth";
import { ApiError } from "./api/http";
import { setCurrentCitizen } from "./citizenSession";

const passwordRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{7,}$/;

const CitizenSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [verificationSent, setVerificationSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sendingVerification, setSendingVerification] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const normalizedEmail = formData.email.trim().toLowerCase();
  const normalizedPhone = formData.phone.trim();
  const canCreateAccount = useMemo(() => phoneVerified, [phoneVerified]);

  const validateSignupFields = () => {
    const { fullName, email, phone, password, confirmPassword } = formData;

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      return "Please fill all fields.";
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return "Enter a valid email address.";
    }

    if (!/^[0-9+\-\s]{10,15}$/.test(phone.trim())) {
      return "Enter a valid phone number.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    if (!passwordRule.test(password)) {
      return "Password must be more than 6 characters and include letters, numbers, and a symbol.";
    }

    return "";
  };

  const resetPhoneVerification = () => {
    setVerificationSent(false);
    setPhoneVerified(false);
    setPhoneCode("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (name === "phone" || name === "email") {
      resetPhoneVerification();
    }

    setMessage("");
    setError("");
  };

  const handleSendVerification = async () => {
    const validationError = validateSignupFields();
    if (validationError) {
      setError(validationError);
      setMessage("");
      return;
    }

    setSendingVerification(true);
    setError("");
    setMessage("");

    try {
      const result = await sendSignupVerification({
        email: normalizedEmail,
        phone: normalizedPhone,
      });
      setVerificationSent(true);
      setPhoneVerified(false);
      setPhoneCode("");
      setMessage(result.message || "Phone verification code sent to your registered email.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to send phone verification email.");
    } finally {
      setSendingVerification(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!normalizedEmail || !normalizedPhone || !phoneCode.trim()) {
      setError("Enter the phone verification code.");
      return;
    }

    setVerifyingPhone(true);
    setError("");
    setMessage("");

    try {
      await verifySignupPhone(normalizedEmail, normalizedPhone, phoneCode.trim());
      setPhoneVerified(true);
      setMessage("Phone number verified successfully.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Phone verification failed.");
    } finally {
      setVerifyingPhone(false);
    }
  };

  const handleSignup = async () => {
    const validationError = validateSignupFields();
    if (validationError) {
      setError(validationError);
      setMessage("");
      return;
    }

    if (!canCreateAccount) {
      setError("Verify your phone number before creating the account.");
      setMessage("");
      return;
    }

    setCreatingAccount(true);
    setError("");
    setMessage("");

    try {
      const auth = await registerCitizen({
        fullName: formData.fullName.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        password: formData.password,
      });
      setCurrentCitizen({
        fullName: formData.fullName.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        userId: auth.userId,
      });
      setMessage("Account created successfully. Redirecting to login...");
      setTimeout(() => navigate("/citizen-login"), 650);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Signup failed");
    } finally {
      setCreatingAccount(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="overlay">
          <div className="brand-section">
            <div className="shield-circle">
              <FaShieldAlt className="shield-icon" />
            </div>
            <h1>
              Report<span>It</span>
            </h1>
            <p>Report Crimes & Suspicious Activities</p>
          </div>
        </div>
      </div>

      <div className="signup-right">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>

        <div className="signup-card">
          <h2>Citizen Signup</h2>
          <p className="signup-subtitle">Create your citizen account after phone verification</p>

          <label>Full Name</label>
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

          <label>Email</label>
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

          <label>Phone Number</label>
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

          <label>Password</label>
          <div className="input-box">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="eye-icon"
              onClick={() => setShowPassword((value) => !value)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <label>Confirm Password</label>
          <div className="input-box">
            <FaLock className="input-icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="eye-icon"
              onClick={() => setShowConfirmPassword((value) => !value)}
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="signup-verification">
            <div className="verification-header">
              <div>
                <h3>Phone Verification</h3>
                <p>ReportIt sends a phone verification code to your registered email.</p>
              </div>
              <button
                type="button"
                className="verify-send-btn"
                onClick={handleSendVerification}
                disabled={sendingVerification || verificationSent}
              >
                {sendingVerification ? "Sending..." : verificationSent ? "Sent" : "Send Code"}
              </button>
            </div>

            <div className={`verify-status ${phoneVerified ? "is-done" : ""}`}>
              <FaCheckCircle />
              <span>{phoneVerified ? "Phone verified" : "Phone not verified"}</span>
            </div>

            {verificationSent && (
              <div className="verification-row">
                <div className="input-box verification-input">
                  <FaPhoneAlt className="input-icon" />
                  <input
                    type="text"
                    placeholder="Phone verification code"
                    value={phoneCode}
                    maxLength={6}
                    onChange={(event) => setPhoneCode(event.target.value)}
                    disabled={phoneVerified}
                  />
                </div>
                <button type="button" onClick={handleVerifyPhone} disabled={verifyingPhone || phoneVerified}>
                  {verifyingPhone ? "Verifying..." : phoneVerified ? "Verified" : "Verify Phone"}
                </button>
              </div>
            )}
          </div>

          {message && <p className="signup-message is-success">{message}</p>}
          {error && <p className="signup-message is-error">{error}</p>}

          <button
            className="signup-btn"
            onClick={handleSignup}
            disabled={creatingAccount || !canCreateAccount}
          >
            {creatingAccount ? "Creating..." : "Create Account"}
          </button>

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
