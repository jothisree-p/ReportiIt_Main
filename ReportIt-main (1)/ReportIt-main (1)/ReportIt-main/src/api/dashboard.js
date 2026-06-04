import { apiRequest } from "./http";

export const fetchAdminStats = () =>
  apiRequest("/api/dashboard/admin/stats");

export const fetchOfficerStats = () =>
  apiRequest("/api/dashboard/officer/stats");

export const fetchCitizenStats = () =>
  apiRequest("/api/dashboard/citizen/stats");
