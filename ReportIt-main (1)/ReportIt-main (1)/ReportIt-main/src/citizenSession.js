import { getAuth, getCitizenSession, saveCitizenSession } from "./authStorage";

const DEFAULT_CITIZEN = {
  fullName: "Citizen",
  email: "",
  phone: "",
};

export const getCurrentCitizen = () => {
  const session = getCitizenSession();
  if (session) return session;

  const auth = getAuth();
  if (auth?.role === "CITIZEN") {
    return {
      fullName: auth.fullName,
      email: auth.email,
      phone: "",
      userId: auth.userId,
    };
  }

  return DEFAULT_CITIZEN;
};

export const setCurrentCitizen = (citizen) => {
  const existing = getCitizenSession();
  const sameCitizen =
    existing?.email &&
    citizen?.email &&
    existing.email.trim().toLowerCase() === citizen.email.trim().toLowerCase();

  const nextCitizen = {
    ...(sameCitizen ? existing : {}),
    ...citizen,
    phone: citizen.phone || (sameCitizen ? existing.phone : "") || "",
  };

  saveCitizenSession(nextCitizen);
  return nextCitizen;
};

export const getCitizenName = (citizen = getCurrentCitizen()) =>
  citizen.fullName || citizen.name || DEFAULT_CITIZEN.fullName;

export const getCitizenInitials = (citizen = getCurrentCitizen()) =>
  getCitizenName(citizen).trim().charAt(0).toUpperCase() || "C";

export const getCitizenWelcomeText = (citizen = getCurrentCitizen()) =>
  `Welcome back, ${getCitizenName(citizen)} !`;
