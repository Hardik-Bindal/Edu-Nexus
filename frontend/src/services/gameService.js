import { apiRequest } from "./api";

export const getDailyGame = () => apiRequest("/games/daily");

