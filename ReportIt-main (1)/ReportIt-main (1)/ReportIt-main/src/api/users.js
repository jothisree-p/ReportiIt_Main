import { apiRequest } from "./http";

export const mapUserFromApi = (u) => ({
  id: u.id,
  name: u.fullName,
  fullName: u.fullName,
  email: u.email,
  phone: u.phone || "",
  status: u.status || "Active",
  joined: u.joinedAt || "",
  initials: (u.fullName || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join(""),
});

export const fetchCitizens = async () => {
  const data = await apiRequest("/api/admin/users");
  return data.map(mapUserFromApi);
};

export const updateUserStatus = async (id, status) => {
  const data = await apiRequest(`/api/admin/users/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
  return mapUserFromApi(data);
};

export const deleteUser = async (id) => {
  await apiRequest(`/api/admin/users/${id}`, { method: "DELETE" });
};
