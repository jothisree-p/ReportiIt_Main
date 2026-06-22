import { apiRequest } from "./http";

export const sendContactMessage = (payload) =>
  apiRequest("/api/contact/messages", {
    method: "POST",
    body: payload,
    auth: false,
  });
