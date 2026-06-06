import React, { useEffect, useState } from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./ReportDetails.css";

import AIChat from "./AIChat";
import { saveComplaint } from "./complaintsData";
import { ApiError } from "./api/http";
import { isAuthenticated } from "./authStorage";
import { useRequireAuth } from "./hooks/useRequireAuth";
import {
  getCurrentCitizen,
  getCitizenInitials,
  getCitizenName,
} from "./citizenSession";
import { fetchMyNotifications } from "./api/notifications";
import { openNotifications } from "./notificationActions";
import { uploadComplaintFile } from "./api/files";
import { fetchAddressFromCoords } from "./utils/location";

import {

  FaShieldAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFileAlt,
  FaUpload,
  FaBell,
  FaClock,
  FaUser,
  FaArrowLeft,

} from "react-icons/fa";

const ReportDetails = () => {

  const navigate = useNavigate();
  const location = useLocation();
  useRequireAuth("CITIZEN");
  const citizen = getCurrentCitizen();
  const crimeType = location.state?.crimeType || "General";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelector(".report-details-main")?.scrollTo(0, 0);
  }, []);

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

  /* ================= FORM DATA ================= */

  const [formData,setFormData] =
  useState({

    title:"",

    description:"",

    location:"",

    date:"",

    incidentTime:"",

    meridian:"AM",

    evidence:null,

  });

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value,

    });

  };

  /* ================= FILE CHANGE ================= */

  const handleFileChange = (e) => {

    setFormData({

      ...formData,

      evidence:e.target.files[0],

    });

  };

  /* ================= GET LOCATION ================= */

  const getLocation = () => {

    if(navigator.geolocation){

      navigator.geolocation.getCurrentPosition(

        async (position) => {

          const latitude =
          position.coords.latitude;

          const longitude =
          position.coords.longitude;

          try{

            const placeName =
            await fetchAddressFromCoords(latitude, longitude);

            setFormData({

              ...formData,

              location:placeName,

            });

          }

          catch(error){

            alert(
              "Unable to fetch location"
            );

          }

        },

        () => {

          alert(
            "Location access denied"
          );

        }

      );

    }

    else{

      alert(
        "Geolocation not supported"
      );

    }

  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!isAuthenticated()) {
      alert("Please log in to submit a complaint.");
      navigate("/citizen-login");
      return;
    }

    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      alert("Please fill title, description, and location.");
      return;
    }

    try {
      const created = await saveComplaint({
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        date: formData.date || null,
        incidentTime: formData.incidentTime || null,
        category: crimeType,
      });
      if (formData.evidence && created.backendId) {
        await uploadComplaintFile(created.backendId, formData.evidence);
      }
      alert(`Complaint submitted successfully! Reference: ${created.id}`);
      navigate("/my-complaints");
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to submit complaint");
    }

  };

  return (

    <div className="details-container report-details-container">

      {/* ================= SIDEBAR ================= */}

      <div className="sidebar">

        <div>

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
                navigate(
                  "/citizen-dashboard"
                )
              }
            >

              <FaFileAlt />

              Dashboard

            </li>

            <li
              className="active-menu"
            >

              <FaFileAlt />

              Report Crime

            </li>

            <li
              onClick={() =>
                navigate(
                  "/my-complaints"
                )
              }
            >

              <FaFileAlt />

              My Complaints

            </li>

            <li
              onClick={() =>
                navigate(
                  "/track-status"
                )
              }
            >

              <FaClock />

              Track Status

            </li>

            <li
              onClick={() =>
                navigate(
                  "/citizen-profile"
                )
              }
            >

              <FaUser />

              Profile

            </li>

          </ul>

        </div>

      </div>

      {/* ================= MAIN ================= */}

      <div className="main-content report-details-main">

        {/* ================= TOPBAR ================= */}

        <div className="topbar">

          <div className="topbar-left">

            {/* BACK BUTTON */}

            <button
              className="back-btn"
              onClick={() =>
                navigate(-1)
              }
            >

              <FaArrowLeft />

            </button>

            <h3>

              Enter Incident Details

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

            {/* NOTIFICATION POPUP */}

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

                </div>

              )

            }

            {/* PROFILE */}

            <div
              className="profile-section"
              onClick={() =>
                navigate(
                  "/citizen-profile"
                )
              }
            >

              <div className="profile-circle">

                {getCitizenInitials(citizen)}

              </div>

            </div>

          </div>

        </div>

        {/* ================= FORM ================= */}

        <div className="form-wrapper">

          <form
            className="crime-form"
            onSubmit={handleSubmit}
          >

            <h1>

              Crime Details

            </h1>

            {/* TITLE */}

            <label>

              Crime Title

            </label>

            <div className="input-box">

              <FaFileAlt className="input-icon" />

              <input
                type="text"
                name="title"
                placeholder="Enter crime title"
                value={formData.title}
                onChange={handleChange}
                required
              />

            </div>

            {/* DESCRIPTION */}

            <label>

              Description

            </label>

            <textarea
              name="description"
              placeholder="Describe the incident..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>

            {/* LOCATION */}

            <label>

              Location

            </label>

            <div className="input-box">

              <FaMapMarkerAlt className="input-icon" />

              <input
                type="text"
                name="location"
                placeholder="Enter location"
                value={formData.location}
                onChange={handleChange}
                required
              />

            </div>

            <button
              type="button"
              className="location-btn"
              onClick={getLocation}
            >

              Use Current Location

            </button>

            {/* DATE */}

            <label>

              Incident Date

            </label>

            <div className="input-box">

              <FaCalendarAlt className="input-icon" />

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

            </div>

            {/* TIME */}

            <label>

              Incident Time

            </label>

            <div className="time-container">

              <input
                type="time"
                name="incidentTime"
                className="time-input"
                value={formData.incidentTime}
                onChange={handleChange}
                required
              />

              <select
                name="meridian"
                className="time-select"
                value={formData.meridian}
                onChange={handleChange}
              >

                <option value="AM">

                  AM

                </option>

                <option value="PM">

                  PM

                </option>

              </select>

            </div>

            {/* FILE */}

            <label>

              Upload Evidence

            </label>

            <div className="upload-box">

              <FaUpload className="upload-icon" />

              <input
                type="file"
                onChange={handleFileChange}
              />

            </div>

            {/* FILE NAME */}

            {

              formData.evidence && (

                <p className="file-name">

                  {formData.evidence.name}

                </p>

              )

            }

            {/* SUBMIT */}

            <button
              type="submit"
              className="submit-btn"
            >

              Submit Report

            </button>

          </form>

        </div>

      </div>

      {/* ================= AI CHAT ================= */}

      <AIChat />

    </div>

  );

};

export default ReportDetails;
