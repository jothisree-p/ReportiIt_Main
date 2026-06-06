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
  initials: o.initials || (o.name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join(""),
  active: o.activeCases || "0",
  status: o.status || "Active",
  age: o.age || "",
  gender: o.gender || "",
  station: o.station || "",
  department: o.department || "",
  experience: o.experience || "",
  shift: o.shift || "",
  address: o.address || "",
  mapQuery: o.mapQuery || "",
  emergency: o.emergency || "",
  joined: o.joinedDate || "",
  joinedDate: o.joinedDate || "",
});

export const fetchOfficers = async () => {
  const data = await apiRequest("/api/officers");
  return data.map(mapOfficerFromApi);
};

export const createOfficer = async (payload) => {
  const body = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone || "",
    password: payload.password,
    badge: payload.badge,
    position: payload.position,
    zone: payload.zone,
    initials: payload.initials,
    activeCases: payload.active || "0",
    status: payload.status || "Active",
    age: payload.age || "",
    gender: payload.gender || "",
    station: payload.station || "",
    department: payload.department || "",
    experience: payload.experience || "",
    shift: payload.shift || "",
    address: payload.address || "",
    mapQuery: payload.mapQuery || "",
    emergency: payload.emergency || "",
    joinedDate: payload.joinedDate || payload.joined || "",
  };

  const data = await apiRequest("/api/officers", {
    method: "POST",
    body,
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
      age: payload.age,
      gender: payload.gender,
      station: payload.station,
      department: payload.department,
      experience: payload.experience,
      shift: payload.shift,
      address: payload.address,
      mapQuery: payload.mapQuery,
      emergency: payload.emergency,
      joinedDate: payload.joinedDate || payload.joined,
    },
  });
  return mapOfficerFromApi(data);
};

export const deleteOfficer = async (userId) => {
  await apiRequest(`/api/officers/${userId}`, { method: "DELETE" });
};
