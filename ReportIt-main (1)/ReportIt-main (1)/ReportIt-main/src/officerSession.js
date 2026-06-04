import { fetchOfficers } from "./api/officers";
import { getAuth, getOfficerSession, saveOfficerSession } from "./authStorage";

const DEFAULT_OFFICER = {
  initials: "OF",
  name: "Officer",
  position: "Inspector",
  email: "",
};

const KNOWN_POSITIONS = [
  "Deputy Superintendent",
  "Assistant Commissioner",
  "Sub Inspector",
  "Head Constable",
  "Inspector",
  "Officer",
  "Constable",
];

/** First letter of the officer name, with email as a fallback. */
export const getOfficerEmailInitial = (officer = getCurrentOfficer()) => {
  const name = getOfficerDisplayName(officer).trim();
  if (name) return name.charAt(0).toUpperCase();

  const email = (officer?.email || "").trim();
  if (!email) return "O";
  return email.charAt(0).toUpperCase();
};

export const getOfficerInitials = (officer = getCurrentOfficer()) => {
  if (officer?.initials) return officer.initials;
  return getOfficerEmailInitial(officer);
};

export const getOfficerDisplayName = (officer = {}) => {
  const rawName = (officer.name || DEFAULT_OFFICER.name).trim();
  const position = getOfficerPosition(officer);

  if (rawName.toLowerCase().startsWith(position.toLowerCase())) {
    return rawName.slice(position.length).trim() || rawName;
  }

  return rawName;
};

export const getOfficerPosition = (officer = {}) => {
  const explicitPosition = (officer.position || officer.rank || "").trim();
  if (explicitPosition) return explicitPosition;

  const rawName = (officer.name || "").trim();
  const matchedPosition = KNOWN_POSITIONS.find((position) =>
    rawName.toLowerCase().startsWith(position.toLowerCase())
  );

  return matchedPosition || DEFAULT_OFFICER.position;
};

export const getOfficerWelcomeText = (officer = getCurrentOfficer()) =>
  `Welcome back, ${getOfficerPosition(officer)} ${getOfficerDisplayName(officer)} !`;

export const getCurrentOfficer = () => {
  const storedOfficer = getOfficerSession();
  if (storedOfficer) return storedOfficer;

  const auth = getAuth();
  if (auth?.role === "OFFICER") {
    return {
      id: auth.userId,
      userId: auth.userId,
      name: auth.fullName,
      email: auth.email,
      position: "Officer",
    };
  }

  return DEFAULT_OFFICER;
};

export const setCurrentOfficerByEmail = async (email) => {
  const officers = await fetchOfficers();
  const normalizedEmail = email.trim().toLowerCase();

  const matchedOfficer = officers.find(
    (officer) => officer.email?.trim().toLowerCase() === normalizedEmail
  );

  if (!matchedOfficer) return null;

  saveOfficerSession({
    ...matchedOfficer,
    name: getOfficerDisplayName(matchedOfficer),
    rank: getOfficerPosition(matchedOfficer),
  });

  return matchedOfficer;
};

export const setCurrentOfficer = (officer) => {
  saveOfficerSession(officer);
  return officer;
};
