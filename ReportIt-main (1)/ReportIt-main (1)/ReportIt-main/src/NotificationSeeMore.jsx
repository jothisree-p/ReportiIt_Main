import React from "react";
import { useNavigate } from "react-router-dom";

const NotificationSeeMore = () => {
  const navigate = useNavigate();

  return (
    <button
      className="notification-see-more"
      type="button"
      onClick={() => navigate("/notifications")}
    >
      See more
    </button>
  );
};

export default NotificationSeeMore;
