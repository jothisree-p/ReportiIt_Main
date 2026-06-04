import { API_URL, isUsingViteProxy } from "./config";
import { getAccessToken, clearAuth } from "../authStorage";

const describeTarget = (baseUrl, path) => {
  if (!baseUrl) {
    const port = path.startsWith("/api/auth") ? "8081" : "8082";
    return `Vite proxy → localhost:${port}${path}`;
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
  const { baseUrl = API_URL, auth = true, headers = {}, body, ...rest } = options;

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

  let requestBody = body;
  if (body !== undefined && !(body instanceof FormData) && typeof body !== "string") {
    requestBody = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: requestBody,
    });
  } catch (networkErr) {
    const target = describeTarget(baseUrl, path);
    const hint = isUsingViteProxy
      ? "Start auth-service (8081) and user-management-service (8082), then restart npm run dev."
      : "Start both Spring Boot services, or set VITE_USE_PROXY=true in .env and restart the frontend.";
    throw new ApiError(
      `Cannot reach backend (${target}). ${hint}`,
      0
    );
  }

  if (response.status === 401) {
    clearAuth();
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    let message = (data && data.error) || "Request failed";
    if (response.status === 502 || response.status === 503 || response.status === 504) {
      const port = path.startsWith("/api/auth") ? "8081 (auth-service)" : "8082 (user-management)";
      message = `Backend not running on port ${port}. Start Spring Boot services first.`;
    } else if (response.status === 401) {
      message = "Not logged in or session expired — please log in again.";
    } else if (message === "Request failed" && typeof data === "string" && data.length > 200) {
      message = "Backend not reachable. Start auth-service (8081) and user-management (8082).";
    }
    if (data?.details && typeof data.details === "object") {
      const fields = Object.entries(data.details)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join("; ");
      if (fields) message = fields;
    }
    if (typeof data === "string" && data) message = data;
    throw new ApiError(message, response.status);
  }

  return data;
}
