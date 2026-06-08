import React, { useEffect, useState } from "react";
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
import { fetchMyNotifications } from "./api/notifications";
import NotificationSeeMore from "./NotificationSeeMore";
import { openNotifications } from "./notificationActions";

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
  const [notifications, setNotifications] = useState([]);

  const { complaints: cases, stats: caseStats } = useComplaints(fetchAssignedComplaints);
  const recentCases = cases.slice(0,3);

  useEffect(() => {
    fetchMyNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]));
  }, []);

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {

    const confirmLogout =
    await window.__reportItShowConfirm(
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

              onClick={() => openNotifications(showNotifications, setShowNotifications, setNotifications)}
            >

              <FaBell className="notification-bell" />

              {notifications.length > 0 && (
                <span className="notification-dot has-notifications"></span>
              )}

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

                    {notifications.length > 0 && (
                      <span>
                        {notifications.length} New
                      </span>
                    )}

                  </div>

                  {notifications.length > 0 ? (
                    notifications.map((item,index)=>(
                      <div className="notification-card" key={index}>
                        <div>
                          <h4>{item.title || "Notification"}</h4>
                          <p>{item.message || item}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="notification-card">
                      <div>
                        <h4>No notifications yet</h4>
                        <p>New updates will appear here when they are sent.</p>
                      </div>
                    </div>
                  )
}

                  <NotificationSeeMore />

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

          <div className="recent-case-card">

            <h3>

              Recent Assigned Cases

            </h3>

            {recentCases.length > 0 ? (

              recentCases.map((item,index)=>(

                <div
                  className="complaint-item"
                  key={item.id || index}
                  onClick={() =>
                    navigate(
                      "/officer-complaint-details",
                      {
                        state:item
                      }
                    )
                  }
                >

                  <div className="left-complaint">

                    <div className="complaint-icon">

                      <FaFolderOpen />

                    </div>

                    <div>

                      <h4>

                        {item.title}

                      </h4>

                      <p>

                        {item.id} · {item.citizen}

                      </p>

                    </div>

                  </div>

                  <span
                    className={
                      item.status === "Resolved"
                      ? "resolved-text"
                      : item.status === "Rejected"
                      ? "rejected-text"
                      : "progress-text"
                    }
                  >

                    {item.status}

                  </span>

                </div>

              ))

            ) : (

              <div className="dashboard-empty-cases">

                No assigned cases yet.

              </div>

            )}

          </div>

        </div>

      </div>

      {/* ================= AI CHAT ================= */}

      <AIChat />

    </div>

  );

};

export default OfficerDashboard;
