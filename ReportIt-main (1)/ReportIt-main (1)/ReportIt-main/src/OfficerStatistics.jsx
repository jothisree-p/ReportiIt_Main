import React, { useState } from "react";

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

import html2canvas from "html2canvas";

import jsPDF from "jspdf";

const OfficerStatistics = () => {

  const navigate = useNavigate();
  const officer = getCurrentOfficer();

  const [showNotifications,
  setShowNotifications] =
  useState(false);

  /* ================= GET CASES ================= */

  const { complaints: officerCases, stats: caseStats } = useComplaints(fetchAssignedComplaints);

  /* ================= WEEKLY DATA ================= */

  const weeklyData = [

    { day:"Mon", cases:4 },

    { day:"Tue", cases:7 },

    { day:"Wed", cases:5 },

    { day:"Thu", cases:9 },

    { day:"Fri", cases:6 },

    { day:"Sat", cases:11 },

    { day:"Sun", cases:8 },

  ];

  /* ================= MONTHLY DATA ================= */

  const monthlyData = [

    { month:"Jan", solved:35 },

    { month:"Feb", solved:48 },

    { month:"Mar", solved:52 },

    { month:"Apr", solved:41 },

    { month:"May", solved:60 },

    { month:"Jun", solved:72 },

    { month:"Jul", solved:64 },

    { month:"Aug", solved:58 },

    { month:"Sep", solved:76 },

    { month:"Oct", solved:82 },

    { month:"Nov", solved:69 },

    { month:"Dec", solved:91 },

  ];

  /* ================= EXPORT PDF ================= */

  const handleExportPDF = async () => {

    const input =
    document.querySelector(
      ".statistics-content"
    );

    const canvas =
    await html2canvas(input);

    const imgData =
    canvas.toDataURL("image/png");

    const pdf =
    new jsPDF(
      "p",
      "mm",
      "a4"
    );

    const pdfWidth =
    pdf.internal.pageSize.getWidth();

    const pdfHeight =
    (canvas.height * pdfWidth)
    / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      pdfHeight
    );

    pdf.save(
      "Officer_Statistics_Report.pdf"
    );
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

  onClick={() =>
    setShowNotifications(
      !showNotifications
    )
  }
>

  <FaBell className="notification-bell" />

  <span className="notification-dot"></span>

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

        <span>

          3 New

        </span>

      </div>

      {/* CARD 1 */}

      <div className="notification-card">

        <div className="notification-left blue-bg">

          🚔

        </div>

        <div>

          <h4>

            New Complaint Assigned

          </h4>

          <p>

            CMP-2024-011 assigned
            to your department.

          </p>

        </div>

      </div>

      {/* CARD 2 */}

      <div className="notification-card">

        <div className="notification-left yellow-bg">

          📌

        </div>

        <div>

          <h4>

            Investigation Pending

          </h4>

          <p>

            CMP-2024-007 requires
            immediate status update.

          </p>

        </div>

      </div>

      {/* CARD 3 */}

      <div className="notification-card">

        <div className="notification-left green-bg">

          ✅

        </div>

        <div>

          <h4>

            Complaint Resolved

          </h4>

          <p>

            CMP-2024-002 closed
            successfully.

          </p>

        </div>

      </div>

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
                    dataKey="solved"
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
