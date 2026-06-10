import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBell,
  FaChartBar,
  FaChartPie,
  FaClipboardList,
  FaClock,
  FaFileAlt,
  FaFolderOpen,
  FaShieldAlt,
  FaSignOutAlt,
  FaUser,
  FaUsers,
  FaUserShield,
} from "react-icons/fa";
import AIChat from "./AIChat";
import { fetchMyNotifications } from "./api/notifications";
import { clearAuth, getAuth } from "./authStorage";
import "./AllNotifications.css";

const getBackRoute = (role) => {
  if (role === "ADMIN") return "/admin-dashboard";
  if (role === "OFFICER") return "/officer-dashboard";
  return "/citizen-dashboard";
};

const getMenuItems = (role) => {
  if (role === "ADMIN") {
    return [
      { label: "Dashboard", icon: <FaClipboardList />, route: "/admin-dashboard" },
      { label: "Manage Users", icon: <FaUsers />, route: "/manage-users" },
      { label: "Manage Officers", icon: <FaUserShield />, route: "/manage-officers" },
      { label: "Categories", icon: <FaFileAlt />, route: "/categories" },
      { label: "Reports", icon: <FaChartBar />, route: "/admin-reports" },
      { label: "Statistics", icon: <FaChartPie />, route: "/admin-statistics" },
      { label: "Admin Profile", icon: <FaUserShield />, route: "/admin-profile" },
    ];
  }

  if (role === "OFFICER") {
    return [
      { label: "Dashboard", icon: <FaFolderOpen />, route: "/officer-dashboard" },
      { label: "Assigned Cases", icon: <FaFolderOpen />, route: "/assigned-cases" },
      { label: "Statistics", icon: <FaChartBar />, route: "/officer-statistics" },
      { label: "Profile", icon: <FaUser />, route: "/officer-profile" },
    ];
  }

  return [
    { label: "Dashboard", icon: <FaFileAlt />, route: "/citizen-dashboard" },
    { label: "Report Crime", icon: <FaFileAlt />, route: "/report-crime" },
    { label: "My Complaints", icon: <FaFileAlt />, route: "/my-complaints" },
    { label: "Track Status", icon: <FaClock />, route: "/track-status" },
    { label: "Profile", icon: <FaUser />, route: "/citizen-profile" },
  ];
};

const AllNotifications = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const menuItems = getMenuItems(auth?.role);

  const handleLogout = async () => {
    if (await window.__reportItShowConfirm("Are you sure you want to logout?")) {
      clearAuth();
      alert("Logged Out Successfully!");
      navigate("/");
    }
  };

  useEffect(() => {
    fetchMyNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="notifications-page">
      <aside className="notifications-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <FaShieldAlt className="logo-icon" />
            <span>Report<span className="highlight">It</span></span>
          </div>
          <p className="panel-text">{auth?.role || "USER"} PANEL</p>

          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.route} onClick={() => navigate(item.route)}>
                {item.icon}
                {item.label}
              </li>
            ))}
            <li className="active-menu">
              <FaBell />
              Notifications
            </li>
          </ul>
        </div>

        <div className="logout" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </div>
      </aside>

      <main className="notifications-main">
        <div className="notifications-topbar">
          <button
            className="back-btn"
            type="button"
            onClick={() => navigate(getBackRoute(auth?.role))}
          >
            <FaArrowLeft />
          </button>
          <h1>Notifications</h1>
        </div>

        <section className="notifications-list-card">
          {loading ? (
            <div className="notification-row empty">Loading notifications...</div>
          ) : notifications.length > 0 ? (
            notifications.map((item) => (
              <article className="notification-row" key={item.id}>
                <div className="notification-row-icon">
                  <FaBell />
                </div>
                <div>
                  <h3>{item.title || "Notification"}</h3>
                  <p>{item.message}</p>
                  {item.time && <span>{item.time}</span>}
                </div>
              </article>
            ))
          ) : (
            <div className="notification-row empty">No notifications yet.</div>
          )}
        </section>
      </main>

      <AIChat />
    </div>
  );
};

export default AllNotifications;
