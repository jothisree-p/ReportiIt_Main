import {
  assignComplaintApi,
  createComplaint,
  fetchAllComplaints,
  fetchAssignedComplaints,
  fetchMyComplaints,
  mapComplaintFromApi,
  updateComplaintApi,
} from "./api/complaints";
import { getRole } from "./authStorage";

export { mapComplaintFromApi };

export const getComplaintStats = (complaints = []) => {
  const total = complaints.length;
  const pending = countByStatus(complaints, "Pending");
  const inProgress = countByStatus(complaints, "In Progress");
  const resolved = countByStatus(complaints, "Resolved");
  const rejected = countByStatus(complaints, "Rejected");
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return {
    total,
    pending,
    inProgress,
    resolved,
    rejected,
    resolutionRate,
  };
};

const countByStatus = (complaints, status) =>
  complaints.filter((complaint) => complaint.status === status).length;

const resolveFetcher = () => {
  const role = getRole();
  if (role === "CITIZEN") return fetchMyComplaints;
  if (role === "OFFICER") return fetchAssignedComplaints;
  return fetchAllComplaints;
};

/** @deprecated Use useComplaints hook or async fetchers */
export const getComplaints = () => [];

export const fetchComplaints = () => resolveFetcher()();

export const getComplaintsForOfficer = async () => fetchAssignedComplaints();

export const saveComplaint = async (complaint) => createComplaint(complaint);

export const updateComplaint = async (id, updates) => {
  const all = await fetchAllComplaints();
  const match =
    all.find((c) => c.id === id) ||
    all.find((c) => c.complaintCode === id);

  if (!match?.backendId) {
    throw new Error("Complaint not found");
  }

  await updateComplaintApi(match.backendId, updates);
  return resolveFetcher()();
};

export const assignComplaint = async (complaintId, officer) => {
  const all = await fetchAllComplaints();
  const match = all.find((c) => c.id === complaintId);
  if (!match?.backendId) {
    throw new Error("Complaint not found");
  }

  const officerUserId = officer.userId || officer.id;
  await assignComplaintApi(match.backendId, officerUserId);
  return fetchAllComplaints();
};
