import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import "./OfficerProfile.css";

import AIChat from "./AIChat";
import { showAppPopup } from "./appPopups";
import {
  getCurrentOfficer,
  getOfficerDisplayName,
  getOfficerInitials,
  getOfficerPosition,
  getOfficerWelcomeText,
  setCurrentOfficer,
} from "./officerSession";
import { fetchAddressFromCoords } from "./utils/location";
import { useMapEmbed } from "./hooks/useMapEmbed";
import { fetchMyNotifications } from "./api/notifications";
import { openNotifications } from "./notificationActions";
import { updateOfficer } from "./api/officers";

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
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchMyNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]));
  }, []);

  const [isEditing,
  setIsEditing] =
  useState(false);

  /* ================= LOAD PROFILE ================= */

  /* ================= PROFILE ================= */

  const emptyProfile = {

      name:getOfficerDisplayName(currentOfficer),

      email:currentOfficer.email || "",

      phone:currentOfficer.phone || "",

      badgeId:currentOfficer.badge || currentOfficer.badgeId || "",

      rank:currentOfficer.position || currentOfficer.rank || "",

      station:currentOfficer.station || "",

      department:currentOfficer.department || "",

      experience:currentOfficer.experience || "",

      zone:currentOfficer.zone || "",

      shift:currentOfficer.shift || "",

      address:currentOfficer.address || "",

      mapQuery:currentOfficer.mapQuery || currentOfficer.address || "",

      emergency:currentOfficer.emergency || "",

    };

  const [profile,
  setProfile] =
  useState({

    ...emptyProfile,
    name:getOfficerDisplayName(currentOfficer) || emptyProfile.name,
    email:currentOfficer.email || emptyProfile.email,
    badgeId:currentOfficer.badge || currentOfficer.badgeId || emptyProfile.badgeId,
    rank:currentOfficer.position || currentOfficer.rank || emptyProfile.rank,
    zone:currentOfficer.zone || emptyProfile.zone,

  });

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

  const handleSave = async () => {
    const userId = currentOfficer.userId || currentOfficer.id;
    if (!userId) {
      alert("Officer session not found. Please login again.");
      return;
    }

    try {
      const saved = await updateOfficer(userId, {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        badge: profile.badgeId,
        position: profile.rank,
        zone: profile.zone,
        status: currentOfficer.status || "Active",
        active: currentOfficer.active || currentOfficer.activeCases || "0",
        station: profile.station,
        department: profile.department,
        experience: profile.experience,
        shift: profile.shift,
        address: profile.address,
        mapQuery: profile.mapQuery,
        emergency: profile.emergency,
      });

      setCurrentOfficer({
        ...currentOfficer,
        ...saved,
        badgeId: saved.badge,
        rank: saved.position,
      });

      showAppPopup(
        "Profile Updated Successfully!"
      );

      setIsEditing(false);
    } catch (err) {
      alert(err.message || "Failed to update profile");
    }

  };

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {

    const confirmLogout =
    await window.__reportItShowConfirm(
      "Are you sure you want to logout?"
    );

    if(confirmLogout){

      navigate("/");

    }

  };

  return (

    <div className="profile-container officer-profile-container">

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

              onClick={() => openNotifications(showNotifications, setShowNotifications, setNotifications)}
            >

              <FaBell className="profile-bell-icon" />

              {notifications.length > 0 && (
                <span className="profile-notification-dot has-notifications"></span>
              )}

            </div>

            {/* PROFILE */}

            <div className="profile-section">

              <div className="profile-circle">

                {getOfficerInitials(currentOfficer)}

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

                {notifications.length > 0 && (
                  <span>
                    {notifications.length} New
                  </span>
                )}

              </div>

              {notifications.length > 0 ? (
                notifications.map((item,index)=>(
                  <div className="profile-notification-card" key={index}>
                    <div>
                      <h4>{item.title || "Notification"}</h4>
                      <p>{item.message || item}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="profile-notification-card">
                  <div>
                    <h4>No notifications yet</h4>
                    <p>New updates will appear here when they are sent.</p>
                  </div>
                </div>
              )}

            </div>

          )

        }

        {/* ================= CONTENT ================= */}

        <div className="profile-content">

          <h1>

            {profile.rank || getOfficerPosition(currentOfficer)} Profile

          </h1>

          <div className="profile-card">

            {/* HEADER */}

            <div className="profile-header">

              <div className="big-profile-circle">

                {getOfficerInitials(currentOfficer)}

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
