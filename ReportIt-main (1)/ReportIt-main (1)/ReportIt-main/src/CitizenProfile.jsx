import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import "./CitizenProfile.css";

import AIChat from "./AIChat";
import {
  getCurrentCitizen,
  getCitizenInitials,
  getCitizenName,
  getCitizenWelcomeText,
} from "./citizenSession";

import {

  FaShieldAlt,
  FaFileAlt,
  FaClock,
  FaUser,
  FaSignOutAlt,
  FaBell,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaLocationArrow,

} from "react-icons/fa";
import { fetchAddressFromCoords } from "./utils/location";
import { useMapEmbed } from "./hooks/useMapEmbed";
import { fetchMyNotifications } from "./api/notifications";
import NotificationSeeMore from "./NotificationSeeMore";
import { openNotifications } from "./notificationActions";
import { fetchMyProfile, updateMyProfile } from "./api/profiles";
import { setCurrentCitizen } from "./citizenSession";

const CitizenProfile = () => {

  const navigate = useNavigate();
  const citizen = getCurrentCitizen();
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

  /* ================= EDIT STATE ================= */

  const [isEditing,setIsEditing] =
  useState(false);
  const [loadingProfile,setLoadingProfile] =
  useState(true);

  /* ================= PROFILE DATA ================= */

  const [profile,setProfile] =
  useState({

    /* FROM SIGNUP */

    name:getCitizenName(citizen),

    email:citizen.email || "",

    /* USER FILLS LATER */

    phone:citizen.phone || "",

    age:"",

    gender:"",

    address1:"",

    address2:"",

    address:"Chennai, India",

    mapQuery:"13.0827,80.2707",

  });

  useEffect(() => {
    fetchMyProfile()
      .then((data) => {
        const nextProfile = {
          name:data.fullName || getCitizenName(citizen),
          email:data.email || citizen.email || "",
          phone:data.phone || citizen.phone || "",
          age:data.age || "",
          gender:data.gender || "",
          address1:data.addressLine1 || "",
          address2:data.addressLine2 || "",
          address:data.address || "Chennai, India",
          mapQuery:data.mapQuery || "13.0827,80.2707",
        };
        setProfile(nextProfile);
        setCurrentCitizen({
          ...citizen,
          fullName: nextProfile.name,
          email: nextProfile.email,
          phone: nextProfile.phone,
          userId: data.userId || citizen.userId,
        });
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, []);

  const mapSrc = useMapEmbed(profile.mapQuery, profile.address);

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

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {

    setProfile({

      ...profile,

      [e.target.name]:
      e.target.value,

    });

  };

  /* ================= SAVE ================= */

  const handleSave = async () => {

    try {
      const saved = await updateMyProfile({
        phone: profile.phone,
        age: profile.age,
        gender: profile.gender,
        addressLine1: profile.address1,
        addressLine2: profile.address2,
        address: profile.address,
        mapQuery: profile.mapQuery,
      });

      setCurrentCitizen({
        ...citizen,
        fullName: saved.fullName || profile.name,
        email: saved.email || profile.email,
        phone: saved.phone || profile.phone,
        userId: saved.userId || citizen.userId,
      });

      alert(
        "Profile Updated Successfully!"
      );

      setIsEditing(false);
    } catch (err) {
      alert(err.message || "Failed to update profile");
    }


  };

  return (

    <div className="profile-container citizen-profile-container">

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

            {/* DASHBOARD */}

            <li
              onClick={() =>
                navigate("/citizen-dashboard")
              }
            >

              <FaFileAlt />

              Dashboard

            </li>

            {/* REPORT CRIME */}

            <li
              onClick={() =>
                navigate("/report-crime")
              }
            >

              <FaFileAlt />

              Report Crime

            </li>

            {/* MY COMPLAINTS */}

            <li
              onClick={() =>
                navigate("/my-complaints")
              }
            >

              <FaFileAlt />

              My Complaints

            </li>

            {/* TRACK STATUS */}

            <li
              onClick={() =>
                navigate("/track-status")
              }
            >

              <FaClock />

              Track Status

            </li>

            {/* PROFILE */}

            <li className="active-menu">

              <FaUser />

              Profile

            </li>

          </ul>

        </div>

        {/* ================= LOGOUT ================= */}

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
              onClick={() => navigate(-1)}
            >

              <FaArrowLeft />

            </button>

            <h3>
              {getCitizenWelcomeText(citizen)}
            </h3>

          </div>

          <div className="topbar-right">

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

        {/* ================= PROFILE ================= */}

        <div className="profile-content">

          <h1>
            My Profile
          </h1>

          {loadingProfile && (
            <p className="profile-loading">Loading profile...</p>
          )}

          <div className="profile-card">

            {/* PROFILE HEADER */}

            <div className="profile-header">

              <div className="big-profile-circle">
                {getCitizenInitials(citizen)}
              </div>

              <div>

                <h2>
                  {profile.name}
                </h2>

                <p>
                  Citizen · Joined January 10, 2026
                </p>

              </div>

            </div>

            {/* ================= FORM GRID ================= */}

            <div className="profile-form-grid">

              {/* FULL NAME */}

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <div className="input-box">

                  <FaUser className="input-icon" />

                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    disabled
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Email
                </label>

                <div className="input-box">

                  <FaEnvelope className="input-icon" />

                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    disabled
                  />

                </div>

              </div>

              {/* PHONE */}

              <div className="form-group">

                <label>
                  Phone
                </label>

                <div className="input-box">

                  <FaPhoneAlt className="input-icon" />

                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter phone number"
                  />

                </div>

              </div>

              {/* AGE */}

              <div className="form-group">

                <label>
                  Age
                </label>

                <div className="input-box">

                  <FaUser className="input-icon" />

                  <input
                    type="number"
                    name="age"
                    value={profile.age}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter your age"
                  />

                </div>

              </div>

              {/* GENDER */}

              <div className="form-group">

                <label>
                  Gender
                </label>

                <div className="input-box">

                  <FaUser className="input-icon" />

                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="gender-select"
                  >

                    <option value="">
                      Select Gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

              </div>

              <div className="form-group">

                <label>
                  Address 1
                </label>

                <div className="input-box">

                  <FaMapMarkerAlt className="input-icon" />

                  <input
                    type="text"
                    name="address1"
                    value={profile.address1}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="House no, street"
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  Address 2
                </label>

                <div className="input-box">

                  <FaMapMarkerAlt className="input-icon" />

                  <input
                    type="text"
                    name="address2"
                    value={profile.address2}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Area, city"
                  />

                </div>

              </div>

              <div className="form-group full-width">

                <label>
                  Current Location
                </label>

                <div className="location-row">

                  <div className="input-box">

                    <FaMapMarkerAlt className="input-icon" />

                    <input
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Use Track Location or enter address"
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
                  title="Citizen location map"
                  className="profile-map"
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

              </div>

            </div>

            {/* ================= BUTTON ================= */}

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

export default CitizenProfile;
