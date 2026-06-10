import React, { useEffect, useState } from "react";

import {
  FaShieldAlt,
  FaFolderOpen,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
  FaArrowLeft,
  FaDownload,
  FaBell,
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

import { useNavigate } from "react-router-dom";

import "./OfficerStatistics.css";

import AIChat from "./AIChat";
import {
  getCurrentOfficer,
  getOfficerInitials,
  getOfficerWelcomeText,
} from "./officerSession";
import { useComplaints } from "./hooks/useComplaints";
import { fetchAssignedComplaints } from "./api/complaints";
import { fetchMyNotifications } from "./api/notifications";
import NotificationSeeMore from "./NotificationSeeMore";
import { openNotifications } from "./notificationActions";
import { fetchOfficerAnalytics } from "./api/dashboard";
import { exportStatisticsPdf } from "./utils/statisticsPdf";

const OfficerStatistics = () => {

  const navigate = useNavigate();
  const officer = getCurrentOfficer();

  const [showNotifications,
  setShowNotifications] =
  useState(false);
  const [notifications, setNotifications] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsError, setAnalyticsError] = useState("");
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  /* ================= GET CASES ================= */

  const { complaints: officerCases, stats: caseStats } = useComplaints(fetchAssignedComplaints);

  useEffect(() => {
    fetchMyNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]));

    fetchOfficerAnalytics()
      .then((data) => {
        setAnalytics(data);
        setAnalyticsError("");
      })
      .catch((err) => setAnalyticsError(err.message || "Failed to load analytics"))
      .finally(() => setAnalyticsLoading(false));
  }, []);

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

  /* ================= EXPORT PDF ================= */

  const handleExportPDF = async () => {
    let latestAnalytics = analytics;
    try {
      latestAnalytics = await fetchOfficerAnalytics();
      setAnalytics(latestAnalytics);
      setAnalyticsError("");
    } catch (err) {
      alert(err.message || "Unable to fetch latest analytics for PDF.");
      return;
    }

    const latestStats = latestAnalytics?.stats || {};
    const totalCases = latestStats.totalComplaints ?? latestStats.total ?? caseStats.total ?? 0;
    const resolved = latestStats.resolved ?? caseStats.resolved ?? 0;
    const pending = latestStats.pending ?? caseStats.pending ?? Math.max(totalCases - resolved, 0);
    const resolutionRate = latestStats.resolutionRate ?? caseStats.resolutionRate ?? (totalCases > 0 ? Math.round((resolved * 100) / totalCases) : 0);

    exportStatisticsPdf({
      reportTitle: "Officer Statistical Report",
      generatedFor: getOfficerWelcomeText(officer).replace("Welcome back, ", ""),
      fileName: "Officer_Statistical_Report.pdf",
      summary: [
        { label: "Total Cases", value: totalCases },
        { label: "Resolved Cases", value: resolved },
        { label: "Pending Cases", value: pending },
        { label: "Resolution Rate", value: `${resolutionRate}%` },
      ],
      weeklyData: latestAnalytics?.weeklyComplaintTrends || [],
      monthlyData: latestAnalytics?.monthlyComplaintTrends || [],
      categoryData: latestAnalytics?.categoryStatistics || [],
      statusData: latestAnalytics?.complaintStatusAnalytics || [],
    });
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

    <div className="statistics-container">

      {/* ================= SIDEBAR ================= */}

      <div className="statistics-sidebar">

        <div className="statistics-sidebar-top">

          <div className="statistics-sidebar-logo">

            <FaShieldAlt className="statistics-logo-icon" />

            <span>

              Report<span className="statistics-highlight">It</span>

            </span>

          </div>

          <p className="statistics-panel-text">

            OFFICER PANEL

          </p>

          <ul className="statistics-sidebar-menu">

            <li
              onClick={() =>
                navigate("/officer-dashboard")
              }
            >

              <FaFolderOpen />

              Dashboard

            </li>

            <li
              onClick={() =>
                navigate("/assigned-cases")
              }
            >

              <FaFolderOpen />

              Assigned Cases

            </li>

            <li className="statistics-active-menu">

              <FaChartBar />

              Statistics

            </li>

            <li
              onClick={() =>
                navigate("/officer-profile")
              }
            >

              <FaUser />

              Profile

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

      {/* ================= MAIN ================= */}

      <div className="statistics-main-content">

        {/* ================= TOPBAR ================= */}

        <div className="statistics-topbar">

          <div className="statistics-topbar-left">

            <button
              className="back-btn"
              onClick={() =>
                navigate(-1)
              }
            >

              <FaArrowLeft />

            </button>

            <h3>

              {getOfficerWelcomeText(officer)}

            </h3>

          </div>

          <div className="statistics-topbar-right">

            {/* NOTIFICATION */}

            {/* ================= NOTIFICATION ICON ================= */}

<div
  className="notification-btn"

  onClick={() => openNotifications(showNotifications, setShowNotifications, setNotifications)}
>

  <FaBell className="notification-bell" />

  {notifications.length > 0 && (
    <span className="notification-dot has-notifications"></span>
  )}

</div>

{/* ================= POPUP ================= */}

{

  showNotifications && (

    <div className="notification-dropdown">

      {/* HEADER */}

      <div className="notification-header">

        <h3>

          Notifications

        </h3>

        {notifications.length > 0 && (
          <span>
            {notifications.length} New
          </span>
        )}

      </div>

      {notifications.length > 0 ? (
        notifications.map((item,index)=>(
          <div className="notification-card" key={index}>
            <div>
              <h4>{item.title || "Notification"}</h4>
              <p>{item.message || item}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="notification-card">
          <div>
            <h4>No notifications yet</h4>
            <p>New updates will appear here when they are sent.</p>
          </div>
        </div>
      )}

      <NotificationSeeMore />

    </div>

  )

}

            {/* EXPORT */}

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
                navigate("/officer-profile")
              }
            >

              {getOfficerInitials(officer)}

            </div>

          </div>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="statistics-content">

          <h1>

            Statistics Overview

          </h1>

          {/* ================= STATS ================= */}

          <div className="statistics-stats-grid">

            <div className="statistics-card">

              <p>Total Cases</p>

              <h2>

                {caseStats.total}

              </h2>

            </div>

            <div className="statistics-card">

              <p>Resolved Cases</p>

              <h2>

                {caseStats.resolved}

              </h2>

            </div>

            <div className="statistics-card">

              <p>Pending Cases</p>

              <h2>

                {caseStats.pending}

              </h2>

            </div>

            <div className="statistics-card">

              <p>Resolution Rate</p>

              <h2>

                {caseStats.resolutionRate}%

              </h2>

            </div>

          </div>

          {/* ================= CHARTS ================= */}

          {analyticsLoading && (
            <p style={{ color: "#9ca3d2", padding: "1rem 0" }}>
              Loading analytics...
            </p>
          )}

          {analyticsError && (
            <p style={{ color: "#ff7b7b", padding: "1rem 0" }}>
              {analyticsError}
            </p>
          )}

          <div className="statistics-chart-grid">

            {/* WEEKLY */}

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

            {/* MONTHLY */}

            <div className="statistics-chart-box">

              <h3>

                Monthly Report (Jan-Dec)

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

      <AIChat />

    </div>

  );
};

export default OfficerStatistics;
