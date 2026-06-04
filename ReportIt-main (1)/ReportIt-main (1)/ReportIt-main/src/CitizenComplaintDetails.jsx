import React, { useEffect, useState } from "react";
import { useComplaints } from "./hooks/useComplaints";
import { fetchMyComplaints } from "./api/complaints";
import { fetchMyNotifications } from "./api/notifications";
import { clearAuth } from "./authStorage";
import {
  getCurrentCitizen,
  getCitizenInitials,
} from "./citizenSession";

import "./CitizenComplaintDetails.css";

import {
  FaArrowLeft,
  FaBell,
  FaMapMarkerAlt,
  FaFileAlt,
  FaClock,
  FaUser,
  FaSignOutAlt,
  FaShieldAlt,
} from "react-icons/fa";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";
const CitizenComplaintDetails = () => {

  const navigate = useNavigate();
  const citizen = getCurrentCitizen();

  const location = useLocation();

  const { complaints: storedComplaints } = useComplaints(fetchMyComplaints);

  const complaint =
    storedComplaints.find(
      (item) => item.id === location.state?.id
    ) ||
    location.state ||
    storedComplaints[0] ||
    {};

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchMyNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]));
  }, []);

  const [showNotifications,
  setShowNotifications] =
  useState(false);

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

  return (

    <div className="citizen-details-container">

      {/* ================= SIDEBAR ================= */}

      <div className="citizen-sidebar">

        <div>

          {/* LOGO */}

          <div className="citizen-logo">

            <FaShieldAlt className="citizen-logo-icon" />

            <h1>

              Report
              <span>It</span>

            </h1>

          </div>

          <p className="citizen-panel-text">

            CITIZEN PANEL

          </p>

          {/* MENU */}

          <ul className="citizen-menu">

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
              className="citizen-active-menu"
            >

              <FaClock />

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
          className="citizen-logout"
          onClick={handleLogout}
        >

          <FaSignOutAlt />

          Logout

        </div>

      </div>

      {/* ================= MAIN ================= */}

      <div className="citizen-main">

        {/* ================= TOPBAR ================= */}

        <div className="citizen-topbar">

          <div className="citizen-topbar-left">

            <button
              className="back-btn"

              onClick={() =>
                navigate(-1)
              }
            >

              <FaArrowLeft />

            </button>

            <h3>

              Complaint Details

            </h3>

          </div>

          {/* RIGHT */}

          <div className="citizen-topbar-right">

            <div
              className="citizen-bell"

              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
            >

              <FaBell />

            </div>

            {

              showNotifications && (

                <div className="citizen-popup">

                  <h4>

                    Notifications

                  </h4>

                  {

                    notifications.length > 0 ? (

                      notifications.map((item,index)=>(

                        <div className="citizen-popup-item" key={index}>

                          {item.message || item}

                        </div>

                      ))

                    ) : (

                      <div className="citizen-popup-item">

                        No notifications yet

                      </div>

                    )

                  }

                </div>

              )

            }

            <div
              className="citizen-profile-circle"

              onClick={() =>
                navigate("/citizen-profile")
              }
            >

              {getCitizenInitials(citizen)}

            </div>

          </div>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="citizen-details-content">

          <div className="citizen-details-card">

            <h1>

              {complaint?.title}

            </h1>

            <div className="citizen-details-grid">

            <div className="citizen-detail-row">

              <span>ID</span>

              <span>

                {complaint?.id}

              </span>

            </div>

            <div className="citizen-detail-row">

              <span>Category</span>

              <span>

                {complaint?.category}

              </span>

            </div>

            <div className="citizen-detail-row">

              <span>Priority</span>

              <span>

                {complaint?.priority}

              </span>

            </div>

            <div className="citizen-detail-row">

              <span>Status</span>

              <span>

                {complaint?.status}

              </span>

            </div>

            <div className="citizen-detail-row">

              <span>Date</span>

              <span>

                {complaint?.date}

              </span>

            </div>

            </div>

            <div className="citizen-location">

              <FaMapMarkerAlt />

              {complaint?.location || "Central Market, Chennai"}

            </div>

            {/* DESCRIPTION */}

            <div className="citizen-description">

              <h3>

                Description

              </h3>

              <p>

                {complaint?.lastUpdate || complaint?.description || "This complaint has been submitted successfully. Authorities are reviewing the issue and updates will appear here."}

              </p>

            </div>

            {/* TIMELINE */}

            <div className="citizen-timeline">

              <h3>

                Timeline

              </h3>

              <div className="timeline-box">

                <div className="timeline-dot"></div>

                <div>

                  <h4>

                    Complaint Submitted

                  </h4>

                  <p>

                    Your complaint was received.

                  </p>

                </div>

              </div>

              {

                complaint?.assignedOfficer && (

                  <div className="timeline-box">

                    <div className="timeline-dot active-dot"></div>

                    <div>

                      <h4>

                        Officer Assigned

                      </h4>

                      <p>

                        {complaint.assignedOfficer}

                      </p>

                    </div>

                  </div>

                )

              }

              <div className="timeline-box">

                <div className="timeline-dot active-dot"></div>

                <div>

                  <h4>

                    {complaint?.status || "Under Review"}

                  </h4>

                  <p>

                    Priority: {complaint?.priority || "Medium"}

                  </p>

                </div>

              </div>

              {

                complaint?.investigationNotes?.map((item,index)=>(

                  <div className="timeline-box" key={index}>

                    <div className="timeline-dot active-dot"></div>

                    <div>

                      <h4>

                        Officer Update

                      </h4>

                      <p>

                        {item}

                      </p>

                    </div>

                  </div>

                ))

              }

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default CitizenComplaintDetails;
