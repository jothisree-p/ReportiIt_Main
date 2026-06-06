import { apiRequest } from "./http";

export const reverseGeocode = (latitude, longitude) =>
  apiRequest("/api/locations/reverse-geocode", {
    method: "POST",
    body: { latitude, longitude },
  });
