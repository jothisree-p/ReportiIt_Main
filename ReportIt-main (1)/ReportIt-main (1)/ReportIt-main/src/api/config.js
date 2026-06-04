/**
 * API base URLs
 *
 * Development (recommended): VITE_USE_PROXY=true
 *   Browser → Vite (5173) → proxy → 8081 (auth) / 8082 (API)
 *   Avoids CORS issues. Postman still uses http://localhost:8081 directly.
 *
 * Direct mode: VITE_USE_PROXY=false and set VITE_AUTH_URL / VITE_API_URL
 *   Browser calls 8081/8082 directly — backend CORS must allow your frontend origin.
 */
const useProxy =
  import.meta.env.VITE_USE_PROXY === "true" ||
  (import.meta.env.DEV &&
    import.meta.env.VITE_USE_PROXY !== "false" &&
    !import.meta.env.VITE_AUTH_URL?.trim());

export const AUTH_URL = useProxy
  ? ""
  : import.meta.env.VITE_AUTH_URL?.trim() || "http://localhost:8081";

export const API_URL = useProxy
  ? ""
  : import.meta.env.VITE_API_URL?.trim() || "http://localhost:8082";

export const isUsingViteProxy = useProxy;
