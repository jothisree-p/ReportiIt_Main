import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBell, FaShieldAlt } from "react-icons/fa";
import AIChat from "./AIChat";
import { fetchMyNotifications } from "./api/notifications";
import NotificationSeeMore from "./NotificationSeeMore";
import { getAuth } from "./authStorage";
import "./AllNotifications.css";

const getBackRoute = (role) => {
  if (role === "ADMIN") return "/admin-dashboard";
  if (role === "OFFICER") return "/officer-dashboard";
  return "/citizen-dashboard";
};

const AllNotifications = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="notifications-page">
      <aside className="notifications-sidebar">
        <div className="sidebar-logo">
          <FaShieldAlt className="logo-icon" />
          <span>Report<span className="highlight">It</span></span>
        </div>
        <p className="panel-text">{auth?.role || "USER"} PANEL</p>
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
