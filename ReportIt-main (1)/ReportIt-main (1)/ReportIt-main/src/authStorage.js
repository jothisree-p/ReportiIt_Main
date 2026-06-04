const AUTH_KEY = "reportit_auth";
const CITIZEN_KEY = "currentCitizen";
const OFFICER_KEY = "currentOfficer";

export const saveAuth = (authResponse) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(authResponse));
};

export const getAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  } catch {
    return null;
  }
};

export const getAccessToken = () => getAuth()?.accessToken || null;

export const getRole = () => getAuth()?.role || null;

export const isAuthenticated = () => Boolean(getAccessToken());

export const clearAuth = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(CITIZEN_KEY);
  localStorage.removeItem(OFFICER_KEY);
};

export const saveCitizenSession = (citizen) => {
  localStorage.setItem(CITIZEN_KEY, JSON.stringify(citizen));
};

export const getCitizenSession = () => {
  try {
    return JSON.parse(localStorage.getItem(CITIZEN_KEY));
  } catch {
    return null;
  }
};

export const saveOfficerSession = (officer) => {
  localStorage.setItem(OFFICER_KEY, JSON.stringify(officer));
};

export const getOfficerSession = () => {
  try {
    return JSON.parse(localStorage.getItem(OFFICER_KEY));
  } catch {
    return null;
  }
};
