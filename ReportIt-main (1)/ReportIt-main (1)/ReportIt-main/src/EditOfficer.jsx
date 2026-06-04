import React, { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import "./EditOfficer.css";

import {

  FaArrowLeft,
  FaSave,

} from "react-icons/fa";
import { updateOfficer } from "./api/officers";

const EditOfficer = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const officer =
  location.state;

  const [formData,setFormData] =
  useState({

    name: officer?.name || "",
    email: officer?.email || "",
    password: officer?.password || "",
    badge: officer?.badge || "",
    position: officer?.position || "",
    zone: officer?.zone || "",
    active: officer?.active || "",
    status: officer?.status || "",

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

  const handleSave = async () => {

    if(!formData.email.endsWith("@reportit.com")){
      alert("Officer email must end with @reportit.com");
      return;
    }

    if(!formData.password){
      alert("Please set a password for officer login");
      return;
    }

    try {
      await updateOfficer(officer?.id || officer?.userId, formData);
      alert("Officer details updated successfully!");
      navigate("/manage-officers");
    } catch (err) {
      alert(err.message || "Failed to update officer");
    }

  };

  return (

    <div className="edit-container">

      <div className="edit-card">

        {/* TOP */}

        <div className="edit-top">

          <button
            className="back-btn"
            onClick={() =>
              navigate(-1)
            }
          >

            <FaArrowLeft />

          </button>

          <h1>

            Edit Officer

          </h1>

        </div>

        {/* FORM */}

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

        <div className="form-group">

          <label>
            Position
          </label>

          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
          />

        </div>

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

  );

};

export default EditOfficer;
