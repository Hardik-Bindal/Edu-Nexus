import { apiRequest } from "./api";

export const getMaterials = () => apiRequest("/materials");

export const uploadMaterial = (payload) =>
  apiRequest("/materials", {
    method: "POST",
    body: payload,
  });

export const requestMaterial = (topic) =>
  apiRequest("/materials/request", {
    method: "POST",
    body: { topic },
  });

