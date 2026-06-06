import React,
{
  useState,
  useEffect
}
from "react";

import { useNavigate }
from "react-router-dom";

import "./ManageOfficers.css";

import AIChat from "./AIChat";
import AdminNotificationBell from "./AdminNotificationBell";

import {

  FaShieldAlt,
  FaUsers,
  FaUserShield,
  FaClipboardList,
  FaChartBar,
  FaSignOutAlt,
  FaArrowLeft,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaFileAlt,
  FaChartPie,

} from "react-icons/fa";
import { deleteOfficer, fetchOfficers } from "./api/officers";
import { clearAuth } from "./authStorage";

const ManageOfficers = () => {

  const navigate = useNavigate();

  const [searchTerm,setSearchTerm] =
  useState("");

  /* ================= PAGINATION ================= */

  const [currentPage,setCurrentPage] =
  useState(1);

  const officersPerPage = 3;

  /* ================= OFFICERS ================= */

  const [officers,setOfficers] = useState([]);

  useEffect(() => {
    fetchOfficers()
      .then(setOfficers)
      .catch(() => setOfficers([]));
  }, []);

  /* ================= FILTER ================= */

  const filteredOfficers =
  officers.filter((officer)=>

    officer.name
    .toLowerCase()
    .includes(
      searchTerm.toLowerCase()
    )

  );

  /* ================= PAGINATION LOGIC ================= */

  const indexOfLastOfficer =
  currentPage * officersPerPage;

  const indexOfFirstOfficer =
  indexOfLastOfficer - officersPerPage;

  const currentOfficers =
  filteredOfficers.slice(

    indexOfFirstOfficer,
    indexOfLastOfficer

  );

  const totalPages =
  Math.ceil(

    filteredOfficers.length /
    officersPerPage

  );

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {

    const confirmDelete =
    await window.__reportItShowConfirm(
      "Delete this officer?"
    );

    if(confirmDelete){
      try {
        await deleteOfficer(id);
        setOfficers(await fetchOfficers());
        alert("Officer deleted!");
      } catch (err) {
        alert(err.message || "Failed to delete officer");
      }
    }

  };

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {

    const confirmLogout =
    await window.__reportItShowConfirm(
      "Logout?"
    );

    if(confirmLogout){

      navigate("/");

    }

  };

  return (

    <div className="manage-container">

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
              onClick={() =>
                navigate(-1)
              }
            >

              <FaArrowLeft />

            </button>

            <h3>

              Welcome back,
              Admin !

            </h3>

          </div>

          <div className="topbar-right">
            <AdminNotificationBell />

            <div
              className="profile-circle"
              onClick={() =>
                navigate("/admin-profile")
              }
            >

              AD

            </div>

          </div>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="manage-content">

          {/* HEADER */}

          <div className="content-header">

            <h1>

              Manage Officers

            </h1>

            <button
              className="add-btn"
              onClick={() =>
                navigate("/add-officer")
              }
            >

              <FaPlus />

              Add Officer

            </button>

          </div>

          {/* SEARCH */}

          <div className="search-box">

            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search officers..."
              value={searchTerm}
              onChange={(e)=>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>

          {/* TABLE */}

          <div className="officers-table">

            {/* HEADER */}

            <div className="officers-table-header">

              <p>Officer</p>
              <p>Badge</p>
              <p>Zone</p>
              <p>Active / Resolved</p>
              <p>Status</p>
              <p>Actions</p>

            </div>

            {/* ROWS */}

            {

              currentOfficers.map(
                (officer)=>(

                  <div
                    className="officers-table-row"
                    key={officer.id}
                  >

                    {/* OFFICER */}

                    <div
                      className="officer-cell"
                      onClick={() =>
                        navigate(
                          `/officer-details/${officer.id}`
                        )
                      }
                    >

                      <div className="officer-avatar">

                        {officer.initials}

                      </div>

                      <div className="officer-info">

                        <h4>

                          {officer.name}

                        </h4>

                        <p>

                          {officer.email}

                        </p>

                      </div>

                    </div>

                    {/* BADGE */}

                    <p className="badge-text">

                      {officer.badge}

                    </p>

                    {/* ZONE */}

                    <p className="zone-text">

                      {officer.zone}

                    </p>

                    {/* ACTIVE */}

                    <p className="active-count">

                      {officer.active}

                    </p>

                    {/* STATUS */}

                    <span

                      className={

                        officer.status === "Active"

                        ? "active-badge"

                        : "inactive-badge"

                      }

                    >

                      {officer.status}

                    </span>

                    {/* ACTIONS */}

                    <div className="action-icons">

                      <FaEdit
                        className="edit-icon"
                        onClick={() =>
                          navigate(
                            "/edit-officer",
                            {
                              state: officer
                            }
                          )
                        }
                      />

                      <FaTrash
                        className="delete-icon"
                        onClick={() =>
                          handleDelete(
                            officer.id
                          )
                        }
                      />

                    </div>

                  </div>

                )
              )

            }

          </div>

          {/* ================= PAGINATION ================= */}

          <div className="pagination">

            <button

              disabled={
                currentPage === 1
              }

              onClick={() =>
                setCurrentPage(
                  currentPage - 1
                )
              }

            >

              Prev

            </button>

            {

              [...Array(totalPages)].map(
                (_,index)=>(

                  <button

                    key={index}

                    className={
                      currentPage === index + 1
                      ? "active-page"
                      : ""
                    }

                    onClick={() =>
                      setCurrentPage(
                        index + 1
                      )
                    }

                  >

                    {index + 1}

                  </button>

                )
              )

            }

            <button

              disabled={
                currentPage === totalPages
              }

              onClick={() =>
                setCurrentPage(
                  currentPage + 1
                )
              }

            >

              Next

            </button>

          </div>

        </div>

      </div>

      {/* ================= AI CHAT ================= */}

      <AIChat />

    </div>

  );

};

export default ManageOfficers;
