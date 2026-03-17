import { apiRequest } from "./api";

export const getQuizById = (quizId) => apiRequest(`/quiz/${quizId}`);

export const submitQuiz = (quizId, answers) =>
  apiRequest("/results/submit", {
    method: "POST",
    body: { quizId, answers },
  });
