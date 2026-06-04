import React,
{
  useEffect,
  useState
}
from "react";

import { useNavigate }
from "react-router-dom";

import "./CitizenDashboard.css";

import AIChat from "./AIChat";
import { useComplaints } from "./hooks/useComplaints";
import { fetchMyComplaints } from "./api/complaints";
import { fetchMyNotifications } from "./api/notifications";
import { clearAuth } from "./authStorage";
import { useRequireAuth } from "./hooks/useRequireAuth";
import {
  getCurrentCitizen,
  getCitizenInitials,
  getCitizenWelcomeText,
} from "./citizenSession";

import {

  FaShieldAlt,
  FaFileAlt,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUser,
  FaSignOutAlt,
  FaBell,
  FaArrowLeft,

} from "react-icons/fa";

const CitizenDashboard = () => {

  const navigate = useNavigate();
  useRequireAuth("CITIZEN");
  const citizen = getCurrentCitizen();

  const [
    showNotifications,
    setShowNotifications
  ] = useState(false);

  /* ================= NOTIFICATIONS ================= */

  const [notifications, setNotifications] = useState([]);
  const { complaints, stats: complaintStats } = useComplaints(fetchMyComplaints);
  const recentComplaints = complaints.slice(0,3);

  useEffect(() => {
    fetchMyNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]));
  }, []);

  /* ================= LOGOUT ================= */

  const handleLogout = () => {

    const confirmLogout =
    window.confirm(
      "Are you sure you want to logout?"
    );

    if(confirmLogout){
      clearAuth();
      navigate("/");
    }

  };

  return (

    <div className="dashboard-container">

      {/* ================= SIDEBAR ================= */}

      <div className="sidebar">

        <div className="sidebar-top">

          {/* LOGO */}

          <div className="sidebar-logo">

            <FaShieldAlt className="logo-icon" />

            <span>Report<span className="highlight">It</span></span>

          </div>

          <p className="panel-text">

            CITIZEN PANEL

          </p>

          {/* MENU */}

          <ul className="sidebar-menu">

            <li className="active-menu">

              <FaFileAlt />

              Dashboard

            </li>

            <li
              onClick={() =>
                navigate("/report-crime")
              }
            >

              <FaFileAlt />

              Report Crime

            </li>

            <li
              onClick={() =>
                navigate("/my-complaints")
              }
            >

              <FaFileAlt />

              My Complaints

            </li>

            <li
              onClick={() =>
                navigate("/track-status")
              }
            >

              <FaClock />

              Track Status

            </li>

            <li
              onClick={() =>
                navigate("/citizen-profile")
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

          {/* LEFT */}

          <div className="topbar-left">

            <button
              className="back-btn"
              onClick={() => navigate(-1)}
            >

              <FaArrowLeft />

            </button>

            <h3>

              {getCitizenWelcomeText(citizen)}

            </h3>

          </div>

          {/* RIGHT */}

          <div className="topbar-right">

            {/* NOTIFICATION */}

            <div
              className="notification-btn"
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
            >

              <FaBell className="notification-bell" />

              <span className="notification-dot">

              </span>

            </div>

            {/* NOTIFICATION POPUP */}

            {

              showNotifications && (

                <div className="notification-popup">

                  <h3>

                    Notifications

                  </h3>

                  {

                    notifications.length > 0 ? (

                      notifications.map(
                        (item,index)=>(

                          <div
                            className="notification-item"
                            key={index}
                          >

                            <p>

                              {item.message}

                            </p>

                            <span>

                              {item.time}

                            </span>

                          </div>

                        )
                      )

                    ) : (

                      <div className="notification-item">

                        No notifications yet

                      </div>

                    )

                  }

                </div>

              )

            }

            {/* PROFILE */}

            <div
              className="profile-section"
              onClick={() =>
                navigate("/citizen-profile")
              }
            >

              <div className="profile-circle">

                {getCitizenInitials(citizen)}

              </div>

            </div>

          </div>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="dashboard-content">

          <h1>

            Citizen Dashboard

          </h1>

          {/* ================= STATS ================= */}

          <div className="stats-cards">

            <div className="stat-card">

              <div className="stat-top">

                <p>TOTAL</p>

                <FaFileAlt className="blue" />

              </div>

              <h2>

                {complaintStats.total}

              </h2>

            </div>

            <div className="stat-card">

              <div className="stat-top">

                <p>PENDING</p>

                <FaClock className="yellow" />

              </div>

              <h2>

                {complaintStats.pending}

              </h2>

            </div>

            <div className="stat-card">

              <div className="stat-top">

                <p>IN PROGRESS</p>

                <FaExclamationTriangle className="cyan" />

              </div>

              <h2>

                {complaintStats.inProgress}

              </h2>

            </div>

            <div className="stat-card">

              <div className="stat-top">

                <p>RESOLVED</p>

                <FaCheckCircle className="green" />

              </div>

              <h2>

                {complaintStats.resolved}

              </h2>

            </div>

          </div>

          {/* ================= RECENT COMPLAINTS ================= */}

          <div className="dashboard-grid">

            <div className="dashboard-card large-card">

              <div className="card-header">

                <h2>

                  Recent Complaints

                </h2>

                <button
                  className="view-all-btn"
                  onClick={() =>
                    navigate("/my-complaints")
                  }
                >

                  View All

                </button>

              </div>

              <div className="complaints-list">

                {

                  recentComplaints.map(
                    (item,index)=>(

                      <div
                        className="complaint-item"
                        key={index}
                      >

                        <div>

                          <h4>

                            {item.title}

                          </h4>

                          <p>

                            {item.category}

                          </p>

                        </div>

                        <span
                          className={`status-badge ${

                            item.status
                            .toLowerCase()
                            .replace(" ","-")

                          }`}
                        >

                          {item.status}

                        </span>

                      </div>

                    )
                  )

                }

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= AI CHAT ================= */}

      <AIChat />

    </div>

  );

};

export default CitizenDashboard;
