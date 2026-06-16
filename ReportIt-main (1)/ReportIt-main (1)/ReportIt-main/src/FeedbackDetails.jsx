import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBell,
  FaChartBar,
  FaClipboardList,
  FaFileAlt,
  FaFolderOpen,
  FaShieldAlt,
  FaSignOutAlt,
  FaStar,
  FaUser,
  FaUsers,
  FaUserShield,
} from "react-icons/fa";
import AIChat from "./AIChat";
import AdminNotificationBell from "./AdminNotificationBell";
import NotificationSeeMore from "./NotificationSeeMore";
import { clearAuth, getRole } from "./authStorage";
import { fetchMyNotifications } from "./api/notifications";
import { openNotifications } from "./notificationActions";
import {
  getCurrentOfficer,
  getOfficerInitials,
  getOfficerWelcomeText,
} from "./officerSession";
import "./FeedbackDetails.css";

const adminLinks = [
  { label: "Dashboard", icon: <FaClipboardList />, route: "/admin-dashboard" },
  { label: "Manage Users", icon: <FaUsers />, route: "/manage-users" },
  { label: "Manage Officers", icon: <FaUserShield />, route: "/manage-officers" },
  { label: "Categories", icon: <FaFileAlt />, route: "/categories" },
  { label: "Reports", icon: <FaChartBar />, route: "/admin-reports" },
  { label: "Statistics", icon: <FaChartBar />, route: "/admin-statistics" },
  { label: "Admin Profile", icon: <FaUserShield />, route: "/admin-profile" },
];

const officerLinks = [
  { label: "Dashboard", icon: <FaFolderOpen />, route: "/officer-dashboard" },
  { label: "Assigned Cases", icon: <FaFolderOpen />, route: "/assigned-cases" },
  { label: "Statistics", icon: <FaChartBar />, route: "/officer-statistics" },
  { label: "Profile", icon: <FaUser />, route: "/officer-profile" },
];

const FeedbackDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authRole = getRole();
  const panel = location.state?.panel || (authRole === "ADMIN" ? "admin" : "officer");
  const feedback = location.state?.feedback;
  const officer = getCurrentOfficer();
  const links = panel === "admin" ? adminLinks : officerLinks;
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (panel === "officer") {
      fetchMyNotifications()
        .then(setNotifications)
        .catch(() => setNotifications([]));
    }
  }, [panel]);

  const handleLogout = async () => {
    const confirmed = await window.__reportItShowConfirm("Are you sure you want to logout?");
    if (confirmed) {
      clearAuth();
      navigate("/");
    }
  };

  const title = panel === "admin" ? "Feedback Details" : getOfficerWelcomeText(officer);
  const profileInitials = panel === "admin" ? "AD" : getOfficerInitials(officer);

  return (
    <div className="feedback-page">
      <div className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <FaShieldAlt className="logo-icon" />
            <span>
              Report<span className="highlight">It</span>
            </span>
          </div>

          <p className="panel-text">{panel === "admin" ? "ADMIN PANEL" : "OFFICER PANEL"}</p>

          <ul className="sidebar-menu">
            {links.map((item) => (
              <li
                key={item.route}
                className={item.route === "/admin-reports" || item.route === "/assigned-cases" ? "active-menu" : ""}
                onClick={() => navigate(item.route)}
              >
                {item.icon}
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="logout" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </div>
      </div>

      <main className="feedback-main">
        <header className="feedback-topbar">
          <div className="feedback-topbar-left">
            <button className="back-btn" type="button" onClick={() => navigate(-1)}>
              <FaArrowLeft />
            </button>
            <h3>{title}</h3>
          </div>

          <div className="feedback-topbar-right">
            {panel === "admin" ? (
              <AdminNotificationBell />
            ) : (
              <div className="icon-box" onClick={() => openNotifications(showNotifications, setShowNotifications, setNotifications)}>
                <FaBell className="notification-bell" />
                {notifications.length > 0 && <span className="notification-dot has-notifications"></span>}
              </div>
            )}

            {showNotifications && panel === "officer" && (
              <div className="notification-popup">
                <h3>Notifications</h3>
                {notifications.length > 0 ? (
                  notifications.map((item, index) => (
                    <div className="notification-item" key={item.id || index}>
                      {item.message}
                    </div>
                  ))
                ) : (
                  <div className="notification-item">No notifications yet</div>
                )}
                <NotificationSeeMore />
              </div>
            )}

            <div
              className="profile-section"
              onClick={() => navigate(panel === "admin" ? "/admin-profile" : "/officer-profile")}
            >
              <div className="profile-circle">{profileInitials}</div>
            </div>
          </div>
        </header>

        <section className="feedback-content">
          <h1>Feedback Details</h1>

          {!feedback ? (
            <div className="feedback-empty">
              No feedback details were selected. Open this page from Reports or Assigned Cases.
            </div>
          ) : (
            <div className="feedback-card">
              <div className="feedback-card-header">
                <div>
                  <p className="feedback-kicker">Complaint</p>
                  <h2>{feedback.complaintCode}</h2>
                  <span>{feedback.complaintTitle}</span>
                </div>
                <div className="feedback-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className={star <= feedback.rating ? "active" : ""} />
                  ))}
                  <strong>{feedback.rating}/5</strong>
                </div>
              </div>

              <div className="feedback-grid">
                <div className="feedback-info">
                  <span>Citizen</span>
                  <strong>{feedback.citizenName || "Citizen"}</strong>
                </div>
                <div className="feedback-info">
                  <span>Assigned Officer</span>
                  <strong>{feedback.officerName || "Not assigned"}</strong>
                </div>
                <div className="feedback-info">
                  <span>Submitted</span>
                  <strong>{feedback.updatedAt ? new Date(feedback.updatedAt).toLocaleString() : "Not available"}</strong>
                </div>
              </div>

              <div className="feedback-comment">
                <h3>Citizen Feedback</h3>
                <p>{feedback.comment?.trim() || "No written comment. Citizen submitted star rating only."}</p>
              </div>
            </div>
          )}
        </section>
      </main>

      <AIChat />
    </div>
  );
};

export default FeedbackDetails;
