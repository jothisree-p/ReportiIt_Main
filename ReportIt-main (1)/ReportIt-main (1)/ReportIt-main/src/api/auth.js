import { AUTH_URL } from "./config";
import { apiRequest } from "./http";
import { saveAuth } from "../authStorage";
import { encryptPassword } from "./crypto";

const otpCooldownMs = 60_000;
const otpRequests = new Map();

const getOtpKey = (email, purpose) =>
  `${String(email || "").trim().toLowerCase()}::${String(purpose || "").toUpperCase()}`;

export const registerCitizen = async (payload) => {
  const encryptedPassword = await encryptPassword(payload.password);
  const response = await apiRequest("/api/auth/register", {
    baseUrl: AUTH_URL,
    auth: false,
    method: "POST",
    body: {
      ...payload,
      password: encryptedPassword,
    },
  });
  saveAuth(response);
  return response;
};

export const login = async (email, password, role) => {
  const encryptedPassword = await encryptPassword(password);
  const response = await apiRequest("/api/auth/login", {
    baseUrl: AUTH_URL,
    auth: false,
    method: "POST",
    body: { email, password: encryptedPassword, role },
  });
  saveAuth(response);
  return response;
};

export const sendOtp = async (email, purpose) => {
  const key = getOtpKey(email, purpose);
  const existing = otpRequests.get(key);
  const now = Date.now();

  if (existing?.pending) {
    return existing.pending;
  }

  if (existing?.sentAt && now - existing.sentAt < otpCooldownMs) {
    return {
      message: "OTP already sent. Please check your email before requesting again.",
      cooldown: true,
    };
  }

  const pending = apiRequest("/api/auth/otp/send", {
    baseUrl: AUTH_URL,
    auth: false,
    method: "POST",
    body: { email, purpose },
  })
    .then((response) => {
      otpRequests.set(key, { sentAt: Date.now() });
      return response;
    })
    .catch((error) => {
      otpRequests.set(key, { sentAt: Date.now() });
      throw error;
    });

  otpRequests.set(key, { pending });
  return pending;
};

export const verifyOtp = (email, otp, purpose) =>
  apiRequest("/api/auth/otp/verify", {
    baseUrl: AUTH_URL,
    auth: false,
    method: "POST",
    body: { email, otp, purpose },
  });

export const sendSignupVerification = ({ email, phone }) =>
  apiRequest("/api/auth/signup-verification/send", {
    baseUrl: AUTH_URL,
    auth: false,
    method: "POST",
    body: { email, phone },
  });

export const verifySignupPhone = (email, phone, code) =>
  apiRequest("/api/auth/signup-verification/verify-phone", {
    baseUrl: AUTH_URL,
    auth: false,
    method: "POST",
    body: { email, phone, code },
  });

export const resetPassword = async (email, otp, newPassword) => {
  const encryptedPassword = await encryptPassword(newPassword);
  return apiRequest("/api/auth/forgot-password", {
    baseUrl: AUTH_URL,
    auth: false,
    method: "POST",
    body: { email, otp, newPassword: encryptedPassword },
  });
};
