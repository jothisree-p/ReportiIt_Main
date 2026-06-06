import axios from "axios";
import { API_URL, isUsingViteProxy } from "./config";
import { getAccessToken, clearAuth } from "../authStorage";

const describeTarget = (baseUrl, path) => {
  if (!baseUrl) {
    const port = path.startsWith("/api/auth") ? "8081" : "8082";
    return `Vite proxy -> localhost:${port}${path}`;
  }
  return `${baseUrl}${path}`;
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function apiRequest(path, options = {}) {
  const {
    baseUrl = API_URL,
    auth = true,
    headers = {},
    body,
    method = "GET",
    ...rest
  } = options;

  const finalHeaders = { ...headers };

  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getAccessToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await axios({
      url: `${baseUrl}${path}`,
      method,
      headers: finalHeaders,
      data: body,
      ...rest,
    });

    return response.data;
  } catch (err) {
    const status = err.response?.status || 0;
    const data = err.response?.data;

    if (status === 401) {
      clearAuth();
    }

    if (!err.response) {
      const target = describeTarget(baseUrl, path);
      const hint = isUsingViteProxy
        ? "Start auth-service (8081) and user-management-service (8082), then restart npm run dev."
        : "Start both Spring Boot services, or set VITE_USE_PROXY=true in .env and restart the frontend.";
      throw new ApiError(`Cannot reach backend (${target}). ${hint}`, 0);
    }

    let message =
      data?.error ||
      (typeof data === "string" ? data : "") ||
      err.message ||
      "Request failed";

    if ((status === 502 || status === 503 || status === 504) && !data?.error) {
      const port = path.startsWith("/api/auth")
        ? "8081 (auth-service)"
        : "8082 (user-management)";
      message = `Backend not running on port ${port}. Start Spring Boot services first.`;
    } else if (status === 401) {
      message = "Not logged in or session expired - please log in again.";
    } else if (message === "Request failed" && typeof data === "string" && data.length > 200) {
      message = "Backend not reachable. Start auth-service (8081) and user-management (8082).";
    }

    if (data?.details && typeof data.details === "object") {
      const fields = Object.entries(data.details)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join("; ");
      if (fields) message = fields;
    }

    throw new ApiError(message, status);
  }
}
