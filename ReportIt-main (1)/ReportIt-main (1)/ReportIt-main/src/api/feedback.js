import { apiRequest } from "./http";

export const submitComplaintFeedback = (complaintId, payload) =>
  apiRequest(`/api/feedback/complaints/${complaintId}`, {
    method: "POST",
    body: {
      rating: payload.rating,
      comment: payload.comment || "",
    },
  });

export const fetchComplaintFeedback = (complaintId) =>
  apiRequest(`/api/feedback/complaints/${complaintId}`);

export const fetchOfficerFeedback = () => apiRequest("/api/feedback/officer/me");

export const fetchAdminFeedback = () => apiRequest("/api/feedback/admin");

export const feedbackListByComplaintId = (items = []) =>
  items.reduce((acc, item) => {
    if (item.complaintId) {
      acc[String(item.complaintId)] = item;
    }
    return acc;
  }, {});
