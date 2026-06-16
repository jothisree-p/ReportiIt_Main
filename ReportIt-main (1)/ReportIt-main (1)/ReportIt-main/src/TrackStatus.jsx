import React, { useEffect, useState } from "react";
import { trackComplaint } from "./api/complaints";
import { fetchMyNotifications } from "./api/notifications";
import NotificationSeeMore from "./NotificationSeeMore";
import { openNotifications } from "./notificationActions";

import { useNavigate } from "react-router-dom";

import "./TrackStatus.css";
import {
  getCurrentCitizen,
  getCitizenInitials,
  getCitizenWelcomeText,
} from "./citizenSession";

import AIChat from "./AIChat";

import {

  FaShieldAlt,
  FaFileAlt,
  FaClock,
  FaUser,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaBell,

} from "react-icons/fa";

const TrackStatus = () => {

  const navigate = useNavigate();
  const citizen = getCurrentCitizen();

  /* ================= NOTIFICATION ================= */

  const [showNotifications,
  setShowNotifications] =
  useState(false);
  const [notifications, setNotifications] = useState([]);

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

      alert(
        "Logged Out Successfully!"
      );

      navigate("/");

    }

  };

  /* ================= SEARCH ================= */

  const [searchId,setSearchId] =
  useState("");

  const [searched,setSearched] =
  useState(false);

  const [filteredComplaints,
  setFilteredComplaints] =
  useState([]);

  /* ================= SEARCH FUNCTION ================= */

  const handleSearch = async () => {

    if(searchId.trim() === ""){

      alert(
        "Please enter Complaint ID"
      );

      setFilteredComplaints([]);

      setSearched(false);

      return;

    }

    try {
      const result = await trackComplaint(searchId.trim());
      const complaint = {
        ...result.complaint,
        timeline: (result.history || []).map((item) => ({
          status: item.newStatus,
          date: item.createdAt?.slice?.(0, 10) || "",
          note: item.remark || "",
        })),
        officer: result.complaint.assignedOfficer || "Not assigned",
        investigationNotes: result.complaint.investigationNotes || [],
      };
      setFilteredComplaints([complaint]);
      setSearched(true);
    } catch (err) {
      alert(err.message || "Complaint ID not found");
      setFilteredComplaints([]);
      setSearched(true);
    }

  };

  return (

    <div className="track-container">

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

            <li
              onClick={() =>
                navigate("/my-complaints")
              }
            >

              <FaFileAlt />

              My Complaints

            </li>

            <li className="active-menu">

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

          <div className="topbar-left">

            {/* BACK BUTTON */}

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
              className="icon-box"
              onClick={() => openNotifications(showNotifications, setShowNotifications, setNotifications)}
            >

              <FaBell className="notification-bell" />

              {notifications.length > 0 && (
                <span className="notification-dot has-notifications"></span>
              )}

            </div>

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

        {/* ================= NOTIFICATION POPUP ================= */}

        {

          showNotifications && (

            <div className="notification-popup">

              <h3>

                Notifications

              </h3>

              {notifications.length > 0 ? (
                notifications.map((item,index)=>(
                  <div className="notification-item" key={index}>
                    {item.message || item}
                  </div>
                ))
              ) : (
                <div className="notification-item">
                  No notifications yet
                </div>
              )}

              <NotificationSeeMore />

            </div>

          )

        }

        {/* ================= CONTENT ================= */}

        <div className="track-content">

          <h1>

            Track Complaint

          </h1>

          {/* SEARCH */}

          <div className="search-section">

            <input
              type="text"
              placeholder="Enter Complaint ID..."
              value={searchId}
              onChange={(e) =>
                setSearchId(e.target.value)
              }
            />

            <button
              onClick={handleSearch}
            >

              Search

            </button>

          </div>

          {/* RESULTS */}

          {

            searched ? (

              filteredComplaints.length > 0 ? (

                filteredComplaints.map(
                  (item,index) => (

                    <div
                      className="track-grid"
                      key={index}
                    >

                      {/* DETAILS */}

                      <div className="details-card">

                        <h2>

                          Complaint Details

                        </h2>

                        <div className="detail-row">

                          <span>ID:</span>

                          <strong>
                            {item.id}
                          </strong>

                        </div>

                        <div className="detail-row">

                          <span>Title:</span>

                          <strong>
                            {item.title}
                          </strong>

                        </div>

                        <div className="detail-row">

                          <span>Category:</span>

                          <strong>
                            {item.category}
                          </strong>

                        </div>

                        <div className="detail-row">

                          <span>Priority:</span>

                          <strong>
                            {item.priority}
                          </strong>

                        </div>

                        <div className="detail-row">

                          <span>Status:</span>

                          <strong className="status-text">
                            {item.status}
                          </strong>

                        </div>

                        <div className="detail-row">

                          <span>Date Filed:</span>

                          <strong>
                            {item.date}
                          </strong>

                        </div>

                        <div className="location">

                          <FaMapMarkerAlt />

                          {item.location}

                        </div>

                        <p className="description">

                          {item.description}

                        </p>

                        <div className="detail-row">

                          <span>
                            Assigned Officer:
                          </span>

                          <strong>
                            {item.officer}
                          </strong>

                        </div>

                      </div>

                      {/* TIMELINE */}

                      <div className="timeline-card">

                        <h2>

                          Status Timeline

                        </h2>

                        {

                          item.timeline.map(
                            (step,i) => (

                              <div
                                className="timeline-item"
                                key={i}
                              >

                                <div className="timeline-dot"></div>

                                <div>

                                  <h4>
                                    {step.status}
                                  </h4>

                                  <p className="timeline-date">
                                    {step.date}
                                  </p>

                                  <p className="timeline-note">
                                    {step.note}
                                  </p>

                                </div>

                              </div>

                            )
                          )

                        }

                        <div className="track-notes-section">
                          <h3>Investigation Notes</h3>
                          {item.investigationNotes.length > 0 ? (
                            item.investigationNotes.map((note, noteIndex) => (
                              <p key={noteIndex}>• {note}</p>
                            ))
                          ) : (
                            <p>No investigation notes added yet.</p>
                          )}
                        </div>

                      </div>

                    </div>

                  )
                )

              ) : (

                <div className="no-data">

                  No complaint found

                </div>

              )

            ) : null

          }

        </div>

      </div>

      {/* ================= AI CHAT ================= */}

      <AIChat />

    </div>

  );

};

export default TrackStatus;
