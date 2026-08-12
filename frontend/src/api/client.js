// The fallback keeps local development usable even when a .env file is absent.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("studyos_refresh_token");
  if (!refreshToken) throw new Error("Your session has expired. Please log in again.");
  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST", headers: { Authorization: `Bearer ${refreshToken}` },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error("Your session has expired. Please log in again.");
  localStorage.setItem("studyos_token", data.access_token);
  localStorage.setItem("studyos_refresh_token", data.refresh_token);
  window.dispatchEvent(new CustomEvent("studyos-token-refreshed", { detail: data.access_token }));
  return data.access_token;
}

async function request(path, { method = "GET", token, body, retried = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && !retried && data.msg === "Token has expired") {
    try {
      const accessToken = await refreshAccessToken();
      return request(path, { method, token: accessToken, body, retried: true });
    } catch (error) {
      localStorage.removeItem("studyos_token");
      localStorage.removeItem("studyos_refresh_token");
      window.dispatchEvent(new Event("studyos-session-ended"));
      throw error;
    }
  }
  if (!res.ok) {
    throw new Error(data.error || data.msg || "Request failed");
  }

  return data;
}

export default request;
