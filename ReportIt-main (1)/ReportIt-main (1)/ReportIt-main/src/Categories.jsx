import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import "./Categories.css";

import AIChat from "./AIChat";

import {

  FaShieldAlt,
  FaClipboardList,
  FaUsers,
  FaUserShield,
  FaChartBar,
  FaSignOutAlt,
  FaArrowLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaFileAlt,
  FaChartPie,

} from "react-icons/fa";

const Categories = () => {

  const navigate = useNavigate();

  /* ================= CATEGORY STATE ================= */

  const [categoryInput,setCategoryInput] =
  useState("");

  const [editId,setEditId] =
  useState(null);

  const [categories,setCategories] =
  useState(

    JSON.parse(
      localStorage.getItem("categories")
    ) ||

    [

      "Theft",
      "Street Light Issue",
      "Property Damage",
      "Road Accident",
      "Cyber Crime",
      "Harassment",
      "Other Issue",

    ]

  );

  /* ================= SAVE ================= */

  useEffect(()=>{

    localStorage.setItem(

      "categories",

      JSON.stringify(categories)

    );

  },[categories]);

  /* ================= ADD CATEGORY ================= */

  const handleAddCategory = () => {

    if(categoryInput.trim() === ""){

      alert("Enter category name");

      return;

    }

    if(editId !== null){

      const updatedCategories =
      categories.map((item,index)=>

        index === editId
        ? categoryInput
        : item

      );

      setCategories(updatedCategories);

      setEditId(null);

      alert("Category Updated!");

    }

    else{

      setCategories([

        ...categories,

        categoryInput,

      ]);

      alert("Category Added!");

    }

    setCategoryInput("");

  };

  /* ================= EDIT ================= */

  const handleEdit = (index) => {

    setCategoryInput(categories[index]);

    setEditId(index);

  };

  /* ================= DELETE ================= */

  const handleDelete = (index) => {

    const confirmDelete =
    window.confirm(
      "Delete this category?"
    );

    if(confirmDelete){

      const updated =
      categories.filter(

        (_,i)=>i !== index

      );

      setCategories(updated);

      alert("Category Deleted!");

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

    <div className="categories-container">

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

            <li className="active-menu">

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

          <div className="topbar-left">

            <button
              className="back-btn"
              onClick={() => navigate(-1)}
            >

              <FaArrowLeft />

            </button>

            <h3>

              Manage Categories

            </h3>

          </div>

          <div
  className="profile-circle"
  onClick={() => navigate("/admin-profile")}
  style={{ cursor:"pointer" }}
>
  AD
</div>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="categories-content">

          {/* INPUT */}

          <div className="category-input-box">

            <input
              type="text"
              placeholder="New category name..."
              value={categoryInput}
              onChange={(e)=>
                setCategoryInput(
                  e.target.value
                )
              }
            />

            <button
              className="add-btn"
              onClick={handleAddCategory}
            >

              <FaPlus />

              {

                editId !== null
                ? "Update"
                : "Add"

              }

            </button>

          </div>

          {/* CATEGORY TABLE */}

          <div className="categories-table">

            <div className="table-header">

              <p>Crime Categories</p>

              <p>Actions</p>

            </div>

            {

              categories.map((item,index)=>(

                <div
                  className="table-row"
                  key={index}
                >

                  <h4>

                    {item}

                  </h4>

                  <div className="action-icons">

                    <FaEdit
                      className="edit-icon"
                      onClick={() =>
                        handleEdit(index)
                      }
                    />

                    <FaTrash
                      className="delete-icon"
                      onClick={() =>
                        handleDelete(index)
                      }
                    />

                  </div>

                </div>

              ))

            }

          </div>

        </div>

      </div>

      {/* ================= AI CHAT ================= */}

      <AIChat />

    </div>

  );

};

export default Categories;