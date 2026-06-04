import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import "./OfficerProfile.css";

import AIChat from "./AIChat";
import {
  getCurrentOfficer,
  getOfficerEmailInitial,
  getOfficerPosition,
  getOfficerWelcomeText,
} from "./officerSession";
import { fetchAddressFromCoords } from "./utils/location";
import { useMapEmbed } from "./hooks/useMapEmbed";

import {

  FaShieldAlt,
  FaFolderOpen,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
  FaBell,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaIdBadge,
  FaBuilding,
  FaClock,
  FaLocationArrow,

} from "react-icons/fa";

const OfficerProfile = () => {

  const navigate = useNavigate();
  const currentOfficer = getCurrentOfficer();

  const [showNotifications,
  setShowNotifications] =
  useState(false);

  const [isEditing,
  setIsEditing] =
  useState(false);

  /* ================= LOAD PROFILE ================= */

  const savedOfficer =

  JSON.parse(
    localStorage.getItem(
      "officerProfile"
    )
  );

  /* ================= PROFILE ================= */

  const [profile,
  setProfile] =
  useState(

    savedOfficer || {

      name:currentOfficer.name || "Rithana",

      email:currentOfficer.email || "rithana@reportit.com",

      phone:"+91 9876543210",

      badgeId:currentOfficer.badge || currentOfficer.badgeId || "IR-2045",

      rank:currentOfficer.position || currentOfficer.rank || "Inspector",

      station:"Central Police Station",

      department:"Crime Investigation Unit",

      experience:"8 Years",

      zone:currentOfficer.zone || "Zone A",

      shift:"Morning Shift",

      address:"Chennai, Tamil Nadu",

      mapQuery:"13.0827,80.2707",

      emergency:"+91 9876500000",

    }

  );

  const mapSrc = useMapEmbed(profile.mapQuery, profile.address);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {

    setProfile({

      ...profile,

      [e.target.name]:
      e.target.value,

    });

  };

  /* ================= GET LOCATION ================= */

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const placeName = await fetchAddressFromCoords(latitude, longitude);
        const mapQuery = `${latitude},${longitude}`;
        setProfile((prev) => ({
          ...prev,
          address: placeName,
          mapQuery,
        }));
      },
      () => alert("Unable to fetch location")
    );
  };

  /* ================= SAVE ================= */

  const handleSave = () => {

    localStorage.setItem(

      "officerProfile",

      JSON.stringify(profile)

    );

    alert(
      "Profile Updated Successfully!"
    );

    setIsEditing(false);

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

    <div className="profile-container">

      {/* ================= SIDEBAR ================= */}

      <div className="sidebar">

        <div className="sidebar-top">

          {/* LOGO */}

          <div className="sidebar-logo">

            <FaShieldAlt className="logo-icon" />

            <span>Report<span className="highlight">It</span></span>

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

            <li
              onClick={() =>
                navigate("/assigned-cases")
              }
            >

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

            <li className="active-menu">

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

            {/* NEW BACK BUTTON */}

            <button
              className="back-btn"

              onClick={() =>
                navigate(-1)
              }
            >

              <FaArrowLeft />

            </button>

            <h3>

              {getOfficerWelcomeText(currentOfficer)}

            </h3>

          </div>

          {/* RIGHT */}

          <div className="topbar-right">

            {/* NOTIFICATION */}

            <div
              className="profile-notification-box"

              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
            >

              <FaBell className="profile-bell-icon" />

              <span className="profile-notification-dot"></span>

            </div>

            {/* PROFILE */}

            <div className="profile-section">

              <div className="profile-circle">

                {getOfficerEmailInitial(currentOfficer)}

              </div>

            </div>

          </div>

        </div>

        {/* ================= NOTIFICATION POPUP ================= */}

        {

          showNotifications && (

            <div className="profile-notification-popup">

              <div className="profile-notification-header">

                <h3>

                  Notifications

                </h3>

                <span>

                  3 New

                </span>

              </div>

              {/* CARD */}

              <div className="profile-notification-card">

                <div className="profile-notification-left blue-bg">

                  🚔

                </div>

                <div>

                  <h4>

                    New Case Assigned

                  </h4>

                  <p>

                    CMP-2024-011 assigned
                    to your team.

                  </p>

                </div>

              </div>

              {/* CARD */}

              <div className="profile-notification-card">

                <div className="profile-notification-left yellow-bg">

                  📌

                </div>

                <div>

                  <h4>

                    Priority Updated

                  </h4>

                  <p>

                    CMP-2024-007 marked
                    high priority.

                  </p>

                </div>

              </div>

              {/* CARD */}

              <div className="profile-notification-card">

                <div className="profile-notification-left green-bg">

                  ✅

                </div>

                <div>

                  <h4>

                    Complaint Resolved

                  </h4>

                  <p>

                    CMP-2024-002 resolved
                    successfully.

                  </p>

                </div>

              </div>

            </div>

          )

        }

        {/* ================= CONTENT ================= */}

        <div className="profile-content">

          <h1>

            Inspector Profile

          </h1>

          <div className="profile-card">

            {/* HEADER */}

            <div className="profile-header">

              <div className="big-profile-circle">

                {getOfficerEmailInitial(currentOfficer)}

              </div>

              <div>

                <h2>

                  {profile.name}

                </h2>

                <p>

                  {profile.rank || getOfficerPosition(currentOfficer)}
                  ·
                  {profile.station}

                </p>

              </div>

            </div>

            {/* FORM */}

            <div className="profile-form-grid">

              {

                [

                  {
                    label:"Full Name",
                    icon:<FaUser />,
                    name:"name",
                  },

                  {
                    label:"Official Email",
                    icon:<FaEnvelope />,
                    name:"email",
                  },

                  {
                    label:"Phone Number",
                    icon:<FaPhoneAlt />,
                    name:"phone",
                  },

                  {
                    label:"Badge ID",
                    icon:<FaIdBadge />,
                    name:"badgeId",
                  },

                  {
                    label:"Rank / Position",
                    icon:<FaUser />,
                    name:"rank",
                  },

                  {
                    label:"Police Station",
                    icon:<FaBuilding />,
                    name:"station",
                  },

                  {
                    label:"Department",
                    icon:<FaShieldAlt />,
                    name:"department",
                  },

                  {
                    label:"Years of Service",
                    icon:<FaClock />,
                    name:"experience",
                  },

                  {
                    label:"Assigned Zone",
                    icon:<FaMapMarkerAlt />,
                    name:"zone",
                  },

                  {
                    label:"Shift Timing",
                    icon:<FaClock />,
                    name:"shift",
                  },

                  {
                    customLocation:true
                  },

                  {
                    label:"Emergency Contact",
                    icon:<FaPhoneAlt />,
                    name:"emergency",
                  },

                ].map((item,index)=>(

                  item.customLocation

                  ?

                  (

                    <div
                      className="form-group full-width"
                      key={index}
                    >

                      <label>

                        Current Location

                      </label>

                      <div className="location-row">

                        <div className="input-box">

                          <div className="input-icon">

                            <FaMapMarkerAlt />

                          </div>

                          <input
                            type="text"
                            name="address"
                            value={profile.address}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />

                        </div>

                        <button
                          type="button"
                          className="track-btn"
                          onClick={getCurrentLocation}
                        >

                          <FaLocationArrow />

                          Track Location

                        </button>

                      </div>

                      <iframe

                        title="Officer Map"

                        className="profile-map"

                        src={mapSrc}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"

                      ></iframe>

                    </div>

                  )

                  :

                  (

                    <div
                      className="form-group"
                      key={index}
                    >

                      <label>

                        {item.label}

                      </label>

                      <div className="input-box">

                        <div className="input-icon">

                          {item.icon}

                        </div>

                        <input
                          type="text"
                          name={item.name}
                          value={profile[item.name]}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />

                      </div>

                    </div>

                  )

                ))

              }

            </div>

            {/* BUTTON */}

            <div className="profile-buttons">

              {

                !isEditing ? (

                  <button
                    className="save-btn"
                    onClick={() =>
                      setIsEditing(true)
                    }
                  >

                    Edit Profile

                  </button>

                ) : (

                  <button
                    className="save-btn"
                    onClick={handleSave}
                  >

                    Save Changes

                  </button>

                )

              }

            </div>

          </div>

        </div>

      </div>

      {/* ================= AI CHAT ================= */}

      <AIChat />

    </div>

  );

};

export default OfficerProfile;
