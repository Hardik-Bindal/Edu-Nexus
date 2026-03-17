import { apiRequest } from "./api";

export const getQuizzes = () => apiRequest("/quiz");

export const getQuizById = (quizId) => apiRequest(`/quiz/${quizId}`);

export const getLeaderboard = () => apiRequest("/leaderboard");

export const createQuiz = (quizData) =>
  apiRequest("/quiz/create", {
    method: "POST",
    body: quizData,
  });

export const createQuizWithAI = (payload) =>
  apiRequest("/quiz/ai", {
    method: "POST",
    body: payload,
  });

export const updateQuiz = (quizId, quizData) =>
  apiRequest(`/quiz/${quizId}`, {
    method: "PUT",
    body: quizData,
  });

export const deleteQuiz = (quizId) =>
  apiRequest(`/quiz/${quizId}`, {
    method: "DELETE",
  });
