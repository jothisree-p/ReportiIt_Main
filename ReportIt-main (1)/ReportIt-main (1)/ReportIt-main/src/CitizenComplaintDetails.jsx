import React, { useEffect, useState } from "react";
import { useComplaints } from "./hooks/useComplaints";
import { fetchMyComplaints, trackComplaint, fetchComplaintHistory } from "./api/complaints";
import { fetchMyNotifications } from "./api/notifications";
import NotificationSeeMore from "./NotificationSeeMore";
import { openNotifications } from "./notificationActions";
import { fetchComplaintFiles } from "./api/files";
import { clearAuth } from "./authStorage";
import {
  getCurrentCitizen,
  getCitizenInitials,
} from "./citizenSession";

import "./CitizenComplaintDetails.css";

import {
  FaArrowLeft,
  FaBell,
  FaMapMarkerAlt,
  FaFileAlt,
  FaClock,
  FaUser,
  FaSignOutAlt,
  FaShieldAlt,
  FaSearchMinus,
  FaSearchPlus,
  FaTimes,
} from "react-icons/fa";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";
const CitizenComplaintDetails = () => {

  const navigate = useNavigate();
  const citizen = getCurrentCitizen();

  const location = useLocation();

  const { complaints: storedComplaints } = useComplaints(fetchMyComplaints);

  const selectedComplaint =
    storedComplaints.find(
      (item) => item.id === location.state?.id
    ) ||
    location.state ||
    storedComplaints[0] ||
    {};

  const [notifications, setNotifications] = useState([]);
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [evidenceError, setEvidenceError] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [resolvedComplaint, setResolvedComplaint] = useState(selectedComplaint);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    setResolvedComplaint(selectedComplaint);
  }, [selectedComplaint?.id, selectedComplaint?.backendId]);

  useEffect(() => {
    const complaintCode = selectedComplaint?.id;

    if (!complaintCode || selectedComplaint?.backendId) {
      return;
    }

    trackComplaint(complaintCode)
      .then(({ complaint: trackedComplaint, history }) => {
        setResolvedComplaint((current) => ({
          ...current,
          ...trackedComplaint,
        }));
        if (history) {
          setTimeline(history);
        }
      })
      .catch(() => {});
  }, [selectedComplaint?.id, selectedComplaint?.backendId]);

  const complaint = resolvedComplaint;

  useEffect(() => {
    if (!complaint?.backendId) return;
    fetchComplaintHistory(complaint.backendId)
      .then(setTimeline)
      .catch(() => setTimeline([]));
  }, [complaint?.backendId]);

  useEffect(() => {
    fetchMyNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]));
  }, []);

  useEffect(() => {
    if (!complaint?.backendId) {
      setEvidenceFiles([]);
      setEvidenceError("");
      return;
    }
    setEvidenceError("");
    fetchComplaintFiles(complaint.backendId)
      .then(setEvidenceFiles)
      .catch((err) => {
        setEvidenceFiles([]);
        setEvidenceError(err.message || "Unable to load uploaded evidence.");
      });
  }, [complaint?.backendId]);

  const [showNotifications,
  setShowNotifications] =
  useState(false);

  const handleLogout = async () => {

    const confirmLogout =
    await window.__reportItShowConfirm(
      "Are you sure you want to logout?"
    );

    if(confirmLogout){
      clearAuth();
      navigate("/");
    }

  };

  const openEvidencePreview = (file) => {
    setPreviewFile(file);
    setPreviewZoom(1);
  };

  const closeEvidencePreview = () => {
    setPreviewFile(null);
    setPreviewZoom(1);
  };

  const zoomEvidence = (step) => {
    setPreviewZoom((currentZoom) => {
      const nextZoom = Math.round((currentZoom + step) * 10) / 10;
      return Math.min(3, Math.max(0.5, nextZoom));
    });
  };

  return (

    <div className="citizen-details-container">

      {/* ================= SIDEBAR ================= */}

      <div className="citizen-sidebar">

        <div>

          {/* LOGO */}

          <div className="citizen-logo">

            <FaShieldAlt className="citizen-logo-icon" />

            <h1>

              Report
              <span>It</span>

            </h1>

          </div>

          <p className="citizen-panel-text">

            CITIZEN PANEL

          </p>

          {/* MENU */}

          <ul className="citizen-menu">

            <li
              onClick={() =>
                navigate("/citizen-dashboard")
              }
            >

              <FaFileAlt />

              Dashboard

            </li>

            <li
              onClick={() =>
                navigate("/report-crime")
              }
            >

              <FaFileAlt />

              Report Crime

            </li>

            <li
              className="citizen-active-menu"
            >

              <FaClock />

              My Complaints

            </li>

            <li
              onClick={() =>
                navigate("/track-status")
              }
            >

              <FaClock />

              Track Status

            </li>

            <li
              onClick={() =>
                navigate("/citizen-profile")
              }
            >

              <FaUser />

              Profile

            </li>

          </ul>

        </div>

        {/* LOGOUT */}

        <div
          className="citizen-logout"
          onClick={handleLogout}
        >

          <FaSignOutAlt />

          Logout

        </div>

      </div>

      {/* ================= MAIN ================= */}

      <div className="citizen-main">

        {/* ================= TOPBAR ================= */}

        <div className="citizen-topbar">

          <div className="citizen-topbar-left">

            <button
              className="back-btn"

              onClick={() =>
                navigate(-1)
              }
            >

              <FaArrowLeft />

            </button>

            <h3>

              Complaint Details

            </h3>

          </div>

          {/* RIGHT */}

          <div className="citizen-topbar-right">

            <div
              className="citizen-bell"

              onClick={() => openNotifications(showNotifications, setShowNotifications, setNotifications)}
            >

              <FaBell />

            </div>

            {

              showNotifications && (

                <div className="citizen-popup">

                  <h4>

                    Notifications

                  </h4>

                  {

                    notifications.length > 0 ? (

                      notifications.map((item,index)=>(

                        <div className="citizen-popup-item" key={index}>

                          {item.message || item}

                        </div>

                      ))

                    ) : (

                      <div className="citizen-popup-item">

                        No notifications yet

                      </div>

                    )

                  }

                  <NotificationSeeMore />

                </div>

              )

            }

            <div
              className="citizen-profile-circle"

              onClick={() =>
                navigate("/citizen-profile")
              }
            >

              {getCitizenInitials(citizen)}

            </div>

          </div>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="citizen-details-content">

          <div className="citizen-details-card">

            <h1>

              {complaint?.title}

            </h1>

            <div className="citizen-details-grid">

            <div className="citizen-detail-row">

              <span>ID</span>

              <span>

                {complaint?.id}

              </span>

            </div>

            <div className="citizen-detail-row">

              <span>Category</span>

              <span>

                {complaint?.category}

              </span>

            </div>

            <div className="citizen-detail-row">

              <span>Priority</span>

              <span>

                {complaint?.priority || "Not set"}

              </span>

            </div>

            <div className="citizen-detail-row">

              <span>Status</span>

              <span>

                {complaint?.status}

              </span>

            </div>

            <div className="citizen-detail-row">

              <span>Date</span>

              <span>

                {complaint?.date}

              </span>

            </div>

            </div>

            <div className="citizen-location">

              <FaMapMarkerAlt />

              {complaint?.location || "Central Market, Chennai"}

            </div>

            {/* DESCRIPTION */}

            <div className="citizen-description">

              <h3>

                Description

              </h3>

              <p>

                {complaint?.lastUpdate || complaint?.description || "This complaint has been submitted successfully. Authorities are reviewing the issue and updates will appear here."}

              </p>

            </div>

            <div className="citizen-evidence">
              <h3>Uploaded Evidence</h3>
              {evidenceError ? (
                <p className="citizen-evidence-error">{evidenceError}</p>
              ) : evidenceFiles.length > 0 ? (
                evidenceFiles.map((file) => {
                  const isImage =
                    file.contentType?.startsWith?.("image/") ||
                    /\.(png|jpe?g|gif|webp)$/i.test(file.fileName || "");

                  return (
                    isImage ? (
                    <button
                      type="button"
                      className="citizen-evidence-item citizen-evidence-image"
                      key={file.id}
                      onClick={() => openEvidencePreview(file)}
                    >
                      <img src={file.downloadUrl} alt={file.fileName} />
                      <span>{file.fileName}</span>
                    </button>
                    ) : (
                    <a
                      className="citizen-evidence-item"
                      key={file.id}
                      href={file.downloadUrl}
                    >
                      {isImage ? (
                        <img src={file.downloadUrl} alt={file.fileName} />
                      ) : (
                        <FaFileAlt />
                      )}
                      <span>{file.fileName}</span>
                    </a>
                    )
                  );
                })
              ) : (
                <p>No evidence uploaded.</p>
              )}
            </div>

            {/* TIMELINE */}

            <div className="citizen-timeline">
              <h3>Timeline</h3>

              {timeline.length > 0 ? (
                [...timeline].reverse().map((step, index) => (
                  <div className="timeline-box" key={step.id || index}>
                    <div className="timeline-dot active-dot"></div>
                    <div>
                      <h4>{step.newStatus}</h4>
                      <p className="timeline-date" style={{ color: "#9ca3d2", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                        {step.createdAt?.slice?.(0, 10) || ""} {step.createdAt?.slice?.(11, 16) || ""}
                      </p>
                      {step.remark && <p style={{ color: "#e2e8f0", fontSize: "0.95rem" }}>{step.remark}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="timeline-box">
                    <div className="timeline-dot"></div>
                    <div>
                      <h4>Complaint Submitted</h4>
                      <p>Your complaint was received.</p>
                    </div>
                  </div>
                  {complaint?.assignedOfficer && (
                    <div className="timeline-box">
                      <div className="timeline-dot active-dot"></div>
                      <div>
                        <h4>Officer Assigned</h4>
                        <p>{complaint.assignedOfficer}</p>
                      </div>
                    </div>
                  )}
                  <div className="timeline-box">
                    <div className="timeline-dot active-dot"></div>
                    <div>
                      <h4>{complaint?.status || "Under Review"}</h4>
                      <p>Priority: {complaint?.priority || "Not set"}</p>
                    </div>
                  </div>
                </>
              )}

              {complaint?.investigationNotes && complaint.investigationNotes.length > 0 && (
                <>
                  <h3 style={{ marginTop: "1.5rem", borderTop: "1px solid #1d2b63", paddingTop: "1rem" }}>Investigation Notes</h3>
                  {complaint.investigationNotes.map((item, index) => (
                    <div className="timeline-box" key={`note-${index}`}>
                      <div className="timeline-dot active-dot"></div>
                      <div>
                        <h4>Officer Note</h4>
                        <p style={{ color: "#e2e8f0" }}>{item}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

          </div>

        </div>

      </div>

      {previewFile && (
        <div className="evidence-preview-overlay" role="dialog" aria-modal="true">
          <div className="evidence-preview-toolbar">
            <button type="button" onClick={() => zoomEvidence(-0.2)} aria-label="Zoom out">
              <FaSearchMinus />
            </button>
            <span>{Math.round(previewZoom * 100)}%</span>
            <button type="button" onClick={() => zoomEvidence(0.2)} aria-label="Zoom in">
              <FaSearchPlus />
            </button>
            <button type="button" onClick={closeEvidencePreview} aria-label="Close preview">
              <FaTimes />
            </button>
          </div>

          <div className="evidence-preview-stage" onClick={closeEvidencePreview}>
            <img
              src={previewFile.downloadUrl}
              alt={previewFile.fileName}
              style={{ transform: `scale(${previewZoom})` }}
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        </div>
      )}

    </div>

  );

};

export default CitizenComplaintDetails;
