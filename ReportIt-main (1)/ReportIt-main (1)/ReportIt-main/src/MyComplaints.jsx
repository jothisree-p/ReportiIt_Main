import React,
{
  useEffect,
  useState
}
from "react";
import { clearAuth } from "./authStorage";
import { useRequireAuth } from "./hooks/useRequireAuth";
import { useComplaints } from "./hooks/useComplaints";
import { deleteComplaintApi, fetchMyComplaints, updateComplaintApi } from "./api/complaints";
import { submitComplaintFeedback } from "./api/feedback";
import { fetchMyNotifications } from "./api/notifications";
import NotificationSeeMore from "./NotificationSeeMore";
import { openNotifications } from "./notificationActions";

import { useNavigate }
from "react-router-dom";

import "./MyComplaints.css";

import AIChat from "./AIChat";
import {
  getCurrentCitizen,
  getCitizenInitials,
  getCitizenWelcomeText,
} from "./citizenSession";

import {

  FaShieldAlt,
  FaFileAlt,
  FaClock,
  FaUser,
  FaSignOutAlt,
  FaSearch,
  FaBell,
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaStar,
  FaRegStar,

} from "react-icons/fa";

const MyComplaints = () => {

  const navigate = useNavigate();
  useRequireAuth("CITIZEN");
  const citizen = getCurrentCitizen();

  /* ================= STATES ================= */

  const [showNotifications,
  setShowNotifications] =
  useState(false);

  const [activeTab,
  setActiveTab] =
  useState("All");

  const [searchTerm,
  setSearchTerm] =
  useState("");

  const [editingComplaint,setEditingComplaint] =
  useState(null);
  const [feedbackComplaint, setFeedbackComplaint] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [savingFeedback, setSavingFeedback] = useState(false);

  const [editForm,setEditForm] =
  useState({
    title:"",
    category:"",
    description:"",
    location:"",
    date:"",
    incidentTime:"",
  });

  /* ================= PAGINATION ================= */

  const [currentPage,
  setCurrentPage] =
  useState(1);

  const complaintsPerPage = 3;

  /* ================= LOGOUT ================= */

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

  /* ================= NOTIFICATIONS ================= */

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchMyNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]));
  }, []);

  const { complaints, loading, error, refresh } = useComplaints(fetchMyComplaints);

  const handleDeleteComplaint = async (event, complaint) => {
    event.stopPropagation();
    const confirmed = await window.__reportItShowConfirm(
      `Delete complaint ${complaint.id} from My Complaints?`
    );

    if (!confirmed) return;

    try {
      await deleteComplaintApi(complaint.backendId);
      await refresh();
      alert("Complaint deleted from your view. Admin records are preserved.");
    } catch (err) {
      alert(err.message || "Failed to delete complaint");
    }
  };

  const openEditComplaint = (event, complaint) => {
    event.stopPropagation();
    setEditingComplaint(complaint);
    setEditForm({
      title: complaint.title || "",
      category: complaint.category || "",
      description: complaint.description || "",
      location: complaint.location || "",
      date: complaint.date || "",
      incidentTime: complaint.incidentTime || "",
    });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const saveComplaintEdit = async () => {
    if (!editingComplaint?.backendId) return;
    if (!editForm.title.trim() || !editForm.description.trim() || !editForm.location.trim()) {
      alert("Please fill title, description, and location.");
      return;
    }

    try {
      await updateComplaintApi(editingComplaint.backendId, {
        ...editForm,
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        location: editForm.location.trim(),
        lastUpdate: "Citizen updated complaint details",
      });
      setEditingComplaint(null);
      await refresh();
      alert("Complaint updated successfully.");
    } catch (err) {
      alert(err.message || "Failed to update complaint");
    }
  };

  const openFeedback = (event, complaint) => {
    event.stopPropagation();
    setFeedbackComplaint(complaint);
    setFeedbackRating(0);
    setFeedbackComment("");
  };

  const saveFeedback = async () => {
    if (!feedbackComplaint?.backendId || savingFeedback) return;
    if (feedbackRating < 1) {
      alert("Please select a star rating before sending feedback.");
      return;
    }

    try {
      setSavingFeedback(true);
      await submitComplaintFeedback(feedbackComplaint.backendId, {
        rating: feedbackRating,
        comment: feedbackComment,
      });
      setFeedbackComplaint(null);
      setFeedbackComment("");
      alert("Feedback sent successfully.");
    } catch (err) {
      alert(err.message || "Failed to send feedback");
    } finally {
      setSavingFeedback(false);
    }
  };

  /* ================= FILTER ================= */

  const filteredComplaints =

    complaints.filter((item)=>{

      const matchesTab =

        activeTab === "All"

        ||

        item.status === activeTab;

      const matchesSearch =

        item.title
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )

        ||

        item.category
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )

        ||

        item.id
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

      return (
        matchesTab &&
        matchesSearch
      );

    });

  /* ================= PAGINATION ================= */

  const indexOfLastComplaint =

  currentPage * complaintsPerPage;

  const indexOfFirstComplaint =

  indexOfLastComplaint -
  complaintsPerPage;

  const currentComplaints =

  filteredComplaints.slice(

    indexOfFirstComplaint,
    indexOfLastComplaint

  );

  const totalPages =

  Math.ceil(

    filteredComplaints.length /
    complaintsPerPage

  );

  return (

    <div className="complaints-container">

      {/* ================= SIDEBAR ================= */}

      <div className="sidebar">

        <div className="sidebar-top">

          {/* LOGO */}

          <div className="sidebar-logo">

            <FaShieldAlt className="logo-icon" />

            <span>Report<span className="highlight">It</span></span>

          </div>

          <p className="panel-text">

            CITIZEN PANEL

          </p>

          {/* MENU */}

          <ul className="sidebar-menu">

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

            <li className="active-menu">

              <FaFileAlt />

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

          {/* LEFT */}

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

              {getCitizenWelcomeText(citizen)}

            </h3>

          </div>

          {/* RIGHT */}

          <div className="topbar-right">

            {/* NOTIFICATION */}

            <div
              className="icon-box"
              onClick={() => openNotifications(showNotifications, setShowNotifications, setNotifications)}
            >

              <FaBell className="notification-bell" />

              {notifications.length > 0 && (
                <span className="notification-dot has-notifications"></span>
              )}

            </div>

            {/* POPUP */}

            {

              showNotifications && (

                <div className="notification-popup">

                  <h3>

                    Notifications

                  </h3>

                  {

                    notifications.length > 0 ? (
                      notifications.map(
                        (item,index)=>(

                        <div
                          className="notification-item"
                          key={index}
                        >

                          {item.message}

                        </div>

                        )
                      )
                    ) : (
                      <div className="notification-item">
                        No notifications yet
                      </div>
                    )


                  }

                  <NotificationSeeMore />

                </div>

              )

            }

            {/* PROFILE */}

            <div
              className="profile-section"
              onClick={() =>
                navigate("/citizen-profile")
              }
            >

              <div className="profile-circle">

                {getCitizenInitials(citizen)}

              </div>

            </div>

          </div>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="complaints-content">

          <h1>

            My Complaints

          </h1>

          {/* SEARCH + FILTER */}

          <div className="search-filter">

            {/* SEARCH */}

            <div className="search-box">

              <FaSearch className="search-icon" />

              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e)=>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

            </div>

            {/* FILTERS */}

            <div className="mycomplaints-filter-tabs">

              {

                [
                  "All",
                  "Pending",
                  "In Progress",
                  "Resolved",
                  "Rejected",
                ].map((item)=>(

                  <button
                    key={item}

                    className={

                      activeTab === item

                      ?

                      "mycomplaints-filter-btn mycomplaints-active-filter"

                      :

                      "mycomplaints-filter-btn"

                    }

                    onClick={() => {

                      setActiveTab(item);

                      setCurrentPage(1);

                    }}
                  >

                    {item}

                  </button>

                ))

              }

            </div>

          </div>

          {/* TABLE */}

          <div className="mycomplaints-table-container">

            <div className="mycomplaints-table-header">

              <p>ID</p>
              <p>Title</p>
              <p>Category</p>
              <p>Priority</p>
              <p>Status</p>
              <p>Date</p>
              <p>Feedback</p>
              <p>Actions</p>

            </div>

            {loading && (
              <p style={{ padding: "2rem", textAlign: "center" }}>Loading complaints...</p>
            )}
            {error && (
              <p style={{ padding: "2rem", textAlign: "center", color: "#dc2626" }}>{error}</p>
            )}
            {!loading && !error && currentComplaints.length === 0 && (
              <p style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
                No complaints yet.{" "}
                <span
                  style={{ color: "#2563eb", cursor: "pointer" }}
                  onClick={() => navigate("/report-crime")}
                >
                  Report a crime
                </span>
              </p>
            )}
            {

              currentComplaints.map(
                (item,index)=>(

                  <div
                    className="mycomplaints-table-row"
                    key={index}

                    onClick={() =>
                      navigate(
                        "/citizen-complaint-details",
                        {
                          state:item
                        }
                      )
                    }
                  >

                    <p
                      className="mycomplaints-id-text"
                      data-label="ID"
                    >

                      {item.id}

                    </p>

                    <p data-label="Title">

                      {item.title}

                    </p>

                    <p data-label="Category">

                      {item.category}

                    </p>

                    <p
                      data-label="Priority"
                      className={

                        item.priority === "Critical"

                        ? "mycomplaints-critical"

                        : item.priority === "High"

                        ? "mycomplaints-high"

                        : item.priority === "Medium"

                        ? "mycomplaints-medium"

                        : "mycomplaints-low"

                      }
                    >

                      {item.priority || "Not set"}

                    </p>

                    <span
                      data-label="Status"
                      className={

                        item.status === "Pending"

                        ?

                        "mycomplaints-status-badge mycomplaints-status-pending"

                        :

                        item.status === "In Progress"

                        ?

                        "mycomplaints-status-badge mycomplaints-status-progress"

                        :

                        item.status === "Resolved"

                        ?

                        "mycomplaints-status-badge mycomplaints-status-resolved"

                        :

                        "mycomplaints-status-badge mycomplaints-status-rejected"

                      }
                    >

                      {item.status}

                    </span>

                    <p data-label="Date">

                      {item.date}

                    </p>

                    <div className="mycomplaints-feedback-cell" data-label="Feedback">
                      <button
                        className="mycomplaints-feedback-btn"
                        onClick={(event) => openFeedback(event, item)}
                        title="Send feedback"
                      >
                        <FaRegStar />
                        Feedback
                      </button>
                    </div>

                    <div className="mycomplaints-action-group" data-label="Actions">
                      <button
                        className="mycomplaints-edit-btn"
                        onClick={(event) => openEditComplaint(event, item)}
                        title="Edit complaint"
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="mycomplaints-delete-btn"
                        onClick={(event) => handleDeleteComplaint(event, item)}
                        title="Delete complaint"
                      >
                        <FaTrash />
                      </button>
                    </div>

                  </div>

                )
              )

            }

          </div>

          {/* PAGINATION */}

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

      {/* AI CHAT */}

      {editingComplaint && (
        <div className="mycomplaints-edit-overlay" onClick={() => setEditingComplaint(null)}>
          <div className="mycomplaints-edit-modal" onClick={(event) => event.stopPropagation()}>
            <h2>Edit Complaint</h2>

            <label>
              Title
              <input name="title" value={editForm.title} onChange={handleEditChange} />
            </label>

            <label>
              Category
              <input name="category" value={editForm.category} onChange={handleEditChange} />
            </label>

            <label>
              Description
              <textarea name="description" value={editForm.description} onChange={handleEditChange} />
            </label>

            <label>
              Location
              <input name="location" value={editForm.location} onChange={handleEditChange} />
            </label>

            <div className="mycomplaints-edit-grid">
              <label>
                Date
                <input type="date" name="date" value={editForm.date} onChange={handleEditChange} />
              </label>

              <label>
                Time
                <input type="time" name="incidentTime" value={editForm.incidentTime} onChange={handleEditChange} />
              </label>
            </div>

            <div className="mycomplaints-edit-actions">
              <button className="mycomplaints-cancel-btn" onClick={() => setEditingComplaint(null)}>
                Cancel
              </button>
              <button className="mycomplaints-save-btn" onClick={saveComplaintEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {feedbackComplaint && (
        <div className="mycomplaints-edit-overlay" onClick={() => setFeedbackComplaint(null)}>
          <div className="mycomplaints-edit-modal mycomplaints-feedback-modal" onClick={(event) => event.stopPropagation()}>
            <h2>Send Feedback</h2>
            <p className="mycomplaints-feedback-case">
              {feedbackComplaint.id} · {feedbackComplaint.title}
            </p>

            <div className="mycomplaints-star-picker" aria-label="Feedback rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={star <= feedbackRating ? "active" : ""}
                  onClick={() => setFeedbackRating(star)}
                  title={`${star} star${star > 1 ? "s" : ""}`}
                >
                  <FaStar />
                </button>
              ))}
            </div>

            <label>
              Comments
              <textarea
                value={feedbackComment}
                onChange={(event) => setFeedbackComment(event.target.value)}
                placeholder="Share your experience with the assigned officer..."
              />
            </label>

            <div className="mycomplaints-edit-actions">
              <button className="mycomplaints-cancel-btn" onClick={() => setFeedbackComplaint(null)}>
                Cancel
              </button>
              <button className="mycomplaints-save-btn" onClick={saveFeedback} disabled={savingFeedback}>
                {savingFeedback ? "Sending..." : "Send Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AIChat />

    </div>

  );

};

export default MyComplaints;
