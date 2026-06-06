import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import "./AddOfficer.css";

import AIChat from "./AIChat";
import { createOfficer } from "./api/officers";
import { ApiError } from "./api/http";
import { clearAuth } from "./authStorage";

import {

  FaShieldAlt,
  FaUsers,
  FaUserShield,
  FaClipboardList,
  FaChartBar,
  FaSignOutAlt,
  FaArrowLeft,
  FaFileAlt,
  FaSave,

} from "react-icons/fa";

const AddOfficer = () => {

  const navigate = useNavigate();

  const [formData,setFormData] =
  useState({

    initials:"",
    name:"",
    email:"",
    phone:"",
    password:"",
    badge:"",
    position:"",
    zone:"",
    active:"",
    status:"Active",

  });

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value,

    });

  };

  /* ================= SAVE ================= */

  const buildInitials = (name) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  const [saving, setSaving] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const handleSave = async (e) => {
    e?.preventDefault?.();

    const payload = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      password: formData.password.trim(),
      badge: formData.badge.trim(),
      position: formData.position.trim(),
      zone: formData.zone.trim(),
      active: formData.active.trim(),
      initials: formData.initials.trim().toUpperCase() || buildInitials(formData.name),
    };

    setFormMessage("");

    if(!payload.name || !payload.email || !payload.password || !payload.badge || !payload.position || !payload.zone){
      setFormMessage("Please fill officer name, email, password, badge ID, position, and zone.");
      return;
    }

    if(!payload.email.endsWith("@reportit.com")){
      setFormMessage("Officer email must end with @reportit.com");
      return;
    }

    setSaving(true);
    try {
      await createOfficer(payload);
      alert("Officer Added Successfully!");
      navigate("/manage-officers");
    } catch (err) {
      setFormMessage(err instanceof ApiError ? err.message : "Failed to add officer");
    } finally {
      setSaving(false);
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

    <div className="dashboard-container">

      {/* SIDEBAR */}

      <div className="sidebar">

        <div className="sidebar-top">

          <div className="sidebar-logo">

            <FaShieldAlt className="logo-icon" />

            <span>Report<span className="highlight">It</span></span>

          </div>

          <p className="panel-text">
            ADMIN PANEL
          </p>

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

            <li className="active-menu">

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

      {/* MAIN */}

      <div className="main-content">

        {/* TOPBAR */}

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

              Add New Officer

            </h3>

          </div>

          <div className="profile-circle">

            AD

          </div>

        </div>

        {/* CONTENT */}

        <div className="add-content">

          <form className="add-card" onSubmit={handleSave}>

            <h1>

              Add Officer

            </h1>

            {formMessage && (
              <div className="add-officer-message">
                {formMessage}
              </div>
            )}

            {/* INITIALS */}

            <div className="form-group">

              <label>
                Initials
              </label>

              <input
                type="text"
                name="initials"
                placeholder="Eg: RK"
                value={formData.initials}
                onChange={handleChange}
              />

            </div>

            {/* NAME */}

            <div className="form-group">

              <label>
                Officer Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

            </div>

            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

            </div>

            {/* PHONE */}

            <div className="form-group">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />

            </div>

            {/* PASSWORD */}

            <div className="form-group">

              <label>
                Login Password
              </label>

              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />

            </div>

            {/* BADGE */}

            <div className="form-group">

              <label>
                Badge ID
              </label>

              <input
                type="text"
                name="badge"
                value={formData.badge}
                onChange={handleChange}
              />

            </div>

            {/* POSITION */}

            <div className="form-group">

              <label>
                Position
              </label>

              <input
                type="text"
                name="position"
                placeholder="Eg: Inspector"
                value={formData.position}
                onChange={handleChange}
              />

            </div>

            {/* ZONE */}

            <div className="form-group">

              <label>
                Zone
              </label>

              <input
                type="text"
                name="zone"
                value={formData.zone}
                onChange={handleChange}
              />

            </div>

            {/* ACTIVE */}

            <div className="form-group">

              <label>
                Active / Resolved
              </label>

              <input
                type="text"
                name="active"
                value={formData.active}
                onChange={handleChange}
              />

            </div>

            {/* STATUS */}

            <div className="form-group">

              <label>
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

            {/* BUTTON */}

            <button
              className="save-btn"
              type="submit"
              disabled={saving}
            >

              <FaSave />

              {saving ? "Adding..." : "Add Officer"}

            </button>

          </form>

        </div>

      </div>

      <AIChat />

    </div>

  );

};

export default AddOfficer;
