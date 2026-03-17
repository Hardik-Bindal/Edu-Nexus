import { getToken } from "./session";

export const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"
).replace(/\/$/, "");

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return response.json();
  return response.text();
};

export const apiRequest = async (
  path,
  { method = "GET", body, auth = true, headers = {} } = {}
) => {
  const finalHeaders = { ...headers };

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  let payload = body;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (body && !isFormData) {
    finalHeaders["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: finalHeaders,
    body: payload,
  });

  const data = await parseResponse(response);
  if (!response.ok) {
    const message =
      (typeof data === "object" && (data.message || data.error)) ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
};

