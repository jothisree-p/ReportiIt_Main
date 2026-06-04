import { apiRequest } from "./http";

export const mapOfficerFromApi = (o) => ({
  id: o.userId,
  userId: o.userId,
  name: o.name,
  email: o.email,
  phone: o.phone || "",
  badge: o.badge || "",
  position: o.position || "Officer",
  zone: o.zone || "",
  initials: o.initials || "",
  active: o.activeCases || "",
  status: o.status || "Active",
});

export const fetchOfficers = async () => {
  const data = await apiRequest("/api/officers");
  return data.map(mapOfficerFromApi);
};

export const createOfficer = async (payload) => {
  const data = await apiRequest("/api/officers", {
    method: "POST",
    body: {
      name: payload.name,
      email: payload.email,
      phone: payload.phone || "",
      password: payload.password,
      badge: payload.badge,
      position: payload.position,
      zone: payload.zone,
      initials: payload.initials,
      activeCases: payload.active,
      status: payload.status || "Active",
    },
  });
  return mapOfficerFromApi(data);
};

export const updateOfficer = async (userId, payload) => {
  const data = await apiRequest(`/api/officers/${userId}`, {
    method: "PUT",
    body: {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      badge: payload.badge,
      position: payload.position,
      zone: payload.zone,
      initials: payload.initials,
      activeCases: payload.active,
      status: payload.status,
    },
  });
  return mapOfficerFromApi(data);
};

export const deleteOfficer = async (userId) => {
  await apiRequest(`/api/officers/${userId}`, { method: "DELETE" });
};
