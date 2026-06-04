import React, { useState } from "react";
import { trackComplaint } from "./api/complaints";

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

  /* ================= LOGOUT ================= */

  const handleLogout = () => {

    const confirmLogout =
    window.confirm(
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

  /* ================= DUMMY DATA ================= */

  const complaints = [

    {

      id:"CMP-2024-001",

      title:"Bike Theft at Market Area",

      category:"Theft",

      priority:"High",

      status:"In Progress",

      date:"2024-03-15",

      location:"Central Market, Zone A",

      description:
      "My bike was stolen from the parking area near Central Market around 3 PM.",

      officer:"Inspector Patel",

      timeline:[

        {
          status:"Submitted",
          date:"2024-03-15",
          note:"Complaint registered",
        },

        {
          status:"Assigned",
          date:"2024-03-15",
          note:"Assigned to Inspector Patel",
        },

        {
          status:"In Progress",
          date:"2024-03-16",
          note:"Investigation started, CCTV footage being reviewed",
        },

      ],

    },

    {

      id:"CMP-2024-006",

      title:"Broken Street Light - Park Road",

      category:"Street Light Issue",

      priority:"Medium",

      status:"Resolved",

      date:"2024-03-19",

      location:"Park Road",

      description:
      "Street light not working for 4 days.",

      officer:"Municipal Team",

      timeline:[

        {
          status:"Submitted",
          date:"2024-03-19",
          note:"Complaint registered",
        },

        {
          status:"Resolved",
          date:"2024-03-20",
          note:"Street light repaired",
        },

      ],

    },

    {

      id:"CMP-2024-009",

      title:"Road Accident Near Signal",

      category:"Road Accident",

      priority:"High",

      status:"Pending",

      date:"2024-03-21",

      location:"Anna Salai Signal",

      description:
      "Two vehicles collided near signal causing traffic congestion.",

      officer:"Traffic Inspector",

      timeline:[

        {
          status:"Submitted",
          date:"2024-03-21",
          note:"Complaint submitted",
        },

        {
          status:"Pending",
          date:"2024-03-21",
          note:"Waiting for officer assignment",
        },

      ],

    },

  ];

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
        officer: result.complaint.assignedOfficerName || "Not assigned",
      };
      setFilteredComplaints([complaint]);
      setSearched(true);
    } catch {
      const result =
        complaints.filter(
          (item) =>
            item.id.toLowerCase() === searchId.toLowerCase()
        );

      if(result.length === 0){
        alert("Complaint ID not found");
        setFilteredComplaints([]);
        setSearched(true);
        return;
      }

      setFilteredComplaints(result);
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
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
            >

              <FaBell className="notification-bell" />

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

              <div className="notification-item">

                🚔 Officer assigned to
                complaint CMP-2024-001

              </div>

              <div className="notification-item">

                📌 Complaint under
                investigation

              </div>

              <div className="notification-item">

                ✅ Complaint resolved
                successfully

              </div>

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
