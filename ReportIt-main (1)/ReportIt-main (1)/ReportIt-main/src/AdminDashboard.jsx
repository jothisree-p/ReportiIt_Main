import React, { useEffect, useState } from "react";
import { clearAuth } from "./authStorage";
import { useComplaints } from "./hooks/useComplaints";
import { fetchAllComplaints } from "./api/complaints";
import { fetchOfficers } from "./api/officers";
import { useRequireAuth } from "./hooks/useRequireAuth";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import AIChat from "./AIChat";
import AdminProfile from "./AdminProfile";
import {
  FaShieldAlt,
  FaUsers,
  FaUserShield,
  FaClipboardList,
  FaChartBar,
  FaChartPie,
  FaSignOutAlt,
  FaArrowLeft,
  FaFileAlt,
} from "react-icons/fa";
const AdminDashboard = () => {

  const navigate = useNavigate();
  useRequireAuth("ADMIN");
  const [showProfile, setShowProfile] = useState(false);
  const { complaints, stats: complaintStats } = useComplaints(fetchAllComplaints);
  const recentReports = complaints.slice(0, 4);
  const [officers, setOfficers] = useState([]);

  useEffect(() => {
    fetchOfficers().then(setOfficers).catch(() => setOfficers([]));
  }, []);

  const activeOfficers =
    officers.filter((officer) => officer.status === "Active").length;

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to logout?")){
      clearAuth();
      alert("Logged Out Successfully!");
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

          <p className="panel-text">Admin Panel</p>

          <ul className="sidebar-menu">

            <li className="active-menu">
              <FaClipboardList />Dashboard
            </li>

            <li onClick={() => navigate("/manage-users")}>
              <FaUsers />Manage Users
            </li>

            <li onClick={() => navigate("/manage-officers")}>
              <FaUserShield />Manage Officers
            </li>

            <li onClick={() => navigate("/categories")}>
              <FaFileAlt />Categories
            </li>

            <li onClick={() => navigate("/admin-reports")}>
              <FaChartBar />Reports
            </li>

            <li onClick={() => navigate("/admin-statistics")}>
              <FaChartPie />Statistics
            </li>

          </ul>

        </div>

        <div className="logout" onClick={handleLogout}>
          <FaSignOutAlt />Logout
        </div>

      </div>

      {/* ================= MAIN ================= */}

      <div className="main-content">

        {/* ================= TOPBAR ================= */}

        <div className="topbar">

          <div className="topbar-left">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft />
            </button>
            <h3>Welcome back, Admin !</h3>
          </div>

          <div className="topbar-right">
            <div
              className="profile-circle"
              onClick={() => setShowProfile(true)}
            >
              AD
            </div>
          </div>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="dashboard-content">

          <h1>Admin Dashboard</h1>

          {/* ================= STATS ================= */}

          <div className="stats-cards">

            <div className="stat-card">
              <div className="stat-top">
                <p>TOTAL COMPLAINTS</p>
                <FaFileAlt className="blue" />
              </div>
              <h2>{complaintStats.total}</h2>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <p>ACTIVE OFFICERS</p>
                <FaUserShield className="cyan" />
              </div>
              <h2>{activeOfficers}</h2>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <p>REGISTERED USERS</p>
                <FaUsers className="green" />
              </div>
              <h2>540</h2>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <p>RESOLUTION RATE</p>
                <FaChartBar className="yellow" />
              </div>
              <h2>{complaintStats.resolutionRate}%</h2>
            </div>

          </div>

          {/* ================= BOTTOM GRID ================= */}

          <div className="bottom-grid">

            {/* RECENT COMPLAINTS */}
            <div className="dashboard-box">

              <div className="box-header">
                <h3>Recent Complaints</h3>
                <span className="view-all" onClick={() => navigate("/admin-reports")}>
                  View all
                </span>
              </div>

              {recentReports.length === 0 && (
                <p style={{ padding: "1rem", color: "#64748b" }}>
                  No complaints filed yet.
                </p>
              )}
              {recentReports.map((report) => (
                <div className="complaint-item" key={report.id}>
                  <div className="left-complaint">
                    <div className="complaint-icon"><FaFileAlt /></div>
                    <div>
                      <h4>{report.title}</h4>
                      <p>{report.id} · {report.citizen}</p>
                    </div>
                  </div>
                  <span
                    className={
                      report.status === "Resolved"
                        ? "resolved-text"
                        : report.status === "In Progress"
                        ? "progress-text"
                        : "pending-text"
                    }
                  >
                    {report.status}
                  </span>
                </div>
              ))}

            </div>

            {/* OFFICERS */}
            <div className="dashboard-box">

              <div className="box-header">
                <h3>Officers</h3>
                <span className="view-all" onClick={() => navigate("/manage-officers")}>
                  Manage
                </span>
              </div>

              {[
                { init:"IP", name:"Inspector Patel",  zone:"Zone A · 12 active", status:"Active" },
                { init:"OV", name:"Officer Verma",    zone:"Zone B · 8 active",  status:"Active" },
                { init:"OD", name:"Officer Desai",    zone:"Zone C · 5 active",  status:"Active" },
                { init:"IK", name:"Inspector Khan",   zone:"Zone D",             status:"Inactive" },
              ].map((o,i) => (
                <div className="officer-item" key={i}>
                  <div className="officer-left">
                    <div className="officer-avatar">{o.init}</div>
                    <div className="officer-info">
                      <h4>{o.name}</h4>
                      <p>{o.zone}</p>
                    </div>
                  </div>
                  <span className={o.status === "Active" ? "active-text" : "inactive-text"}>
                    {o.status}
                  </span>
                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

      {showProfile && (
        <AdminProfile closeProfile={() => setShowProfile(false)} />
      )}

      <AIChat />

    </div>

  );

};

export default AdminDashboard;
