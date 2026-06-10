import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaLock, FaShieldAlt } from "react-icons/fa";
import PublicFooter, { REPORTIT_EMAIL } from "./PublicFooter";
import "./LegalPage.css";

const content = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "How ReportIt protects citizen information",
    sections: [
      ["Information We Collect", "ReportIt stores account details, complaint information, uploaded evidence, profile details, notifications, and status history required to process reports."],
      ["How We Use Data", "Information is used to create complaints, assign officers, send notifications, track case progress, and support dashboard analytics."],
      ["Data Protection", "Access is controlled by login roles, JWT authentication, and role-based authorization for citizens, officers, and admins."],
      ["Contact", `For privacy questions, contact ${REPORTIT_EMAIL}.`],
    ],
  },
  terms: {
    title: "Terms & Conditions",
    subtitle: "Rules for using the ReportIt platform",
    sections: [
      ["Responsible Reporting", "Users must submit truthful complaint details and avoid false, abusive, or misleading reports."],
      ["Evidence Uploads", "Uploaded files should relate directly to the complaint and must not violate another person's privacy or safety."],
      ["Account Security", "Users are responsible for keeping login credentials private and reporting unauthorized access quickly."],
      ["Support", `For platform support, contact ${REPORTIT_EMAIL}.`],
    ],
  },
};

const LegalPage = ({ type }) => {
  const navigate = useNavigate();
  const page = content[type] || content.privacy;

  return (
    <div className="legal-container">
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
          <button className="admin-login-btn" onClick={() => navigate("/admin-login")}>
            <FaLock className="admin-login-icon" />
            Admin Login
          </button>
        </div>
      </div>

      <main className="legal-main">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <FaArrowLeft />
        </button>
        <section className="legal-card">
          <h1>{page.title}</h1>
          <p className="legal-subtitle">{page.subtitle}</p>
          <div className="legal-sections">
            {page.sections.map(([heading, text]) => (
              <article key={heading}>
                <h2>{heading}</h2>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default LegalPage;
