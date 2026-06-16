import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminReports.css";
import AIChat from "./AIChat";
import AdminNotificationBell from "./AdminNotificationBell";
import {
  FaShieldAlt,
  FaClipboardList,
  FaUsers,
  FaUserShield,
  FaChartBar,
  FaSignOutAlt,
  FaArrowLeft,
  FaFileAlt,
  FaChartPie,
} from "react-icons/fa";
import { assignComplaint } from "./complaintsData";
import { useComplaints } from "./hooks/useComplaints";
import { useRequireAuth } from "./hooks/useRequireAuth";
import { fetchAllComplaints } from "./api/complaints";
import { feedbackListByComplaintId, fetchAdminFeedback } from "./api/feedback";
import { fetchOfficers } from "./api/officers";
import { clearAuth, getAccessToken } from "./authStorage";

const statusClass = (status) => {
  if (status === "In Progress") return "progress-badge";
  if (status === "Resolved") return "resolved-badge";
  if (status === "Rejected") return "rejected-badge";
  return "pending-badge";
};

const AdminReports = () => {
  const navigate = useNavigate();
  useRequireAuth("ADMIN");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;
  const [officers, setOfficers] = useState([]);
  const [officersError, setOfficersError] = useState(null);
  const [assigningId, setAssigningId] = useState(null);
  const [feedbackByComplaint, setFeedbackByComplaint] = useState({});
  const { complaints, loading, error, refresh } = useComplaints(fetchAllComplaints);

  useEffect(() => {
    fetchOfficers()
      .then((data) => {
        setOfficers(data);
        setOfficersError(null);
      })
      .catch((err) => {
        setOfficers([]);
        setOfficersError(err.message || "Could not load officers");
      });
  }, []);

  useEffect(() => {
    fetchAdminFeedback()
      .then((items) => setFeedbackByComplaint(feedbackListByComplaintId(items)))
      .catch(() => setFeedbackByComplaint({}));
  }, []);

  const indexOfLast = currentPage * reportsPerPage;
  const indexOfFirst = indexOfLast - reportsPerPage;
  const currentReports = complaints.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(complaints.length / reportsPerPage) || 1;

  const handleAssign = async (complaintCode, officerUserId) => {
    if (!officerUserId) return;

    const selectedOfficer = officers.find(
      (officer) => String(officer.userId || officer.id) === String(officerUserId)
    );
    if (!selectedOfficer) {
      alert("Select a valid officer");
      return;
    }

    setAssigningId(complaintCode);
    try {
      await assignComplaint(complaintCode, selectedOfficer);
      await refresh();
      alert(`Assigned to ${selectedOfficer.name}. Status is now In Progress.`);
    } catch (err) {
      alert(err.message || "Failed to assign officer");
    } finally {
      setAssigningId(null);
    }
  };

  const handleLogout = async () => {
    if (await window.__reportItShowConfirm("Are you sure you want to logout?")) {
      clearAuth();
      navigate("/");
    }
  };

  const isNetworkError = Boolean(error?.includes("Cannot reach backend"));
  const isAuthError = Boolean(
    error?.includes("log in") || error?.includes("Unauthorized")
  );

  return (
    <div className="reports-container">
      <div className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <FaShieldAlt className="logo-icon" />
            <span>
              Report<span className="highlight">It</span>
            </span>
          </div>

          <p className="panel-text">ADMIN PANEL</p>

          <ul className="sidebar-menu">
            <li onClick={() => navigate("/admin-dashboard")}>
              <FaClipboardList /> Dashboard
            </li>
            <li onClick={() => navigate("/manage-users")}>
              <FaUsers /> Manage Users
            </li>
            <li onClick={() => navigate("/manage-officers")}>
              <FaUserShield /> Manage Officers
            </li>
            <li onClick={() => navigate("/categories")}>
              <FaFileAlt /> Categories
            </li>
            <li className="active-menu">
              <FaChartBar /> Reports
            </li>
            <li onClick={() => navigate("/admin-statistics")}>
              <FaChartPie /> Statistics
            </li>
          </ul>
        </div>

        <div className="logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </div>
      </div>

      <div className="reports-main">
        <div className="topbar reports-topbar">
          <div className="topbar-left">
            <button className="back-btn" type="button" onClick={() => navigate(-1)}>
              <FaArrowLeft />
            </button>

            <h3>Complaint Reports</h3>
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

        <div className="reports-header">
          <h1>Complaint Reports</h1>
          <div className="reports-header-meta">
            <span>
              {complaints.length} total report{complaints.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {loading && (
          <p className="reports-message loading">Loading reports from server…</p>
        )}
        {error && (
          <p className="reports-message error">
            {error}
            {isNetworkError && (
              <>
                {" "}
                Postman can work while the browser fails if Spring Boot is stopped or .env
                bypasses the Vite proxy — use VITE_USE_PROXY=true and run both services.
              </>
            )}
            {isAuthError && !getAccessToken() && " Open Admin Login first."}
          </p>
        )}
        {officersError && !error && (
          <p className="reports-message error">{officersError}</p>
        )}

        <div className="reports-table">
          <div className="reports-table-header">
            <p>ID</p>
            <p>Title</p>
            <p>Category</p>
            <p>Citizen</p>
            <p>Priority</p>
            <p>Status</p>
            <p>Assign Officer</p>
            <p>Feedback</p>
          </div>

          {!loading && currentReports.length === 0 && (
            <div className="reports-empty">
              No complaints yet. Citizens can file reports from Report Crime.
            </div>
          )}

          {currentReports.map((report) => (
            <div className="reports-table-row" key={report.id}>
              <div className="table-cell">
                <span className="complaint-id">{report.id}</span>
              </div>
              <div className="table-cell title-cell">
                <span className="title-text" title={report.title}>
                  {report.title}
                </span>
              </div>
              <div className="table-cell">
                <span className="category-text">{report.category}</span>
              </div>
              <div className="table-cell">
                <span className="citizen-name">{report.citizen}</span>
              </div>
              <div className="table-cell">
                <span className="priority-text">{report.priority}</span>
              </div>
              <div className="table-cell">
                <span className={statusClass(report.status)}>{report.status}</span>
              </div>
              <div className="table-cell">
                <select
                  className="assign-select"
                  disabled={assigningId === report.id || officers.length === 0}
                  value={
                    report.assignedOfficerId
                      ? String(report.assignedOfficerId)
                      : ""
                  }
                  onChange={(e) => handleAssign(report.id, e.target.value)}
                >
                  <option value="">
                    {officers.length === 0 ? "No officers — add in Manage Officers" : "Select Officer"}
                  </option>
                  {officers.map((officer) => (
                    <option
                      key={officer.userId || officer.id}
                      value={String(officer.userId || officer.id)}
                    >
                      {officer.name}
                      {officer.position ? ` (${officer.position})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="table-cell">
                {feedbackByComplaint[String(report.backendId)] ? (
                  <button
                    type="button"
                    className="reports-feedback-btn"
                    onClick={() =>
                      navigate("/feedback-details", {
                        state: {
                          panel: "admin",
                          feedback: feedbackByComplaint[String(report.backendId)],
                        },
                      })
                    }
                  >
                    View Feedback
                  </button>
                ) : (
                  <span className="reports-no-feedback">No feedback</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                type="button"
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <AIChat />
    </div>
  );
};

export default AdminReports;
