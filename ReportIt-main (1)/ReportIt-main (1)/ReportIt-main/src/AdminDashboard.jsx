import React, { useEffect, useState } from "react";
import { clearAuth } from "./authStorage";
import { useComplaints } from "./hooks/useComplaints";
import { fetchAllComplaints } from "./api/complaints";
import { fetchOfficers } from "./api/officers";
import { fetchCitizens } from "./api/users";
import { fetchAdminStats } from "./api/dashboard";
import { useRequireAuth } from "./hooks/useRequireAuth";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import AIChat from "./AIChat";
import AdminNotificationBell from "./AdminNotificationBell";
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
  const { complaints, stats: localComplaintStats } = useComplaints(fetchAllComplaints);
  const recentReports = complaints.slice(0, 4);
  const [officers, setOfficers] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);

  useEffect(() => {
    fetchOfficers().then(setOfficers).catch(() => setOfficers([]));
    fetchCitizens().then(setRegisteredUsers).catch(() => setRegisteredUsers([]));
    fetchAdminStats().then(setDashboardStats).catch(() => setDashboardStats(null));
  }, []);

  const activeOfficers =
    officers.filter((officer) => officer.status === "Active").length;

  const statValues = {
    total: dashboardStats?.totalComplaints ?? localComplaintStats.total,
    activeOfficers: dashboardStats?.totalOfficers ?? activeOfficers,
    registeredUsers: dashboardStats?.totalCitizens ?? registeredUsers.length,
    resolutionRate: dashboardStats?.resolutionRate ?? localComplaintStats.resolutionRate,
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "OF";

  const handleLogout = async () => {
    if(await window.__reportItShowConfirm("Are you sure you want to logout?")){
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
            <AdminNotificationBell />
            <div
              className="profile-circle"
              onClick={() => navigate("/admin-profile")}
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
              <h2>{statValues.total}</h2>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <p>ACTIVE OFFICERS</p>
                <FaUserShield className="cyan" />
              </div>
              <h2>{statValues.activeOfficers}</h2>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <p>REGISTERED USERS</p>
                <FaUsers className="green" />
              </div>
              <h2>{statValues.registeredUsers}</h2>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <p>RESOLUTION RATE</p>
                <FaChartBar className="yellow" />
              </div>
              <h2>{statValues.resolutionRate}%</h2>
            </div>

          </div>

          {/* ================= BOTTOM GRID ================= */}

          <div className="bottom-grid">

            {/* RECENT COMPLAINTS */}
            <div className="dashboard-box officers-box">

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

              {officers.length === 0 && (
                <p style={{ padding: "1rem", color: "#64748b" }}>
                  No officers added yet.
                </p>
              )}

              {officers.slice(0, 4).map((o) => (
                <div className="officer-item" key={o.userId || o.id || o.email}>
                  <div className="officer-left">
                    <div className="officer-avatar">{o.initials || getInitials(o.name)}</div>
                    <div className="officer-info">
                      <div className="officer-name-line">
                        <h4>{o.name || "Officer"}</h4>
                        <span>{o.position || "Officer"}</span>
                      </div>
                      <div className="officer-meta">
                        <span>{o.zone || "Zone not assigned"}</span>
                        {o.badge && <span>{o.badge}</span>}
                      </div>
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

      <AIChat />

    </div>

  );

};

export default AdminDashboard;
