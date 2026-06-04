import React, { useState } from "react";
import { clearAuth } from "./authStorage";

import { Link, useNavigate } from "react-router-dom";

import "./OfficerDashboard.css";

import AIChat from "./AIChat";
import {
  getCurrentOfficer,
  getOfficerInitials,
  getOfficerWelcomeText,
} from "./officerSession";
import { useComplaints } from "./hooks/useComplaints";
import { fetchAssignedComplaints } from "./api/complaints";

import {

  FaShieldAlt,
  FaFolderOpen,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
  FaBell,
  FaArrowLeft,

} from "react-icons/fa";

const OfficerDashboard = () => {

  const navigate = useNavigate();
  const officer = getCurrentOfficer();

  const [showNotifications,
  setShowNotifications] =
  useState(false);

  const { complaints: cases, stats: caseStats } = useComplaints(fetchAssignedComplaints);
  const recentCases = cases.slice(0,3);

  /* ================= LOGOUT ================= */

  const handleLogout = () => {

    const confirmLogout =
    window.confirm(
      "Are you sure you want to logout?"
    );

    if(confirmLogout){
      clearAuth();
      alert("Logged Out Successfully!");
      navigate("/");
    }

  };

  return (

    <div className="dashboard-container">

      {/* ================= SIDEBAR ================= */}

      <div className="sidebar">

        <div className="sidebar-top">

          {/* LOGO */}

          <Link to="/" className="logo">

            <FaShieldAlt className="logo-icon" />

            <div className="logo-text">Report<span className="logo-highlight">It</span></div>

          </Link>

          <p className="panel-text">

            OFFICER PANEL

          </p>

          {/* MENU */}

          <ul className="sidebar-menu">

            <li className="active-menu">

              <FaFolderOpen />

              Dashboard

            </li>

            <li
              onClick={() =>
                navigate("/assigned-cases")
              }
            >

              <FaFolderOpen />

              Assigned Cases

            </li>

            <li
              onClick={() =>
                navigate("/officer-statistics")
              }
            >

              <FaChartBar />

              Statistics

            </li>

            <li
              onClick={() =>
                navigate("/officer-profile")
              }
            >

              <FaUser />

              Profile

            </li>

          </ul>

        </div>

        {/* LOGOUT */}

        <div
          className="logout"
          onClick={handleLogout}
        >

          <FaSignOutAlt />

          Logout

        </div>

      </div>

      {/* ================= MAIN ================= */}

      <div className="main-content">

        {/* ================= TOPBAR ================= */}

        <div className="topbar">

          <div className="topbar-left">

            {/* BACK BUTTON */}

       <button
  className="back-btn"

  onClick={() =>
    navigate(-1)
  }
>

  <FaArrowLeft />

</button>

            <h3>

              {getOfficerWelcomeText(officer)}

            </h3>

          </div>

          {/* ================= RIGHT ================= */}

          <div className="topbar-right">

            {/* NOTIFICATION ICON */}

            <div
              className="notification-btn"

              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
            >

              <FaBell className="notification-bell" />

              <span className="notification-dot"></span>

            </div>

            {/* POPUP */}

            {

              showNotifications && (

                <div className="notification-dropdown">

                  {/* HEADER */}

                  <div className="notification-header">

                    <h3>

                      Notifications

                    </h3>

                    <span>

                      3 New

                    </span>

                  </div>

                  {/* CARD 1 */}

                  <div className="notification-card">

                    <div className="notification-left blue-bg">

                      🚔

                    </div>

                    <div>

                      <h4>

                        New Case Assigned

                      </h4>

                      <p>

                        CMP-2024-011 assigned
                        to your team.

                      </p>

                    </div>

                  </div>

                  {/* CARD 2 */}

                  <div className="notification-card">

                    <div className="notification-left yellow-bg">

                      📌

                    </div>

                    <div>

                      <h4>

                        Investigation Update

                      </h4>

                      <p>

                        CMP-2024-007 requires
                        status update.

                      </p>

                    </div>

                  </div>

                  {/* CARD 3 */}

                  <div className="notification-card">

                    <div className="notification-left green-bg">

                      ✅

                    </div>

                    <div>

                      <h4>

                        Case Resolved

                      </h4>

                      <p>

                        CMP-2024-002 closed
                        successfully.

                      </p>

                    </div>

                  </div>

                </div>

              )

            }

            {/* PROFILE */}

            <div
              className="profile-section"
              onClick={() =>
                navigate("/officer-profile")
              }
            >

              <div className="profile-circle">

                {getOfficerInitials(officer)}

              </div>

            </div>

          </div>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="dashboard-content">

          <h1>

            Officer Dashboard

          </h1>

          {/* ================= STATS ================= */}

          <div className="stats-cards">

            {/* ASSIGNED */}

            <div className="stat-card">

              <div className="stat-top">

                <p>

                  ASSIGNED

                </p>

                <FaFolderOpen className="blue" />

              </div>

              <h2>

                {caseStats.total}

              </h2>

            </div>

            {/* PENDING */}

            <div className="stat-card">

              <div className="stat-top">

                <p>

                  PENDING

                </p>

                <FaClock className="yellow" />

              </div>

              <h2>

                {caseStats.pending}

              </h2>

            </div>

            {/* IN PROGRESS */}

            <div className="stat-card">

              <div className="stat-top">

                <p>

                  IN PROGRESS

                </p>

                <FaExclamationTriangle className="cyan" />

              </div>

              <h2>

                {caseStats.inProgress}

              </h2>

            </div>

            {/* RESOLVED */}

            <div className="stat-card">

              <div className="stat-top">

                <p>

                  RESOLVED

                </p>

                <FaCheckCircle className="green" />

              </div>

              <h2>

                {caseStats.resolved}

              </h2>

            </div>

          </div>

          {/* ================= RECENT CASES ================= */}

          <div
            className="recent-case-card"

            onClick={() =>
              navigate(
                "/officer-complaint-details"
              )
            }
          >

            <h3>

              Recent Assigned Cases

            </h3>

            {/* ITEM */}

            <div className="complaint-item">

              <div className="left-complaint">

                <div className="complaint-icon">

                  <FaFolderOpen />

                </div>

                <div>

                  <h4>

                    Bike Theft at Market Area

                  </h4>

                  <p>

                    CMP-2024-001 · Rahul Sharma

                  </p>

                </div>

              </div>

              <span className="progress-text">

                In Progress

              </span>

            </div>

            {/* ITEM */}

            <div className="complaint-item">

              <div className="left-complaint">

                <div className="complaint-icon">

                  <FaFolderOpen />

                </div>

                <div>

                  <h4>

                    Road Accident Near Highway

                  </h4>

                  <p>

                    CMP-2024-004 · Sneha Reddy

                  </p>

                </div>

              </div>

              <span className="resolved-text">

                Resolved

              </span>

            </div>

            {/* ITEM */}

            <div className="complaint-item">

              <div className="left-complaint">

                <div className="complaint-icon">

                  <FaFolderOpen />

                </div>

                <div>

                  <h4>

                    Vandalism at Community Center

                  </h4>

                  <p>

                    CMP-2024-007 · Priya Singh

                  </p>

                </div>

              </div>

              <span className="rejected-text">

                Rejected

              </span>

            </div>

          </div>

        </div>

      </div>

      {/* ================= AI CHAT ================= */}

      <AIChat />

    </div>

  );

};

export default OfficerDashboard;
