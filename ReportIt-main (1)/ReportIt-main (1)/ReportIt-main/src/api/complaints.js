import { apiRequest } from "./http";

export const mapComplaintFromApi = (c) => ({
  id: c.complaintCode || `CMP-${c.id}`,
  backendId: c.id,
  title: c.title,
  category: c.category || "General",
  description: c.description || "",
  location: c.locationText || "",
  locationText: c.locationText || "",
  date: c.incidentDate || c.createdAt?.slice?.(0, 10) || "",
  incidentTime: c.incidentTime || "",
  priority: c.priority || "Medium",
  status: c.status || "Pending",
  citizen: c.citizenName || "Citizen",
  citizenId: c.citizenId,
  citizenEmail: "",
  assignedOfficer: c.assignedOfficerName || "",
  assignedOfficerEmail: "",
  assignedOfficerId: c.assignedOfficerId,
});

export const fetchAllComplaints = async () => {
  const data = await apiRequest("/api/complaints");
  return data.map(mapComplaintFromApi);
};

export const fetchMyComplaints = async () => {
  const data = await apiRequest("/api/complaints/citizen/me");
  return data.map(mapComplaintFromApi);
};

export const fetchAssignedComplaints = async () => {
  const data = await apiRequest("/api/complaints/officer/assigned");
  return data.map(mapComplaintFromApi);
};

export const createComplaint = async (payload) => {
  const data = await apiRequest("/api/complaints", {
    method: "POST",
    body: {
      title: payload.title,
      category: payload.category,
      description: payload.description,
      locationText: payload.location || payload.locationText,
      incidentDate: payload.date || null,
      incidentTime: payload.incidentTime || null,
      priority: payload.priority || "Medium",
    },
  });
  return mapComplaintFromApi(data);
};

export const updateComplaintApi = async (backendId, updates) => {
  const data = await apiRequest(`/api/complaints/${backendId}`, {
    method: "PUT",
    body: {
      title: updates.title,
      category: updates.category,
      description: updates.description,
      locationText: updates.location,
      priority: updates.priority,
      status: updates.status,
      remark: updates.lastUpdate || updates.remark,
      note: updates.note,
    },
  });
  return mapComplaintFromApi(data);
};

export const assignComplaintApi = async (backendId, officerUserId) => {
  const data = await apiRequest(`/api/complaints/${backendId}/assign`, {
    method: "PATCH",
    body: { officerUserId },
  });
  return mapComplaintFromApi(data);
};

export const deleteComplaintApi = async (backendId) => {
  await apiRequest(`/api/complaints/${backendId}`, { method: "DELETE" });
};

export const trackComplaint = async (complaintCode) => {
  const data = await apiRequest(`/api/status/track/${complaintCode}`);
  return {
    complaint: mapComplaintFromApi(data.complaint),
    history: data.history || [],
  };
};
