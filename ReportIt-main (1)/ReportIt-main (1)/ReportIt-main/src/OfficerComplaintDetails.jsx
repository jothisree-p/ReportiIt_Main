import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import "./OfficerComplaintDetails.css";

import AIChat from "./AIChat";
import {
  getCurrentOfficer,
  getOfficerDisplayName,
  getOfficerInitials,
  getOfficerWelcomeText,
} from "./officerSession";
import { updateComplaint } from "./complaintsData";
import { createNotification } from "./api/notifications";
import { updateComplaintApi } from "./api/complaints";
import { clearAuth } from "./authStorage";

import {

  FaShieldAlt,
  FaFolderOpen,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
  FaBell,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPaperPlane,

} from "react-icons/fa";

const OfficerComplaintDetails = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const officer = getCurrentOfficer();
  const selectedComplaint = location.state || {
    id:"CMP-2024-001",
    title:"Bike Theft at Market Area",
    category:"Theft",
    citizen:"Rahul Sharma",
    priority:"Pending",
    status:"In Progress",
  };

  const [showNotifications,
  setShowNotifications] =
  useState(false);

  const [note,
  setNote] =
  useState("");

  const [status,
  setStatus] =
  useState(selectedComplaint.status || "In Progress");

  /* ================= PRIORITY ================= */

  const [priority,
  setPriority] =
  useState(selectedComplaint.priority || "Pending");

  const [notes,
  setNotes] =
  useState(
    selectedComplaint.investigationNotes || [

      "CCTV footage collected from nearby shops",

      "Witness statement recorded",

    ]
  );

  /* ================= ADD NOTE ================= */

  const handleAddNote = async () => {

    if(note.trim() === "") return;

    const updatedNotes = [

      ...notes,
      note,

    ];

    setNotes(updatedNotes);

    try {
      if (selectedComplaint.backendId) {
        await updateComplaintApi(selectedComplaint.backendId, {
          note,
          lastUpdate: `Officer added a new note: ${note}`,
        });
      }
    } catch (err) {
      alert(err.message || "Failed to save note");
    }

    setNote("");

  };

  /* ================= SAVE UPDATES ================= */

  const saveCaseUpdates = async () => {

    try {
      if (selectedComplaint.backendId) {
        await updateComplaintApi(selectedComplaint.backendId, {
          status,
          priority,
          lastUpdate: `Status changed to ${status} with ${priority} priority`,
        });
      } else {
        await updateComplaint(selectedComplaint.id, {
          status,
          priority,
          investigationNotes: notes,
          lastUpdate: `Status changed to ${status} with ${priority} priority`,
        });
      }

      await addCitizenNotification(
        `Your complaint ${selectedComplaint.id} was updated to ${status} with ${priority} priority.`
      );

      alert("Case updated successfully and citizen notified!");
    } catch (err) {
      alert(err.message || "Failed to update case");
    }

  };

  /* ================= SEND NOTIFICATION ================= */

  const sendNotification = async () => {

    const notificationMessage =

    `Your complaint ${selectedComplaint.id}
     has been updated to
     "${status}" status
     with "${priority}" priority.`;

    try {
      await addCitizenNotification(notificationMessage);
      alert("Notification sent successfully!");
    } catch (err) {
      alert(err.message || "Failed to send notification");
    }

  };

  const addCitizenNotification = async (message) => {
    if (!selectedComplaint.citizenId) return;
    await createNotification(
      selectedComplaint.citizenId,
      "Complaint Update",
      message
    );
  };

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

          <div className="sidebar-logo">

            <FaShieldAlt className="logo-icon" />

            <span>Report<span className="highlight">It</span></span>

          </div>

          <p className="panel-text">

            OFFICER PANEL

          </p>

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

            </div>

            {

              showNotifications && (

                <div className="notification-popup">

                  <h3>

                    Notifications

                  </h3>

                  <div className="notification-item">

                    🚔 New complaint assigned

                  </div>

                  <div className="notification-item">

                    📌 Investigation update pending

                  </div>

                </div>

              )

            }

            {/* PROFILE */}

            <div className="profile-circle">

              {getOfficerInitials(officer)}

            </div>

          </div>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="dashboard-content">

          

          <h1>

            Case: {selectedComplaint.id}

          </h1>

          <div className="details-grid">

            {/* ================= LEFT ================= */}

            <div className="details-card">

              <h2>

                Complaint Details

              </h2>

              <div className="detail-row">

                <span>Title:</span>

                <p>

                  {selectedComplaint.title}

                </p>

              </div>

              <div className="detail-row">

                <span>Category:</span>

                <p>

                  {selectedComplaint.category}

                </p>

              </div>

              {/* PRIORITY */}

              <div className="detail-row">

                <span>Priority:</span>

                <p
                  className={`priority-text ${

                    priority === "Critical"
                    ? "critical"

                    : priority === "High"
                    ? "high"

                    : priority === "Medium"
                    ? "medium"

                    : "low"

                  }`}
                >

                  {priority}

                </p>

              </div>

              <div className="detail-row">

                <span>Citizen:</span>

                <p>

                  {selectedComplaint.citizen}

                </p>

              </div>

              <div className="location-row">

                <FaMapMarkerAlt />

              {selectedComplaint.location || "Central Market, Zone A"}

              </div>

              <div className="description-box">

                <span>Description:</span>

                <p>

                  {selectedComplaint.description || "This complaint is assigned for investigation. Update the case status and notify the citizen when needed."}

                </p>

              </div>

              {/* STATUS */}

              <div className="status-section">

                <h3>

                  Update Status

                </h3>

                <div className="status-buttons">

                  {

                    [
                      "Pending",
                      "In Progress",
                      "Resolved",
                      "Rejected",
                    ].map((item) => (

                      <button
                        key={item}
                        className={
                          status === item
                          ? "active-status"
                          : ""
                        }
                        onClick={() =>
                          setStatus(item)
                        }
                      >

                        {item}

                      </button>

                    ))

                  }

                </div>

              </div>

              {/* PRIORITY BUTTONS */}

              <div className="priority-section">

                <h3>

                  Update Priority

                </h3>

                <div className="priority-buttons">

                  {

                    [
                      "Low",
                      "Medium",
                      "High",
                      "Critical",
                    ].map((item) => (

                      <button
                        key={item}

                        className={
                          priority === item
                          ? "active-priority"
                          : ""
                        }

                        onClick={() =>
                          setPriority(item)
                        }
                      >

                        {item}

                      </button>

                    ))

                  }

                </div>

              </div>

              {/* SEND BUTTON */}

              <button
                className="notify-btn"
                onClick={sendNotification}
              >

                <FaPaperPlane />

                Send Notification

              </button>

              {/* SAVE BUTTON */}

              <button
                className="save-btn"
                onClick={saveCaseUpdates}
              >

                Save Updates

              </button>

            </div>

            {/* ================= RIGHT ================= */}

            <div className="right-section">

              {/* TIMELINE */}

              <div className="timeline-card">

                <h2>

                  Timeline

                </h2>

                <div className="timeline-item">

                  <div className="dot"></div>

                  <div>

                    <h4>

                      Submitted

                    </h4>

                    <p>

                      2024-03-15

                    </p>

                    <span>

                      Complaint registered

                    </span>

                  </div>

                </div>

                <div className="timeline-item">

                  <div className="dot"></div>

                  <div>

                    <h4>

                      Assigned

                    </h4>

                    <p>

                      2024-03-15

                    </p>

                    <span>

                      Assigned to {getOfficerDisplayName(officer)}

                    </span>

                  </div>

                </div>

                <div className="timeline-item">

                  <div className="dot"></div>

                  <div>

                    <h4>

                      {status}

                    </h4>

                    <p>

                      {new Date().toLocaleDateString()}

                    </p>

                    <span>

                      Investigation in progress

                    </span>

                  </div>

                </div>

              </div>

              {/* NOTES */}

              <div className="notes-card">

                <h2>

                  Add Investigation Note

                </h2>

                <div className="note-input">

                  <input
                    type="text"
                    placeholder="Enter note..."
                    value={note}
                    onChange={(e) =>
                      setNote(
                        e.target.value
                      )
                    }
                  />

                  <button
                    onClick={handleAddNote}
                  >

                    <FaPaperPlane />

                  </button>

                </div>

                <div className="notes-list">

                  {

                    notes.map(
                      (item,index) => (

                      <p key={index}>

                        • {item}

                      </p>

                    ))

                  }

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <AIChat />

    </div>

  );

};

export default OfficerComplaintDetails;
