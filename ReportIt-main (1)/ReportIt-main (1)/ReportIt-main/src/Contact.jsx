import React, { useState } from "react";

import "./Contact.css";
import PublicFooter, { REPORTIT_EMAIL, REPORTIT_LOCATION, REPORTIT_PHONE } from "./PublicFooter";
import { showAppPopup } from "./appPopups";
import { sendContactMessage } from "./api/contact";

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
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const googleSearch = (query) =>
    `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  const gmailCompose = (email) =>
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (sending) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      showAppPopup("Please fill all contact fields.");
      return;
    }

    setSending(true);
    try {
      await sendContactMessage(payload);
      showAppPopup("Message sent successfully.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      showAppPopup(error.message || "Unable to send contact message.");
    } finally {
      setSending(false);
    }
  };

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

          <form className="contact-form" onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="input-box">

              <FaUser className="input-icon" />

              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={updateField("name")}
              />

            </div>

            {/* EMAIL */}

            <div className="input-box">

              <FaAt className="input-icon" />

              <input
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={updateField("email")}
              />

            </div>

            {/* SUBJECT */}

            <div className="input-box">

              <FaRegCheckSquare className="input-icon" />

              <input
                type="text"
                placeholder="Subject"
                value={form.subject}
                onChange={updateField("subject")}
              />

            </div>

            {/* MESSAGE */}

            <textarea
              placeholder="Your Message"
              rows="6"
              value={form.message}
              onChange={updateField("message")}
            ></textarea>

            {/* BUTTON */}

            <button
              type="submit"
              className="send-btn"
              disabled={sending}
            >

              {sending ? "Sending..." : "Send Message"}

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
                  <a href={googleSearch(REPORTIT_PHONE)} target="_blank" rel="noreferrer">
                    {REPORTIT_PHONE}
                  </a>
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
                  <a href={gmailCompose(REPORTIT_EMAIL)} target="_blank" rel="noreferrer">
                    {REPORTIT_EMAIL}
                  </a>
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
