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

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "OF";

  const detailFields = [
    { label: "Badge ID", name: "badge" },
    { label: "Email", name: "email", type: "email" },
    { label: "Phone Number", name: "phone" },
    { label: "Age", name: "age" },
    {
      label: "Gender",
      name: "gender",
      type: "select",
      options: ["Not provided", "Male", "Female", "Other"],
    },
    { label: "Position", name: "position" },
    { label: "Zone", name: "zone" },
    { label: "Police Station", name: "station" },
    { label: "Department", name: "department" },
    { label: "Experience", name: "experience" },
    { label: "Shift Timing", name: "shift" },
    { label: "Address", name: "address" },
    { label: "Emergency Contact", name: "emergency" },
    { label: "Joined Date", name: "joined" },
    { label: "Assigned Cases", name: "cases" },
    {
      label: "Status",
      name: "status",
      type: "select",
      options: ["Active", "Inactive"],
    },
  ];

  const renderValue = (value) => value || "Not provided";

  /* ================= SAVE ================= */

  const handleSave = async () => {

    try {
      const payload = {
        name: officer.name?.trim?.() || "",
        email: officer.email?.trim?.().toLowerCase?.() || "",
        phone: officer.phone?.trim?.() || "",
        badge: officer.badge?.trim?.() || "",
        position: officer.position?.trim?.() || "",
        zone: officer.zone?.trim?.() || "",
        active: officer.active?.trim?.() || "0",
        status: officer.status || "Active",
        age: officer.age?.trim?.() || "",
        gender: officer.gender === "Not provided" ? "" : officer.gender || "",
        station: officer.station?.trim?.() || "",
        department: officer.department?.trim?.() || "",
        experience: officer.experience?.trim?.() || "",
        shift: officer.shift?.trim?.() || "",
        address: officer.address?.trim?.() || "",
        mapQuery: officer.mapQuery?.trim?.() || "",
        emergency: officer.emergency?.trim?.() || "",
        joinedDate: officer.joined?.trim?.() || "",
      };

      if (!payload.password?.trim?.()) {
        delete payload.password;
      } else {
        payload.password = payload.password.trim();
      }

      await updateOfficer(officer.id, payload);
      alert("Officer Updated Successfully!");
      setIsEditing(false);
      setOfficer((current) => ({ ...current, password: "" }));
      const refreshed = await fetchOfficers();
      setOfficers(refreshed);
    } catch (err) {
      alert(err.message || "Failed to update officer");
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

              {getInitials(officer.name)}

            </div>

            <div className="officer-summary">

              <h1>

                {officer.name}

              </h1>

              <p>

                {officer.email}

              </p>

            </div>

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

                Edit Changes

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

            {detailFields.map((field) => (
              <div className="detail-card" key={field.name}>
                <span>{field.label}</span>

                {isEditing ? (
                  field.type === "select" ? (
                    <select
                      name={field.name}
                      value={officer[field.name] || field.options?.[0] || ""}
                      onChange={handleChange}
                    >
                      {field.options.map((option) => (
                        <option value={option} key={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={officer[field.name] || ""}
                      onChange={handleChange}
                    />
                  )
                ) : (
                  <h2>{renderValue(officer[field.name])}</h2>
                )}
              </div>
            ))}

            {isEditing && (
              <div className="detail-card">
                <span>Reset Login Password</span>
                <input
                  type="text"
                  name="password"
                  value={officer.password || ""}
                  placeholder="Enter new password only if changing"
                  onChange={handleChange}
                />
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ================= AI CHAT ================= */}

      <AIChat />

    </div>

  );

};

export default OfficerDetails;
