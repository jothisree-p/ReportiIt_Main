import React,
{
  useEffect,
  useState
}
from "react";

import { useNavigate }
from "react-router-dom";

import "./AssignedCases.css";

import AIChat from "./AIChat";
import {
  getCurrentOfficer,
  getOfficerInitials,
  getOfficerWelcomeText,
} from "./officerSession";
import { useComplaints } from "./hooks/useComplaints";
import { fetchAssignedComplaints } from "./api/complaints";
import { feedbackListByComplaintId, fetchOfficerFeedback } from "./api/feedback";
import { clearAuth } from "./authStorage";
import { fetchMyNotifications } from "./api/notifications";
import NotificationSeeMore from "./NotificationSeeMore";
import { openNotifications } from "./notificationActions";

import {

  FaShieldAlt,
  FaFolderOpen,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
  FaBell,
  FaArrowLeft,
  FaSearch,

} from "react-icons/fa";

const AssignedCases = () => {

  const navigate = useNavigate();
  const officer = getCurrentOfficer();

  const [showNotifications,
  setShowNotifications] =
  useState(false);
  const [notifications, setNotifications] = useState([]);
  const [feedbackByComplaint, setFeedbackByComplaint] = useState({});

  const [searchTerm,
  setSearchTerm] =
  useState("");

  const [activeFilter,
  setActiveFilter] =
  useState("All");

  /* ================= PAGINATION ================= */

  const [currentPage,
  setCurrentPage] =
  useState(1);

  const casesPerPage = 3;

  /* ================= DATA ================= */

  const { complaints: cases } = useComplaints(fetchAssignedComplaints);

  useEffect(() => {
    fetchMyNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]));
  }, []);

  useEffect(() => {
    fetchOfficerFeedback()
      .then((items) => setFeedbackByComplaint(feedbackListByComplaintId(items)))
      .catch(() => setFeedbackByComplaint({}));
  }, []);

  /* ================= FILTER ================= */

  const filteredCases =

  cases.filter((item)=>{

    const matchesSearch =

      (item.title || "")
      .toLowerCase()
      .includes(
        searchTerm.toLowerCase()
      )

      ||

      (item.id || "")
      .toLowerCase()
      .includes(
        searchTerm.toLowerCase()
      )

      ||

      (item.citizen || "")
      .toLowerCase()
      .includes(
        searchTerm.toLowerCase()
      );

    const matchesFilter =

      activeFilter === "All"

      ||

      activeFilter === "Assigned"

      ||

      item.status === activeFilter;

    return (

      matchesSearch &&
      matchesFilter

    );

  });

  /* ================= PAGINATION LOGIC ================= */

  const indexOfLastCase =

  currentPage * casesPerPage;

  const indexOfFirstCase =

  indexOfLastCase - casesPerPage;

  const currentCases =

  filteredCases.slice(

    indexOfFirstCase,
    indexOfLastCase

  );

  const totalPages =

  Math.max(

    1,

    Math.ceil(

    filteredCases.length /
    casesPerPage

    )

  );

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {

    const confirmLogout =
    await window.__reportItShowConfirm(
      "Are you sure you want to logout?"
    );

    if(confirmLogout){

      navigate("/");

    }

  };

  return (

    <div className="dashboard-container">

      {/* ================= SIDEBAR ================= */}

      <div className="sidebar">

        <div>

          {/* LOGO */}

          <div className="sidebar-logo">

            <FaShieldAlt className="logo-icon" />

            <span className="logo-text">

              Report<span className="highlight">It</span>

            </span>

          </div>

          <p className="panel-text">

            OFFICER PANEL

          </p>

          {/* MENU */}

          <ul className="sidebar-menu">

            <li
              onClick={() =>
                navigate("/officer-dashboard")
              }
            >

              <FaFolderOpen />

              Dashboard

            </li>

            <li className="active-menu">

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

          {/* LEFT */}

          <div className="topbar-left">

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

          {/* RIGHT */}

          <div className="topbar-right">

            {/* NOTIFICATION */}

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

                <div className="notification-dropdown assigned-notification-dropdown">

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
              className="profile-circle assigned-profile-circle"

              onClick={() =>
                navigate("/officer-profile")
              }
            >

              {getOfficerInitials(officer)}

            </div>

          </div>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="dashboard-content">

          <h1>

            Assigned Cases

          </h1>

          {/* SEARCH FILTER */}

          <div className="assigned-search-filter">

            {/* SEARCH */}

            <div className="assigned-search-box">

              <FaSearch className="search-icon" />

              <input
                type="text"
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e)=>{

                  setSearchTerm(
                    e.target.value
                  );

                  setCurrentPage(1);

                }}
              />

            </div>

            {/* FILTERS */}

            <div className="assigned-filters">

              {

                [
                  "All",
                  "Assigned",
                  "Pending",
                  "In Progress",
                  "Resolved",
                ].map((item)=>(

                  <button
                    key={item}

                    className={

                      activeFilter === item
                      ? "active-filter"
                      : ""

                    }

                    onClick={() => {

                      setActiveFilter(item);

                      setCurrentPage(1);

                    }}
                  >

                    {item}

                  </button>

                ))

              }

            </div>

          </div>

          {/* ================= TABLE ================= */}

          <div className="assigned-table-box">

            {/* HEADER */}

            <div className="assigned-table-header">

              <p>ID</p>
              <p>Title</p>
              <p>Citizen</p>
              <p>Priority</p>
              <p>Status</p>
              <p>Feedback</p>

            </div>

            {/* ROWS */}

            {

              currentCases.length > 0 ? currentCases.map(
                (item,index)=>(

                <div
                  className="assigned-table-row"
                  key={index}

                  onClick={() =>
                    navigate(
                      "/officer-complaint-details",
                      {
                        state:item
                      }
                    )
                  }
                >

                  <p className="assigned-case-id">

                    {item.id}

                  </p>

                  <p>

                    {item.title}

                  </p>

                  <p>

                    {item.citizen}

                  </p>

                  <p>

                    {item.priority || "Not set"}

                  </p>

                  <span
                    className={

                      item.status === "Resolved"

                      ? "assigned-resolved"

                      : item.status === "Pending"

                      ? "assigned-pending"

                      : "assigned-progress"

                    }
                  >

                    {item.status}

                  </span>

                  <div className="assigned-feedback-cell">
                    {feedbackByComplaint[String(item.backendId)] ? (
                      <button
                        type="button"
                        className="assigned-feedback-btn"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate("/feedback-details", {
                            state: {
                              panel: "officer",
                              feedback: feedbackByComplaint[String(item.backendId)],
                            },
                          });
                        }}
                      >
                        View Feedback
                      </button>
                    ) : (
                      <span className="assigned-no-feedback">No feedback</span>
                    )}
                  </div>

                </div>

              )) : (

                <div className="assigned-empty-row">

                  No cases found for this filter.

                </div>

              )

            }

          </div>

          {/* ================= PAGINATION ================= */}

          <div className="pagination">

            <button

              disabled={
                currentPage === 1
              }

              onClick={() =>
                setCurrentPage(
                  currentPage - 1
                )
              }

            >

              Prev

            </button>

            {

              [...Array(totalPages)].map(
                (_,index)=>(

                  <button

                    key={index}

                    className={
                      currentPage === index + 1
                      ? "active-page"
                      : ""
                    }

                    onClick={() =>
                      setCurrentPage(
                        index + 1
                      )
                    }

                  >

                    {index + 1}

                  </button>

                )
              )

            }

            <button

              disabled={
                currentPage === totalPages
              }

              onClick={() =>
                setCurrentPage(
                  currentPage + 1
                )
              }

            >

              Next

            </button>

          </div>

        </div>

      </div>

      {/* ================= AI CHAT ================= */}

      <AIChat />

    </div>

  );

};

export default AssignedCases;
