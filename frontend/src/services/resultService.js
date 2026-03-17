import { apiRequest } from "./api";

export const getResultById = (resultId) =>
  apiRequest(`/results/detail/${resultId}`);

export const getResultsByQuiz = (quizId) => apiRequest(`/results/${quizId}`);

export const getMyResults = () => apiRequest("/results/my");

export const reviewResult = (resultId, updates) =>
  apiRequest("/results/review", {
    method: "PUT",
    body: { resultId, updates },
  });
