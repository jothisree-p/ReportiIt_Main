import React,
{
  useState
}
from "react";
import { clearAuth } from "./authStorage";
import { useRequireAuth } from "./hooks/useRequireAuth";
import { useComplaints } from "./hooks/useComplaints";
import { fetchMyComplaints } from "./api/complaints";

import { useNavigate }
from "react-router-dom";

import "./MyComplaints.css";

import AIChat from "./AIChat";
import {
  getCurrentCitizen,
  getCitizenInitials,
  getCitizenWelcomeText,
} from "./citizenSession";

import {

  FaShieldAlt,
  FaFileAlt,
  FaClock,
  FaUser,
  FaSignOutAlt,
  FaSearch,
  FaBell,
  FaArrowLeft,

} from "react-icons/fa";

const MyComplaints = () => {

  const navigate = useNavigate();
  useRequireAuth("CITIZEN");
  const citizen = getCurrentCitizen();

  /* ================= STATES ================= */

  const [showNotifications,
  setShowNotifications] =
  useState(false);

  const [activeTab,
  setActiveTab] =
  useState("All");

  const [searchTerm,
  setSearchTerm] =
  useState("");

  /* ================= PAGINATION ================= */

  const [currentPage,
  setCurrentPage] =
  useState(1);

  const complaintsPerPage = 3;

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

  /* ================= NOTIFICATIONS ================= */

  const notifications = [

    {
      message:
      "🚓 Officer assigned to complaint CMP-2024-001"
    },

    {
      message:
      "📌 Complaint under investigation"
    },

    {
      message:
      "✅ Complaint resolved successfully"
    },

  ];

  const { complaints, loading, error } = useComplaints(fetchMyComplaints);

  /* ================= FILTER ================= */

  const filteredComplaints =

    complaints.filter((item)=>{

      const matchesTab =

        activeTab === "All"

        ||

        item.status === activeTab;

      const matchesSearch =

        item.title
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )

        ||

        item.category
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )

        ||

        item.id
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

      return (
        matchesTab &&
        matchesSearch
      );

    });

  /* ================= PAGINATION ================= */

  const indexOfLastComplaint =

  currentPage * complaintsPerPage;

  const indexOfFirstComplaint =

  indexOfLastComplaint -
  complaintsPerPage;

  const currentComplaints =

  filteredComplaints.slice(

    indexOfFirstComplaint,
    indexOfLastComplaint

  );

  const totalPages =

  Math.ceil(

    filteredComplaints.length /
    complaintsPerPage

  );

  return (

    <div className="complaints-container">

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

            <li
              onClick={() =>
                navigate("/citizen-dashboard")
              }
            >

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

            <li className="active-menu">

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
              onClick={() =>
                navigate(-1)
              }
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
              className="icon-box"
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

                <div className="notification-popup">

                  <h3>

                    Notifications

                  </h3>

                  {

                    notifications.map(
                      (item,index)=>(

                        <div
                          className="notification-item"
                          key={index}
                        >

                          {item.message}

                        </div>

                      )
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

        <div className="complaints-content">

          <h1>

            My Complaints

          </h1>

          {/* SEARCH + FILTER */}

          <div className="search-filter">

            {/* SEARCH */}

            <div className="search-box">

              <FaSearch className="search-icon" />

              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e)=>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

            </div>

            {/* FILTERS */}

            <div className="mycomplaints-filter-tabs">

              {

                [
                  "All",
                  "Pending",
                  "In Progress",
                  "Resolved",
                  "Rejected",
                ].map((item)=>(

                  <button
                    key={item}

                    className={

                      activeTab === item

                      ?

                      "mycomplaints-filter-btn mycomplaints-active-filter"

                      :

                      "mycomplaints-filter-btn"

                    }

                    onClick={() => {

                      setActiveTab(item);

                      setCurrentPage(1);

                    }}
                  >

                    {item}

                  </button>

                ))

              }

            </div>

          </div>

          {/* TABLE */}

          <div className="mycomplaints-table-container">

            <div className="mycomplaints-table-header">

              <p>ID</p>
              <p>Title</p>
              <p>Category</p>
              <p>Priority</p>
              <p>Status</p>
              <p>Date</p>

            </div>

            {loading && (
              <p style={{ padding: "2rem", textAlign: "center" }}>Loading complaints...</p>
            )}
            {error && (
              <p style={{ padding: "2rem", textAlign: "center", color: "#dc2626" }}>{error}</p>
            )}
            {!loading && !error && currentComplaints.length === 0 && (
              <p style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                No complaints yet.{" "}
                <span
                  style={{ color: "#2563eb", cursor: "pointer" }}
                  onClick={() => navigate("/report-crime")}
                >
                  Report a crime
                </span>
              </p>
            )}
            {

              currentComplaints.map(
                (item,index)=>(

                  <div
                    className="mycomplaints-table-row"
                    key={index}

                    onClick={() =>
                      navigate(
                        "/citizen-complaint-details",
                        {
                          state:item
                        }
                      )
                    }
                  >

                    <p
                      className="mycomplaints-id-text"
                      data-label="ID"
                    >

                      {item.id}

                    </p>

                    <p data-label="Title">

                      {item.title}

                    </p>

                    <p data-label="Category">

                      {item.category}

                    </p>

                    <p
                      data-label="Priority"
                      className={

                        item.priority === "Critical"

                        ? "mycomplaints-critical"

                        : item.priority === "High"

                        ? "mycomplaints-high"

                        : item.priority === "Medium"

                        ? "mycomplaints-medium"

                        : "mycomplaints-low"

                      }
                    >

                      {item.priority}

                    </p>

                    <span
                      data-label="Status"
                      className={

                        item.status === "Pending"

                        ?

                        "mycomplaints-status-badge mycomplaints-status-pending"

                        :

                        item.status === "In Progress"

                        ?

                        "mycomplaints-status-badge mycomplaints-status-progress"

                        :

                        item.status === "Resolved"

                        ?

                        "mycomplaints-status-badge mycomplaints-status-resolved"

                        :

                        "mycomplaints-status-badge mycomplaints-status-rejected"

                      }
                    >

                      {item.status}

                    </span>

                    <p data-label="Date">

                      {item.date}

                    </p>

                  </div>

                )
              )

            }

          </div>

          {/* PAGINATION */}

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

      {/* AI CHAT */}

      <AIChat />

    </div>

  );

};

export default MyComplaints;
