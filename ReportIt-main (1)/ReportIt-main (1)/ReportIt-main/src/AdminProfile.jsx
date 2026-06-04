import React, { useState } from "react";

import "./AdminProfile.css";

import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaUserShield,
  FaEdit,
  FaLock,
  FaBell,
  FaCamera,
  FaSignOutAlt,
  FaArrowLeft,
  FaShieldAlt,
  FaUsers,
  FaClipboardList,
 FaChartBar,
FaChartPie,
FaFileAlt,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const AdminProfile = () => {

  const navigate = useNavigate();

  /* ================= STATES ================= */

  const [notifications,setNotifications] =
  useState(true);

  const [showEdit,setShowEdit] =
  useState(false);

  const [showPassword,setShowPassword] =
  useState(false);

  const [passwordData,setPasswordData] =
  useState({
    currentPassword:"",
    newPassword:"",
    confirmPassword:"",
  });

  const [profileImage,setProfileImage] =
  useState(

    localStorage.getItem(
      "adminProfileImage"
    ) || "/admin.png"

  );

  const [tempImage,setTempImage] =
  useState(null);

  const [adminData,setAdminData] =
  useState({

    name:"Admin",
    email:"admin@reportit.com",
    phone:"+91 98765 43210",
    location:"Coimbatore, India",
    department:"Crime Management",
    adminId:"ADM-2024-001",

  });

  const [editData,setEditData] =
  useState(adminData);

  /* ================= IMAGE ================= */

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if(file){

      const imageUrl =
      URL.createObjectURL(file);

      setTempImage(imageUrl);

    }

  };

  /* ================= INPUT ================= */

  const handleInputChange = (e) => {

    setEditData({

      ...editData,

      [e.target.name]:
      e.target.value,

    });

  };

  const handlePasswordChange = (e) => {

    setPasswordData({

      ...passwordData,

      [e.target.name]:
      e.target.value,

    });

  };

  const handleEditSave = () => {

    setAdminData(editData);

    setShowEdit(false);

    alert(
      "Profile updated successfully!"
    );

  };

  const handlePasswordSave = () => {

    if(passwordData.newPassword !== passwordData.confirmPassword){

      alert(
        "New password and confirm password do not match."
      );

      return;

    }

    setPasswordData({
      currentPassword:"",
      newPassword:"",
      confirmPassword:"",
    });

    setShowPassword(false);

    alert(
      "Password changed successfully!"
    );

  };

  /* ================= LOGOUT ================= */

  const handleLogout = () => {

    const confirmLogout =
    window.confirm(
      "Are you sure you want to logout?"
    );

    if(confirmLogout){

      alert(
        "Logged out successfully!"
      );

      navigate("/");

    }

  };

  return (

    <div className="dashboard-container">

      {/* ================= SIDEBAR ================= */}

      <div className="sidebar">

        <div className="sidebar-top">

          {/* LOGO */}

          <div className="sidebar-logo">

            <FaShieldAlt className="logo-icon" />

            <span>Report<span className="highlight">It</span></span>

          </div>

          <p className="panel-text">

            ADMIN PANEL

          </p>

          {/* MENU */}

          <ul className="sidebar-menu">

            <li
              onClick={() =>
                navigate("/admin-dashboard")
              }
            >

              <FaClipboardList />

              Dashboard

            </li>

            <li
              onClick={() =>
                navigate("/manage-users")
              }
            >

              <FaUsers />

              Manage Users

            </li>

            <li
              onClick={() =>
                navigate("/manage-officers")
              }
            >

              <FaUserShield />

              Manage Officers

            </li>

            <li
              onClick={() =>
                navigate("/categories")
              }
            >

              <FaFileAlt />

              Categories

            </li>

            <li
              onClick={() =>
                navigate("/admin-reports")
              }
            >

              <FaChartBar />

              Reports

            </li>

            <li
              onClick={() =>
                navigate("/admin-statistics")
              }
            >

              <FaChartPie />

              Statistics

            </li>
            {/* ACTIVE PAGE */}

            <li className="active-menu">

              <FaUserShield />

              Admin Profile

            </li>

          </ul>

        </div>

      </div>

      {/* ================= MAIN CONTENT ================= */}

      <div className="main-content">

        {/* ================= TOPBAR ================= */}

        <div className="profile-topbar">

          <div className="profile-topbar-left">

            <button
              className="back-btn"
              onClick={() => navigate(-1)}
            >

              <FaArrowLeft />

            </button>

            <h2>

              Admin Profile

            </h2>

          </div>

        </div>

        {/* ================= PROFILE ================= */}

        <div className="admin-profile-container">

          {/* TOP */}

          <div className="profile-top">

            <div className="admin-image-box">

              <img
                src={tempImage || profileImage}
                alt="admin"
                className="admin-image"
              />

              <label className="camera-btn">

                <FaCamera />

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />

              </label>

            </div>

            {

              tempImage && (

                <button
                  className="save-image-btn"
                  onClick={() => {

                    setProfileImage(tempImage);

                    localStorage.setItem(
                      "adminProfileImage",
                      tempImage
                    );

                    setTempImage(null);

                    alert(
                      "Profile image updated successfully!"
                    );

                  }}
                >

                  Save Changes

                </button>

              )

            }

            <h1>

              {adminData.name}

            </h1>

            <p className="admin-role">

              Super Admin

            </p>

          </div>

          {/* DETAILS */}

          <div className="profile-details">

            <div className="detail-card">

              <FaEnvelope className="detail-icon" />

              <div>

                <h4>Email</h4>

                <p>

                  {adminData.email}

                </p>

              </div>

            </div>

            <div className="detail-card">

              <FaPhoneAlt className="detail-icon" />

              <div>

                <h4>Phone</h4>

                <p>

                  {adminData.phone}

                </p>

              </div>

            </div>

            <div className="detail-card">

              <FaMapMarkerAlt className="detail-icon" />

              <div>

                <h4>Location</h4>

                <p>

                  {adminData.location}

                </p>

              </div>

            </div>

            <div className="detail-card">

              <FaUserShield className="detail-icon" />

              <div>

                <h4>Department</h4>

                <p>

                  {adminData.department}

                </p>

              </div>

            </div>

            <div className="detail-card">

              <FaUserShield className="detail-icon" />

              <div>

                <h4>Admin ID</h4>

                <p>

                  {adminData.adminId}

                </p>

              </div>

            </div>

          </div>

          {/* SETTINGS */}

          <div className="settings-section">

            <h2>

              Account Settings

            </h2>

            {/* NOTIFICATIONS */}

            <div className="setting-item">

              <div className="setting-left">

                <FaBell className="setting-icon" />

                <span>

                  Notifications

                </span>

              </div>

              <label className="switch">

                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() =>
                    setNotifications(
                      !notifications
                    )
                  }
                />

                <span className="slider"></span>

              </label>

            </div>

            {/* EDIT */}

            <div className="setting-item">

              <div className="setting-left">

                <FaEdit className="setting-icon" />

                <span>

                  Edit Profile

                </span>

              </div>

              <button
                className="setting-btn"
                onClick={() => {
                  setEditData(adminData);
                  setShowEdit(true);
                }}
              >

                Edit

              </button>

            </div>

            {/* PASSWORD */}

            <div className="setting-item">

              <div className="setting-left">

                <FaLock className="setting-icon" />

                <span>

                  Change Password

                </span>

              </div>

              <button
                className="setting-btn"
                onClick={() =>
                  setShowPassword(true)
                }
              >

                Change

              </button>

            </div>

          </div>

          {/* LOGOUT */}

          <button
            className="logout-profile-btn"
            onClick={handleLogout}
          >

            <FaSignOutAlt />

            Logout

          </button>

        </div>

        {

          showEdit && (

            <div className="popup-overlay">

              <div className="popup-box">

                <h2>Edit Profile</h2>

                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                />

                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                />

                <input
                  type="text"
                  name="phone"
                  value={editData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                />

                <input
                  type="text"
                  name="location"
                  value={editData.location}
                  onChange={handleInputChange}
                  placeholder="Location"
                />

                <input
                  type="text"
                  name="department"
                  value={editData.department}
                  onChange={handleInputChange}
                  placeholder="Department"
                />

                <input
                  type="text"
                  name="adminId"
                  value={editData.adminId}
                  onChange={handleInputChange}
                  placeholder="Admin ID"
                />

                <div className="popup-buttons">

                  <button
                    className="save-btn"
                    onClick={handleEditSave}
                  >
                    Save
                  </button>

                  <button
                    className="cancel-btn"
                    onClick={() => setShowEdit(false)}
                  >
                    Cancel
                  </button>

                </div>

              </div>

            </div>

          )

        }

        {

          showPassword && (

            <div className="popup-overlay">

              <div className="popup-box">

                <h2>Change Password</h2>

                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Current password"
                />

                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New password"
                />

                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                />

                <div className="popup-buttons">

                  <button
                    className="save-btn"
                    onClick={handlePasswordSave}
                  >
                    Change
                  </button>

                  <button
                    className="cancel-btn"
                    onClick={() => setShowPassword(false)}
                  >
                    Cancel
                  </button>

                </div>

              </div>

            </div>

          )

        }

      </div>

    </div>

  );

};

export default AdminProfile;
