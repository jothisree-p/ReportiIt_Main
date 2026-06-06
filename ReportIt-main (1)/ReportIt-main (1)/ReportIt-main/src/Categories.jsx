import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import "./Categories.css";

import AIChat from "./AIChat";
import AdminNotificationBell from "./AdminNotificationBell";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "./api/categories";

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

  const [categories,setCategories] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => alert(err.message || "Failed to load categories"))
      .finally(() => setLoading(false));
  }, []);

  /* ================= ADD CATEGORY ================= */

  const handleAddCategory = async () => {

    if(categoryInput.trim() === ""){

      alert("Enter category name");

      return;

    }

    try {
      if(editId !== null){
        const updated = await updateCategory(editId, categoryInput);
        setCategories((items) =>
          items.map((item) => item.id === editId ? updated : item)
        );
        setEditId(null);
        alert("Category Updated!");
      } else {
        const created = await createCategory(categoryInput);
        setCategories((items) => [...items, created]);
        alert("Category Added!");
      }
      setCategoryInput("");
    } catch (err) {
      alert(err.message || "Failed to save category");
    }

  };

  /* ================= EDIT ================= */

  const handleEdit = (category) => {

    setCategoryInput(category.name);

    setEditId(category.id);

  };

  /* ================= DELETE ================= */

  const handleDelete = async (category) => {

    const confirmDelete =
    await window.__reportItShowConfirm(
      "Delete this category?"
    );

    if(confirmDelete){
      try {
        await deleteCategory(category.id);
        setCategories((items) => items.filter((item) => item.id !== category.id));
        alert("Category Deleted!");
      } catch (err) {
        alert(err.message || "Failed to delete category");
      }

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

          <div className="topbar-right">
            <AdminNotificationBell />

            <div
              className="profile-circle"
              onClick={() => navigate("/admin-profile")}
              style={{ cursor:"pointer" }}
            >
              AD
            </div>
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

              loading ? (
                <div className="table-row">
                  <h4>Loading categories...</h4>
                  <div></div>
                </div>
              ) : categories.length === 0 ? (
                <div className="table-row">
                  <h4>No categories added yet.</h4>
                  <div></div>
                </div>
              ) : categories.map((item)=>(

                <div
                  className="table-row"
                  key={item.id}
                >

                  <h4>

                    {item.name}

                  </h4>

                  <div className="action-icons">

                    <FaEdit
                      className="edit-icon"
                      onClick={() =>
                        handleEdit(item)
                      }
                    />

                    <FaTrash
                      className="delete-icon"
                      onClick={() =>
                        handleDelete(item)
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
