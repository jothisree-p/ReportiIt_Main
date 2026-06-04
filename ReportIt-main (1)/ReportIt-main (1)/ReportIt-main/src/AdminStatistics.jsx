import React,
{
  useRef
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

import jsPDF from "jspdf";

import html2canvas from "html2canvas";

import "./AdminStatistics.css";

import AIChat from "./AIChat";
import { useComplaints } from "./hooks/useComplaints";
import { fetchAllComplaints } from "./api/complaints";

const AdminStatistics = () => {

  const navigate = useNavigate();

  const pdfRef = useRef();
  const { complaints, stats: complaintStats } = useComplaints(fetchAllComplaints);

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

  /* ================= EXPORT PDF ================= */

  const handleExportPDF = async () => {

    const element = pdfRef.current;

    const canvas =
    await html2canvas(
      element,
      {
        scale:2,
        useCORS:true,
      }
    );

    const imgData =
    canvas.toDataURL(
      "image/png"
    );

    const pdf =
    new jsPDF(
      "p",
      "mm",
      "a4"
    );

    const pdfWidth =
    pdf.internal.pageSize.getWidth();

    const pdfHeight =
    (
      canvas.height *
      pdfWidth
    ) / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      pdfHeight
    );

    pdf.save(
      "Admin_Statistics_Report.pdf"
    );

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
          ref={pdfRef}
        >

          <h1>

            Statistics Overview

          </h1>

          {/* ================= STATS ================= */}

          <div className="statistics-stats-grid">

            <div className="statistics-card">

              <p>Total Complaints</p>

              <h2>{complaintStats.total}</h2>

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

      {/* ================= AI CHAT ================= */}

      <AIChat />

    </div>

  );

};

export default AdminStatistics;
