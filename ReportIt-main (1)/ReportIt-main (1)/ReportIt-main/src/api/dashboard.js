import { apiRequest } from "./http";

export const fetchAdminStats = () =>
  apiRequest("/api/dashboard/admin/stats");

export const fetchOfficerStats = () =>
  apiRequest("/api/dashboard/officer/stats");

export const fetchCitizenStats = () =>
  apiRequest("/api/dashboard/citizen/stats");

export const fetchAdminAnalytics = () =>
  apiRequest("/api/dashboard/admin/analytics");

export const fetchOfficerAnalytics = () =>
  apiRequest("/api/dashboard/officer/analytics");

export const fetchMonthlyComplaintTrends = () =>
  apiRequest("/api/dashboard/admin/monthly-complaint-trends");

export const fetchComplaintCategoryStatistics = () =>
  apiRequest("/api/dashboard/admin/category-statistics");

export const fetchOfficerPerformanceStatistics = () =>
  apiRequest("/api/dashboard/admin/officer-performance");

export const fetchUserRegistrationTrends = () =>
  apiRequest("/api/dashboard/admin/user-registration-trends");

export const fetchComplaintStatusAnalytics = () =>
  apiRequest("/api/dashboard/admin/status-analytics");
