import React,
{
  useEffect,
  useState
}
from "react";

import { useNavigate }
from "react-router-dom";

import "./ManageUsers.css";

import AIChat from "./AIChat";
import AdminNotificationBell from "./AdminNotificationBell";
import EvidencePreviewModal from "./EvidencePreviewModal";

import {

  FaShieldAlt,
  FaUsers,
  FaUserShield,
  FaClipboardList,
  FaChartBar,
  FaSignOutAlt,
  FaArrowLeft,
  FaSearch,
  FaUserSlash,
  FaUserCheck,
  FaFileAlt,
  FaChartPie,

} from "react-icons/fa";
import { fetchCitizens, updateUserStatus } from "./api/users";
import { useComplaints } from "./hooks/useComplaints";
import { fetchAllComplaints } from "./api/complaints";
import { fetchComplaintFiles } from "./api/files";
import { clearAuth } from "./authStorage";

const ManageUsers = () => {

  const navigate = useNavigate();

  const [searchTerm,setSearchTerm] =
  useState("");

  const [selectedUser,setSelectedUser] =
  useState(null);
  const [selectedUserFiles, setSelectedUserFiles] = useState({});
  const [previewFile, setPreviewFile] = useState(null);

  /* ================= PAGINATION ================= */

  const [currentPage,setCurrentPage] =
  useState(1);

  const usersPerPage = 3;

  /* ================= USERS ================= */

  const [users, setUsers] = useState([]);
  const { complaints } = useComplaints(fetchAllComplaints);

  const selectedUserComplaints = selectedUser
    ? complaints.filter(
        (complaint) =>
          complaint.citizenId === selectedUser.id ||
          complaint.citizen === selectedUser.name ||
          complaint.citizen === selectedUser.fullName
      )
    : [];

  useEffect(() => {
    if (!selectedUser) {
      setSelectedUserFiles({});
      return;
    }

    Promise.all(
      selectedUserComplaints
        .filter((complaint) => complaint.backendId)
        .map((complaint) =>
          fetchComplaintFiles(complaint.backendId)
            .then((files) => [complaint.backendId, files])
            .catch(() => [complaint.backendId, []])
        )
    ).then((entries) => setSelectedUserFiles(Object.fromEntries(entries)));
  }, [selectedUser, complaints]);

  useEffect(() => {
    fetchCitizens()
      .then((citizens) =>
        setUsers(
          citizens.map((user) => ({
            ...user,
            complaints: complaints.filter(
              (complaint) =>
                complaint.citizen === user.name ||
                complaint.citizen === user.fullName
            ).length,
          }))
        )
      )
      .catch(() => setUsers([]));
  }, [complaints]);

  const toggleUserStatus = async (user) => {
    const nextStatus = user.status === "Active" ? "Blocked" : "Active";
    try {
      await updateUserStatus(user.id, nextStatus);
      const refreshed = await fetchCitizens();
      setUsers(
        refreshed.map((item) => ({
          ...item,
          complaints: complaints.filter(
            (complaint) =>
              complaint.citizen === item.name ||
              complaint.citizen === item.fullName
          ).length,
        }))
      );
    } catch (err) {
      alert(err.message || "Failed to update user status");
    }
  };

  /* ================= FILTER ================= */

  const filteredUsers =
  users.filter((user)=>

    [
      user.name,
      user.fullName,
      user.email,
      user.phone,
    ]
    .join(" ")
    .toLowerCase()
    .includes(searchTerm.toLowerCase())

  );

  /* ================= PAGINATION LOGIC ================= */

  const indexOfLastUser =
  currentPage * usersPerPage;

  const indexOfFirstUser =
  indexOfLastUser - usersPerPage;

  const currentUsers =
  filteredUsers.slice(

    indexOfFirstUser,
    indexOfLastUser

  );

  const totalPages =
  Math.ceil(

    filteredUsers.length /
    usersPerPage

  );

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

            <li className="active-menu">

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

          <h1>

            Manage Users

          </h1>

          {/* SEARCH */}

          <div className="search-box">

            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e)=>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>

          {/* ================= TABLE ================= */}

          <div className="users-table">

            {/* HEADER */}

            <div className="users-table-header">

              <p>Name</p>
              <p>Email</p>
              <p>Phone</p>
              <p>Complaints</p>
              <p>Status</p>
              <p>Actions</p>

            </div>

            {/* ROWS */}

            {

              currentUsers.map(
                (user,index)=>(

                  <div
                    className="users-table-row"
                    key={index}
                    onClick={() =>
                      setSelectedUser(user)
                    }
                  >

                    {/* NAME */}

                    <div className="user-cell">

                      <div className="user-avatar">

                        {user.initials}

                      </div>

                      <div className="user-info">

                        <h4>

                          {user.name}

                        </h4>

                      </div>

                    </div>

                    {/* EMAIL */}

                    <p className="email-text">

                      {user.email}

                    </p>

                    {/* PHONE */}

                    <p className="email-text">

                      {user.phone}

                    </p>

                    {/* COMPLAINTS */}

                    <p className="complaint-text">

                      {user.complaints}

                    </p>

                    {/* STATUS */}

                    <div>

                      <span

                        className={

                          user.status === "Active"

                          ? "active-badge"

                          : "blocked-badge"

                        }

                      >

                        {user.status}

                      </span>

                    </div>

                    {/* ACTION */}

                    <div className="action-icons">

                      {

                        user.status === "Active"

                        ?

                        <FaUserSlash
                          className="block-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleUserStatus(user);
                          }}
                        />

                        :

                        <FaUserCheck
                          className="unblock-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleUserStatus(user);
                          }}
                        />

                      }

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

          {

            selectedUser && (

              <div
                className="user-modal-overlay"
                onClick={() => setSelectedUser(null)}
              >

                <div
                  className="user-modal"
                  onClick={(e) => e.stopPropagation()}
                >

                  <button
                    className="user-modal-close"
                    onClick={() => setSelectedUser(null)}
                  >

                    X

                  </button>

                  <div className="user-modal-header">

                    <div className="user-modal-avatar">

                      {selectedUser.initials}

                    </div>

                    <div>

                      <h2>{selectedUser.fullName || selectedUser.name}</h2>

                      <p>{selectedUser.email}</p>

                    </div>

                  </div>

                  <div className="user-detail-grid">

                    <div>
                      <span>Full Name</span>
                      <strong>{selectedUser.fullName || selectedUser.name}</strong>
                    </div>

                    <div>
                      <span>Email</span>
                      <strong>{selectedUser.email}</strong>
                    </div>

                    <div>
                      <span>Phone</span>
                      <strong>{selectedUser.phone || "Not Provided"}</strong>
                    </div>

                    <div>
                      <span>Password</span>
                      <strong>Protected</strong>
                    </div>

                    <div>
                      <span>Status</span>
                      <strong>{selectedUser.status}</strong>
                    </div>

                    <div>
                      <span>Joined</span>
                      <strong>{selectedUser.joined || "Not Available"}</strong>
                    </div>

                    <div>
                      <span>Total Complaints</span>
                      <strong>{selectedUser.complaints}</strong>
                    </div>

                  </div>

                  <div className="user-complaint-section">
                    <h3>Complaints & Evidence</h3>
                    {selectedUserComplaints.length > 0 ? (
                      selectedUserComplaints.map((complaint) => (
                        <div className="user-complaint-card" key={complaint.id}>
                          <div>
                            <strong>{complaint.id}</strong>
                            <span>{complaint.title}</span>
                            <small>{complaint.status} - {complaint.priority || "Priority pending"}</small>
                          </div>
                          <div className="user-file-list">
                            {(selectedUserFiles[complaint.backendId] || []).length > 0 ? (
                              selectedUserFiles[complaint.backendId].map((file) => {
                                const isImage =
                                  file.contentType?.startsWith?.("image/") ||
                                  /\.(png|jpe?g|gif|webp)$/i.test(file.fileName || "");

                                return isImage ? (
                                  <button
                                    type="button"
                                    className="user-file-preview-btn"
                                    key={file.id}
                                    onClick={() => setPreviewFile(file)}
                                  >
                                    {file.fileName}
                                  </button>
                                ) : (
                                  <a href={file.downloadUrl} key={file.id}>
                                    {file.fileName}
                                  </a>
                                );
                              })
                            ) : (
                              <span>No evidence uploaded</span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="user-empty-note">No complaints filed by this user.</p>
                    )}
                  </div>

                </div>

              </div>

            )

          }

        </div>

      </div>

      {/* ================= AI CHAT ================= */}

      <EvidencePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />

      <AIChat />

    </div>

  );

};

export default ManageUsers;
