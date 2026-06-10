import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./About.css";
import PublicFooter from "./PublicFooter";
import { FaShieldAlt, FaShieldVirus, FaThLarge, FaUserShield, FaBell } from "react-icons/fa";

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="about-container">

      {/* NAVBAR */}
      <div className="navbar">
        <Link to="/" className="logo">
          <FaShieldAlt className="logo-icon" />
          <div className="logo-text">Report<span className="logo-highlight">It</span></div>
        </Link>
        <div className="nav-right">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
          <button className="admin-login-btn" onClick={() => navigate("/admin-login")}>🔒 Admin Login</button>
        </div>
      </div>

      {/* HERO */}
      <section className="about-hero">
        <div className="about-left">
          <h1>About<span>Us</span></h1>
          <h2>Empowering Citizens To Build Safer Communities</h2>
          <p>
            ReportIt is an advanced crime reporting platform designed to help citizens quickly
            report suspicious activities and incidents directly to authorities. Our mission is
            to improve public safety through technology, transparency, and community participation.
          </p>
        </div>
        <div className="about-right">
          <img src="/about.png" alt="about" className="about-image" />
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="why-section">
        <h2>Why Choose ReportIt?</h2>
        <p className="why-subtext">Discover why ReportIt is trusted by communities for safer and smarter reporting.</p>
        <div className="why-cards">
          <div className="why-card"><div className="why-icon"><FaShieldVirus /></div><h3>Trusted & Secure</h3><p>Your reports are protected with advanced privacy and security measures.</p></div>
          <div className="why-card"><div className="why-icon"><FaThLarge /></div><h3>User Friendly</h3><p>Clean and simple interface designed for everyone to use easily.</p></div>
          <div className="why-card"><div className="why-icon"><FaUserShield /></div><h3>Fast Response</h3><p>Authorities receive complaints instantly for quicker action and response.</p></div>
          <div className="why-card"><div className="why-icon"><FaBell /></div><h3>Live Updates</h3><p>Stay informed with real-time complaint tracking and notifications.</p></div>
        </div>
      </section>

      <PublicFooter />

    </div>
  );
};
export default About;
