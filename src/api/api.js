import axios from "axios";

export const questionApi = axios.create({
  baseURL: "https://question-service-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export const quizApi = axios.create({
  baseURL: "https://YOUR-QUIZ-SERVICE.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});