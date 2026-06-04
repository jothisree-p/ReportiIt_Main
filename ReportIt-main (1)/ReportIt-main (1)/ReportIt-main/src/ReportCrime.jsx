import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import "./ReportCrime.css";

import AIChat from "./AIChat";
import { useRequireAuth } from "./hooks/useRequireAuth";
import {
  getCurrentCitizen,
  getCitizenInitials,
} from "./citizenSession";

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

  /* ================= LOGOUT ================= */

  const handleLogout = () => {

    const confirmLogout =
    window.confirm(
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

  /* ================= CRIME TYPES ================= */

  const crimeTypes = [

    {
      name:"Theft",
      icon:<FaFileAlt />,
    },

    {
      name:"Street Light Issue",
      icon:<FaBolt />,
    },

    {
      name:"Property Damage",
      icon:<FaHome />,
    },

    {
      name:"Road Accident",
      icon:<FaCarCrash />,
    },

    {
      name:"Cyber Crime",
      icon:<FaLaptop />,
    },

    {
      name:"Harassment",
      icon:<FaUserShield />,
    },

    {
      name:"Other Issue",
      icon:<FaPlusCircle />,
    },

  ];

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
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
            >

              <FaBell className="notification-bell" />

              <span className="notification-dot"></span>

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

              <div className="report-notification-item">

                🚨 Crime report submitted successfully

              </div>

              <div className="report-notification-item">

                👮 Officer assigned to your complaint

              </div>

              <div className="report-notification-item">

                📌 Investigation in progress

              </div>

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

              crimeTypes.map((crime,index)=>(

                <div
                  key={index}
                  className="crime-card"

                  onClick={() => {

                    if(
                      crime.name === "Other Issue"
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

                    {crime.icon}

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
