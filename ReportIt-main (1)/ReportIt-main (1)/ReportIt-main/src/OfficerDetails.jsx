import React, { useEffect, useState } from "react";
import { fetchOfficers, updateOfficer } from "./api/officers";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import "./OfficerDetails.css";

import AIChat from "./AIChat";

import {

  FaShieldAlt,
  FaUsers,
  FaUserShield,
  FaClipboardList,
  FaChartBar,
  FaSignOutAlt,
  FaArrowLeft,
  FaFileAlt,
  FaEdit,
  FaSave,

} from "react-icons/fa";

const OfficerDetails = () => {

  const navigate = useNavigate();

  const { id } = useParams();

  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOfficers()
      .then(setOfficers)
      .catch(() => setOfficers([]))
      .finally(() => setLoading(false));
  }, []);

  const selectedOfficer =
    officers.find(
      (officer) =>
        officer.id === Number(id)
    );

  const [isEditing,setIsEditing] =
  useState(false);

  const [officer,setOfficer] =
  useState({});

  useEffect(() => {
    if (selectedOfficer) {
      setOfficer(selectedOfficer);
    }
  }, [selectedOfficer]);

  if (loading) {
    return <h1 style={{ color: "white", padding: "50px" }}>Loading...</h1>;
  }

  if(!selectedOfficer){

    return(

      <h1
        style={{
          color:"white",
          padding:"50px",
        }}
      >

        Officer Not Found

      </h1>

    );

  }

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {

    setOfficer({

      ...officer,

      [e.target.name]:
      e.target.value,

    });

  };

  /* ================= SAVE ================= */

  const handleSave = async () => {

    try {
      await updateOfficer(officer.id, officer);
      alert("Officer Updated Successfully!");
      setIsEditing(false);
      const refreshed = await fetchOfficers();
      setOfficers(refreshed);
    } catch (err) {
      alert(err.message || "Failed to update officer");
    }

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

    <div className="details-page">

      {/* ================= SIDEBAR ================= */}

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

            <li
              className="active-menu"
              onClick={() =>
                navigate("/manage-officers")
              }
            >

              <FaUserShield />

              Manage Officers

            </li>

            <li>

              <FaFileAlt />

              Categories

            </li>

            <li>

              <FaChartBar />

              Reports

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

      {/* ================= MAIN CONTENT ================= */}

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

              Officer Details

            </h3>

          </div>

          <div className="profile-circle">

            AD

          </div>

        </div>

        {/* ================= DETAILS CONTENT ================= */}

        <div className="details-content">

          {/* ================= PROFILE CARD ================= */}

          <div className="profile-card">

            <div className="profile-avatar">

              {officer.initials}

            </div>

            <h1>

              {officer.name}

            </h1>

            <p>

              {officer.email}

            </p>

            {/* ================= BUTTONS ================= */}

            <div className="profile-actions">

              {/* EDIT */}

              <button
                className="edit-btn"
                onClick={() =>
                  setIsEditing(true)
                }
              >

                <FaEdit />

                Edit

              </button>

              {/* SAVE */}

              <button
                className="save-btn"
                onClick={handleSave}
              >

                <FaSave />

                Save Changes

              </button>

            </div>

          </div>

          {/* ================= DETAILS GRID ================= */}

          <div className="details-grid">

            {/* BADGE ID */}

            <div className="detail-card">

              <span>

                Badge ID

              </span>

              {

                isEditing ? (

                  <input
                    type="text"
                    name="badge"
                    value={officer.badge}
                    onChange={handleChange}
                  />

                ) : (

                  <h2>

                    {officer.badge}

                  </h2>

                )

              }

            </div>

            {/* EMAIL */}

            <div className="detail-card">

              <span>

                Email

              </span>

              {

                isEditing ? (

                  <input
                    type="email"
                    name="email"
                    value={officer.email}
                    onChange={handleChange}
                  />

                ) : (

                  <h2>

                    {officer.email}

                  </h2>

                )

              }

            </div>

            {/* AGE */}

            <div className="detail-card">

              <span>

                Login Password

              </span>

              {

                isEditing ? (

                  <input
                    type="text"
                    name="password"
                    value={officer.password || ""}
                    onChange={handleChange}
                  />

                ) : (

                  <h2>

                    {officer.password || "Not Set"}

                  </h2>

                )

              }

            </div>

            <div className="detail-card">

              <span>

                Age

              </span>

              {

                isEditing ? (

                  <input
                    type="text"
                    name="age"
                    value={officer.age || ""}
                    onChange={handleChange}
                  />

                ) : (

                  <h2>

                    {officer.age || "34"}

                  </h2>

                )

              }

            </div>

            {/* GENDER */}

            <div className="detail-card">

              <span>

                Gender

              </span>

              {

                isEditing ? (

                  <select
                    name="gender"
                    value={officer.gender || ""}
                    onChange={handleChange}
                  >

                    <option>
                      Male
                    </option>

                    <option>
                      Female
                    </option>

                  </select>

                ) : (

                  <h2>

                    {officer.gender || "Male"}

                  </h2>

                )

              }

            </div>

            {/* POSITION */}

            <div className="detail-card">

              <span>

                Position

              </span>

              {

                isEditing ? (

                  <input
                    type="text"
                    name="position"
                    value={officer.position || ""}
                    onChange={handleChange}
                  />

                ) : (

                  <h2>

                    {officer.position || "Inspector"}

                  </h2>

                )

              }

            </div>

            {/* ZONE */}

            <div className="detail-card">

              <span>

                Zone

              </span>

              {

                isEditing ? (

                  <input
                    type="text"
                    name="zone"
                    value={officer.zone}
                    onChange={handleChange}
                  />

                ) : (

                  <h2>

                    {officer.zone}

                  </h2>

                )

              }

            </div>

            {/* PHONE */}

            <div className="detail-card">

              <span>

                Phone Number

              </span>

              {

                isEditing ? (

                  <input
                    type="text"
                    name="phone"
                    value={officer.phone || ""}
                    onChange={handleChange}
                  />

                ) : (

                  <h2>

                    {

                      officer.phone ||

                      "+91 98765 55555"

                    }

                  </h2>

                )

              }

            </div>

            {/* EXPERIENCE */}

            <div className="detail-card">

              <span>

                Experience

              </span>

              {

                isEditing ? (

                  <input
                    type="text"
                    name="experience"
                    value={officer.experience || ""}
                    onChange={handleChange}
                  />

                ) : (

                  <h2>

                    {

                      officer.experience ||

                      "8 Years"

                    }

                  </h2>

                )

              }

            </div>

            {/* ACTIVE / RESOLVED */}

            <div className="detail-card">

              <span>

                Active / Resolved

              </span>

              {

                isEditing ? (

                  <input
                    type="text"
                    name="active"
                    value={officer.active}
                    onChange={handleChange}
                  />

                ) : (

                  <h2>

                    {officer.active}

                  </h2>

                )

              }

            </div>

            {/* STATUS */}

            <div className="detail-card">

              <span>

                Status

              </span>

              {

                isEditing ? (

                  <select
                    name="status"
                    value={officer.status}
                    onChange={handleChange}
                  >

                    <option>
                      Active
                    </option>

                    <option>
                      Inactive
                    </option>

                  </select>

                ) : (

                  <h2>

                    {officer.status}

                  </h2>

                )

              }

            </div>

            {/* JOINED DATE */}

            <div className="detail-card">

              <span>

                Joined Date

              </span>

              {

                isEditing ? (

                  <input
                    type="text"
                    name="joined"
                    value={officer.joined || ""}
                    onChange={handleChange}
                  />

                ) : (

                  <h2>

                    {

                      officer.joined ||

                      "12 Jan 2021"

                    }

                  </h2>

                )

              }

            </div>

            {/* ASSIGNED CASES */}

            <div className="detail-card">

              <span>

                Assigned Cases

              </span>

              {

                isEditing ? (

                  <input
                    type="text"
                    name="cases"
                    value={officer.cases || ""}
                    onChange={handleChange}
                  />

                ) : (

                  <h2>

                    {

                      officer.cases ||

                      "14 Cases"

                    }

                  </h2>

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

export default OfficerDetails;
