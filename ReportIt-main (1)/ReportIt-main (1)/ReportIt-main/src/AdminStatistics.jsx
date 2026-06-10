import React,
{
  useEffect,
  useState,
}
from "react";

import {
  FaShieldAlt,
  FaClipboardList,
  FaUsers,
  FaUserShield,
  FaChartBar,
  FaChartPie,
  FaFileAlt,
  FaSignOutAlt,
  FaArrowLeft,
  FaDownload,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

import { useNavigate }
from "react-router-dom";

import "./AdminStatistics.css";

import AIChat from "./AIChat";
import AdminNotificationBell from "./AdminNotificationBell";
import { fetchAdminAnalytics } from "./api/dashboard";
import { exportStatisticsPdf } from "./utils/statisticsPdf";

const AdminStatistics = () => {

  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminAnalytics()
      .then((data) => {
        setAnalytics(data);
        setError("");
      })
      .catch((err) => setError(err.message || "Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  const complaintStats = analytics?.stats || {
    totalComplaints: 0,
    resolved: 0,
    pending: 0,
    resolutionRate: 0,
  };

  const weeklyData = (analytics?.weeklyComplaintTrends || []).map((item) => ({
    day: item.label,
    cases: item.total,
  }));

  const monthlyData = (analytics?.monthlyComplaintTrends || []).map((item) => ({
    month: item.label,
    complaints: item.total,
    resolved: item.resolved,
    pending: item.pending,
  }));

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

  /* ================= EXPORT PDF ================= */

  const handleExportPDF = async () => {
    let latestAnalytics = analytics;
    try {
      latestAnalytics = await fetchAdminAnalytics();
      setAnalytics(latestAnalytics);
      setError("");
    } catch (err) {
      alert(err.message || "Unable to fetch latest analytics for PDF.");
      return;
    }

    const latestStats = latestAnalytics?.stats || {};
    const totalComplaints = latestStats.totalComplaints ?? latestStats.total ?? 0;
    const resolved = latestStats.resolved ?? 0;
    const pending = latestStats.pending ?? Math.max(totalComplaints - resolved, 0);
    const resolutionRate = latestStats.resolutionRate ?? (totalComplaints > 0 ? Math.round((resolved * 100) / totalComplaints) : 0);

    exportStatisticsPdf({
      reportTitle: "Admin Statistical Report",
      generatedFor: "System Admin",
      fileName: "Admin_Statistical_Report.pdf",
      summary: [
        { label: "Total Complaints", value: totalComplaints },
        { label: "Resolved Cases", value: resolved },
        { label: "Pending Cases", value: pending },
        { label: "Resolution Rate", value: `${resolutionRate}%` },
      ],
      weeklyData: latestAnalytics?.weeklyComplaintTrends || [],
      monthlyData: latestAnalytics?.monthlyComplaintTrends || [],
      categoryData: latestAnalytics?.categoryStatistics || [],
      statusData: latestAnalytics?.complaintStatusAnalytics || [],
      officerPerformanceData: latestAnalytics?.officerPerformanceStatistics || [],
    });

  };

  return (

    <div className="statistics-container">

      {/* ================= SIDEBAR ================= */}

      <div className="statistics-sidebar">

        <div className="statistics-sidebar-top">

          {/* LOGO */}

          <div className="statistics-sidebar-logo">

            <FaShieldAlt className="statistics-logo-icon" />

            <span>

              Report
              <span className="statistics-highlight">

                It

              </span>

            </span>

          </div>

          <p className="statistics-panel-text">

            ADMIN PANEL

          </p>

          {/* MENU */}

          <ul className="statistics-sidebar-menu">

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

            <li className="statistics-active-menu">

              <FaChartPie />

              Statistics

            </li>

          </ul>

        </div>

        {/* LOGOUT */}

        <div
          className="statistics-logout"
          onClick={handleLogout}
        >

          <FaSignOutAlt />

          Logout

        </div>

      </div>

      {/* ================= MAIN CONTENT ================= */}

      <div className="statistics-main-content">

        {/* ================= TOPBAR ================= */}

        <div className="statistics-topbar">

          <div className="statistics-topbar-left">

            {/* BACK BUTTON */}

            <button
              className="back-btn"
              onClick={() => navigate(-1)}
            >

              <FaArrowLeft />

            </button>

            <h3>

              Statistics Dashboard

            </h3>

          </div>

          <div className="statistics-topbar-right">

            <AdminNotificationBell />

            {/* EXPORT PDF */}

            <button
              className="statistics-export-btn"
              onClick={handleExportPDF}
            >

              <FaDownload />

              Export PDF

            </button>

            {/* PROFILE */}

            <div
              className="statistics-profile-circle"
              onClick={() =>
                navigate("/admin-profile")
              }
            >

              AD

            </div>

          </div>

        </div>

        {/* ================= CONTENT ================= */}

        <div
          className="statistics-content"
        >

          <h1>

            Statistics Overview

          </h1>

          {/* ================= STATS ================= */}

          <div className="statistics-stats-grid">

            <div className="statistics-card">

              <p>Total Complaints</p>

              <h2>{complaintStats.totalComplaints}</h2>

            </div>

            <div className="statistics-card">

              <p>Resolved Cases</p>

              <h2>{complaintStats.resolved}</h2>

            </div>

            <div className="statistics-card">

              <p>Pending Cases</p>

              <h2>{complaintStats.pending}</h2>

            </div>

            <div className="statistics-card">

              <p>Resolution Rate</p>

              <h2>{complaintStats.resolutionRate}%</h2>

            </div>

          </div>

          {/* ================= CHARTS ================= */}

          {loading && (
            <p style={{ color: "#9ca3d2", padding: "1rem 0" }}>
              Loading analytics...
            </p>
          )}

          {error && (
            <p style={{ color: "#ff7b7b", padding: "1rem 0" }}>
              {error}
            </p>
          )}

          <div className="statistics-chart-grid">

            {/* WEEKLY REPORT */}

            <div className="statistics-chart-box">

              <h3>

                Weekly Report

              </h3>

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <BarChart data={weeklyData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1d2b63"
                  />

                  <XAxis
                    dataKey="day"
                    stroke="#9ca3d2"
                  />

                  <YAxis
                    stroke="#9ca3d2"
                  />

                  <Tooltip />

                  <Bar
                    dataKey="cases"
                    fill="#00bfff"
                    radius={[8,8,0,0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

            {/* MONTHLY REPORT */}

            <div className="statistics-chart-box">

              <h3>

                Monthly Report

              </h3>

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <LineChart data={monthlyData}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1d2b63"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="#9ca3d2"
                  />

                  <YAxis
                    stroke="#9ca3d2"
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="complaints"
                    stroke="#00bfff"
                    strokeWidth={4}
                  />

                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="#00d084"
                    strokeWidth={4}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

      </div>

      {/* ================= AI CHAT ================= */}

      <AIChat />

    </div>

  );

};

export default AdminStatistics;
