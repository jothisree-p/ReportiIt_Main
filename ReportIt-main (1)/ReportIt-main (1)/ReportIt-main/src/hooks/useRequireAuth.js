import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken, getRole } from "../authStorage";

const loginRoutes = {
  CITIZEN: "/citizen-login",
  OFFICER: "/officer-login",
  ADMIN: "/admin-login",
};

export const useRequireAuth = (requiredRole) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      const route = loginRoutes[requiredRole] || "/citizen-login";
      navigate(route, { replace: true });
      return;
    }
    if (requiredRole) {
      const role = getRole();
      if (role && role.toUpperCase() !== requiredRole.toUpperCase()) {
        navigate(loginRoutes[role] || "/citizen-login", { replace: true });
      }
    }
  }, [navigate, requiredRole]);
};
