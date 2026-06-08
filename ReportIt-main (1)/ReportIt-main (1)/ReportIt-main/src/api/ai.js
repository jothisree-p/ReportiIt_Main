import { apiRequest } from "./http";

export const fetchAiHistory = async () => {
  return apiRequest("/api/ai/history");
};

export const sendAiMessage = async (message) => {
  const data = await apiRequest("/api/ai/chat", {
    method: "POST",
    body: { message },
  });
  return data.reply || "I could not find a database answer for that.";
};
