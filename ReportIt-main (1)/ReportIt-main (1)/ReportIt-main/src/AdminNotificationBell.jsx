import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { fetchMyNotifications } from "./api/notifications";
import { openNotifications } from "./notificationActions";

const AdminNotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchMyNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]));
  }, []);

  return (
    <>
      <div
        className="notification-btn"
        onClick={() => openNotifications(open, setOpen, setNotifications)}
      >
        <FaBell className="notification-bell" />
        {notifications.length > 0 && <span className="notification-dot has-notifications" />}
      </div>

      {open && (
        <div className="notification-dropdown">
          <h3>Notifications</h3>
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div className="notification-item" key={item.id}>
                <strong>{item.title}</strong>
                <p>{item.message}</p>
              </div>
            ))
          ) : (
            <div className="notification-item">No notifications yet</div>
          )}
        </div>
      )}
    </>
  );
};

export default AdminNotificationBell;
