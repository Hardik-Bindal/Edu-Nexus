import { apiRequest } from "./api";

export const getDailyFact = () => apiRequest("/facts", { auth: false });

export const addDailyFact = (payload) =>
  apiRequest("/facts", {
    method: "POST",
    body: payload,
  });

