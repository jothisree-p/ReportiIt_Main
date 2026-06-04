import { AUTH_URL } from "./config";
import { apiRequest } from "./http";
import { saveAuth } from "../authStorage";

export const registerCitizen = async (payload) => {
  const response = await apiRequest("/api/auth/register", {
    baseUrl: AUTH_URL,
    auth: false,
    method: "POST",
    body: payload,
  });
  saveAuth(response);
  return response;
};

export const login = async (email, password, role) => {
  const response = await apiRequest("/api/auth/login", {
    baseUrl: AUTH_URL,
    auth: false,
    method: "POST",
    body: { email, password, role },
  });
  saveAuth(response);
  return response;
};

export const sendOtp = (email, purpose) =>
  apiRequest("/api/auth/otp/send", {
    baseUrl: AUTH_URL,
    auth: false,
    method: "POST",
    body: { email, purpose },
  });

export const verifyOtp = (email, otp, purpose) =>
  apiRequest("/api/auth/otp/verify", {
    baseUrl: AUTH_URL,
    auth: false,
    method: "POST",
    body: { email, otp, purpose },
  });
