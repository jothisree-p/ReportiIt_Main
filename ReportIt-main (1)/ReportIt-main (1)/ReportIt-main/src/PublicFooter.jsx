import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaShieldAlt } from "react-icons/fa";
import "./PublicFooter.css";

export const REPORTIT_EMAIL = "reportit.noreply@gmail.com";
export const REPORTIT_PHONE = "+91 63695 74855";
export const REPORTIT_LOCATION = "Coimbatore, India";

const googleSearch = (query) =>
  `https://www.google.com/search?q=${encodeURIComponent(query)}`;

const gmailCompose = (email) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

const PublicFooter = () => (
  <footer className="footer public-footer">
    <div className="footer-box">
      <div className="footer-logo">
        <FaShieldAlt className="logo-icon" />
        <span>
          Report<span className="highlight">It</span>
        </span>
      </div>
      <p>
        ReportIt is a smart platform helping citizens report crimes and
        suspicious activities quickly and securely.
      </p>
    </div>

    <div className="footer-box">
      <h4>Quick Links</h4>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
        <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
      </ul>
    </div>

    <div className="footer-box">
      <h4>Emergency Hotline</h4>
      <p><a href={googleSearch("Police Emergency 100 India")} target="_blank" rel="noreferrer">Police Emergency : 100</a></p>
      <p><a href={googleSearch("Ambulance 108 India")} target="_blank" rel="noreferrer">Ambulance : 108</a></p>
      <p><a href={googleSearch("Women Helpline 1091 India")} target="_blank" rel="noreferrer">Women Helpline : 1091</a></p>
      <p><a href={googleSearch("Cyber Crime Helpline 1930 India")} target="_blank" rel="noreferrer">Cyber Crime : 1930</a></p>
    </div>

    <div className="footer-box">
      <h4>Contact</h4>
      <p>
        <FaPhoneAlt className="footer-icon" />
        <a href={googleSearch(REPORTIT_PHONE)} target="_blank" rel="noreferrer">
          {REPORTIT_PHONE}
        </a>
      </p>
      <p>
        <FaEnvelope className="footer-icon" />
        <a href={gmailCompose(REPORTIT_EMAIL)} target="_blank" rel="noreferrer">
          {REPORTIT_EMAIL}
        </a>
      </p>
      <p>
        <FaMapMarkerAlt className="footer-icon" />
        <a
          href="https://www.google.com/maps/search/?api=1&query=Coimbatore%2C%20India"
          target="_blank"
          rel="noreferrer"
        >
          {REPORTIT_LOCATION}
        </a>
      </p>
    </div>
  </footer>
);

export default PublicFooter;
