import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEnvelope, FaKey, FaLock, FaShieldAlt } from "react-icons/fa";
import { resetPassword } from "./api/auth";
import { ApiError } from "./api/http";
import "./VerifyOtp.css";

const passwordRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{7,}$/;

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    if (!email.trim() || !otp.trim() || !newPassword || !confirmPassword) {
      alert("Please fill email, OTP, and new password.");
      return;
    }

    if (!passwordRule.test(newPassword)) {
      alert("Password must be more than 6 characters and include letters, numbers, and a symbol.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      await resetPassword(email.trim(), otp.trim(), newPassword);
      alert("Password updated successfully. Please login again.");
      navigate(location.state?.returnTo || "/user-type");
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to reset password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="verify-page">
      <button className="back-btn verify-back" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </button>

      <form className="verify-card" onSubmit={handleSubmit}>
        <div className="verify-logo">
          <FaShieldAlt />
          <span>Report<span>It</span></span>
        </div>

        <h1>Verify OTP</h1>
        <p>Enter the one-minute OTP sent to your registered email.</p>

        <label>Email</label>
        <div className="verify-input">
          <FaEnvelope />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Registered email" />
        </div>

        <label>OTP</label>
        <div className="verify-input">
          <FaKey />
          <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6 digit OTP" maxLength={6} />
        </div>

        <label>New Password</label>
        <div className="verify-input">
          <FaLock />
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" />
        </div>

        <label>Confirm Password</label>
        <div className="verify-input">
          <FaLock />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" />
        </div>

        <button className="verify-submit" type="submit" disabled={submitting}>
          {submitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
