import { apiRequest } from "./http";

export const fetchMyProfile = () => apiRequest("/api/profiles/me");

export const updateMyProfile = (payload) =>
  apiRequest("/api/profiles/me", {
    method: "PUT",
    body: payload,
  });

export const fetchProfileByUserId = (userId) =>
  apiRequest(`/api/profiles/${userId}`);

export const updateProfileByUserId = (userId, payload) =>
  apiRequest(`/api/profiles/${userId}`, {
    method: "PUT",
    body: payload,
  });
