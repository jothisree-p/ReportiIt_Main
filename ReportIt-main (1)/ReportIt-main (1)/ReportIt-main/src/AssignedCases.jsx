import React,
{
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
import { clearAuth } from "./authStorage";

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

  Math.ceil(

    filteredCases.length /
    casesPerPage

  );

  /* ================= LOGOUT ================= */

  const handleLogout = () => {

    const confirmLogout =
    window.confirm(
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

                  <div className="notification-header">

                    <h3>

                      Notifications

                    </h3>

                    <span>

                      3 New

                    </span>

                  </div>

                  {/* CARD */}

                  <div className="notification-card">

                    <div className="notification-left blue-bg">

                      🚔

                    </div>

                    <div>

                      <h4>

                        New Complaint Assigned

                      </h4>

                      <p>

                        CMP-2024-011 assigned
                        to your team.

                      </p>

                    </div>

                  </div>

                  {/* CARD */}

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

                  {/* CARD */}

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
              className="profile-circle"

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

            </div>

            {/* ROWS */}

            {

              currentCases.map(
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

                    {item.priority}

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

                </div>

              ))

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
