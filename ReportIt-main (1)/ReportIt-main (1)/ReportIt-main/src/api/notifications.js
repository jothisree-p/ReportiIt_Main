import { apiRequest } from "./http";

export const mapNotificationFromApi = (n) => ({
  id: n.id,
  title: n.title,
  message: n.message,
  time: n.createdAt,
  isRead: n.isRead,
});

export const fetchMyNotifications = async () => {
  const data = await apiRequest("/api/notifications/me");
  return data.map(mapNotificationFromApi);
};

export const createNotification = async (userId, title, message) => {
  const data = await apiRequest("/api/notifications", {
    method: "POST",
    body: { userId, title, message },
  });
  return mapNotificationFromApi(data);
};
