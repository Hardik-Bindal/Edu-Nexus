import { apiRequest } from "./api";

export const getNews = () => apiRequest("/news");

export const fetchFreshNews = () => apiRequest("/news/fetch");

