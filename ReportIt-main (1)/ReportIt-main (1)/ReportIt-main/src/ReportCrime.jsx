import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import "./ReportCrime.css";

import AIChat from "./AIChat";
import { useRequireAuth } from "./hooks/useRequireAuth";
import {
  getCurrentCitizen,
  getCitizenInitials,
} from "./citizenSession";
import { fetchMyNotifications } from "./api/notifications";
import { openNotifications } from "./notificationActions";
import { fetchCategories } from "./api/categories";

import {

  FaShieldAlt,
  FaFileAlt,
  FaBolt,
  FaHome,
  FaCarCrash,
  FaLaptop,
  FaUserShield,
  FaArrowLeft,
  FaClock,
  FaUser,
  FaPlusCircle,
  FaSignOutAlt,
  FaBell,

} from "react-icons/fa";

const ReportCrime = () => {

  const navigate = useNavigate();
  useRequireAuth("CITIZEN");
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

      alert("Logged Out Successfully!");

      navigate("/");

    }

  };

  /* ================= STATES ================= */

  const [showOtherInput,setShowOtherInput] =
  useState(false);

  const [customCrime,setCustomCrime] =
  useState("");
  const [crimeTypes,setCrimeTypes] =
  useState([]);
  const [loadingCategories,setLoadingCategories] =
  useState(true);

  /* ================= CRIME TYPES ================= */

  const getCategoryIcon = (name = "") => {
    const value = name.toLowerCase();
    if (value.includes("street") || value.includes("light")) return <FaBolt />;
    if (value.includes("property") || value.includes("home")) return <FaHome />;
    if (value.includes("road") || value.includes("accident")) return <FaCarCrash />;
    if (value.includes("cyber")) return <FaLaptop />;
    if (value.includes("harassment")) return <FaUserShield />;
    if (value.includes("other")) return <FaPlusCircle />;
    return <FaFileAlt />;
  };

  useEffect(() => {
    fetchCategories()
      .then(setCrimeTypes)
      .catch((err) => alert(err.message || "Failed to load categories"))
      .finally(() => setLoadingCategories(false));
  }, []);

  return (

    <div className="report-container">

      {/* ================= SIDEBAR ================= */}

      <div className="sidebar">

        <div className="sidebar-top">

          <div className="sidebar-logo">

            <FaShieldAlt className="logo-icon" />

            <span>Report<span className="highlight">It</span></span>

          </div>

          <p className="panel-text">

            CITIZEN PANEL

          </p>

          <ul className="sidebar-menu">

            <li
              onClick={() =>
                navigate("/citizen-dashboard")
              }
            >

              <FaFileAlt />

              Dashboard

            </li>

            <li className="active-menu">

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

        <div className="report-topbar">

          <div className="report-topbar-left">

            {/* BACK BUTTON */}

            <button
              className="back-btn"
              onClick={() => navigate(-1)}
            >

              <FaArrowLeft />

            </button>

            <h3>

              Report Crime

            </h3>

          </div>

          <div className="report-topbar-right">

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

            {/* PROFILE */}

            <div
              className="report-profile-section"
              onClick={() =>
                navigate("/citizen-profile")
              }
            >

              <div className="report-profile-circle">

                {getCitizenInitials(citizen)}

              </div>

            </div>

          </div>

        </div>

        {/* ================= NOTIFICATION ================= */}

        {

          showNotifications && (

            <div className="report-notification-popup">

              <h3>

                Notifications

              </h3>

              {notifications.length > 0 ? (
                notifications.map((item,index)=>(
                  <div className="report-notification-item" key={index}>
                    {item.message || item}
                  </div>
                ))
              ) : (
                <div className="report-notification-item">
                  No notifications yet
                </div>
              )}

            </div>

          )

        }

        {/* ================= CONTENT ================= */}

        <div className="report-content">

          <h1>

            Report a Crime

          </h1>

          {/* ================= STEPS ================= */}

          <div className="steps">

            <div className="step active-step">

              1

            </div>

            <p>

              Category

            </p>

            <div className="line"></div>

            <div className="step">

              2

            </div>

            <p>

              Details

            </p>

            <div className="line"></div>

            <div className="step">

              3

            </div>

            <p>

              Review

            </p>

          </div>

          <p className="choose-text">

            Select the type of complaint to report:

          </p>

          {/* ================= CARDS ================= */}

          <div className="crime-cards">

            {

              loadingCategories ? (
                <div className="crime-card">
                  <div className="crime-icon"><FaClock /></div>
                  <h3>Loading...</h3>
                </div>
              ) : crimeTypes.length === 0 ? (
                <div className="crime-card">
                  <div className="crime-icon"><FaFileAlt /></div>
                  <h3>No categories available</h3>
                </div>
              ) : crimeTypes.map((crime)=>(

                <div
                  key={crime.id}
                  className="crime-card"

                  onClick={() => {

                    if(
                      crime.name?.toLowerCase() === "other issue"
                    ){

                      setShowOtherInput(true);

                    }

                    else{

                      navigate(
                        "/report-details",
                        {
                          state:{
                            crimeType:crime.name
                          }
                        }
                      );

                    }

                  }}

                >

                  <div className="crime-icon">

                    {getCategoryIcon(crime.name)}

                  </div>

                  <h3>

                    {crime.name}

                  </h3>

                </div>

              ))

            }

          </div>

          {/* ================= OTHER ISSUE ================= */}

          {

            showOtherInput && (

              <div className="other-box">

                <input
                  type="text"
                  placeholder="Enter complaint type"

                  value={customCrime}

                  onChange={(e)=>
                    setCustomCrime(
                      e.target.value
                    )
                  }
                />

                <button

                  onClick={() => {

                    if(
                      customCrime.trim() === ""
                    ){

                      alert(
                        "Enter complaint type"
                      );

                      return;

                    }

                    navigate(
                      "/report-details",
                      {
                        state:{
                          crimeType:customCrime
                        }
                      }
                    );

                  }}

                >

                  Continue

                </button>

              </div>

            )

          }

        </div>

      </div>

      {/* ================= AI CHAT ================= */}

      <AIChat />

    </div>

  );

};

export default ReportCrime;
