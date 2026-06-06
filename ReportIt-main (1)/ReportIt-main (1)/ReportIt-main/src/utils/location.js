import { reverseGeocode } from "../api/locations";

const CHENNAI = { lat: 13.0827, lon: 80.2707 };

export const fetchAddressFromCoords = async (latitude, longitude) => {
  try {
    const data = await reverseGeocode(latitude, longitude);
    return data.displayName || `${latitude}, ${longitude}`;
  } catch {
    return `${latitude}, ${longitude}`;
  }
};

export const geocodePlace = async (query) => {
  const trimmed = (query || "").trim();
  if (!trimmed) return CHENNAI;

  const coordMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (coordMatch) {
    return { lat: coordMatch[1], lon: coordMatch[2] };
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(trimmed)}`,
      { headers: { Accept: "application/json" } }
    );
    const data = await response.json();
    if (data?.[0]) {
      return { lat: data[0].lat, lon: data[0].lon };
    }
  } catch {
    /* fall through */
  }

  return CHENNAI;
};

/** Works in VS / Edge embedded browsers (Google embed is often blocked). */
export const buildOsmMapEmbedUrl = (lat, lon) => {
  const la = parseFloat(lat) || CHENNAI.lat;
  const lo = parseFloat(lon) || CHENNAI.lon;
  const delta = 0.02;
  const bbox = `${lo - delta},${la - delta},${lo + delta},${la + delta}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox
  )}&layer=mapnik&marker=${la}%2C${lo}`;
};

export const buildMapEmbedUrl = (query) => {
  const q = encodeURIComponent(query || "Chennai, India");
  return `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
};

export const resolveMapEmbedUrl = async (query) => {
  const { lat, lon } = await geocodePlace(query);
  return buildOsmMapEmbedUrl(lat, lon);
};
