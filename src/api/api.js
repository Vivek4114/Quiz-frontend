import axios from 'axios';

const QUESTION_API_BASE = 'http://localhost:8082';
const QUIZ_API_BASE = 'http://localhost:8088';

export const questionApi = axios.create({
  baseURL: QUESTION_API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const quizApi = axios.create({
  baseURL: QUIZ_API_BASE,
  headers: { 'Content-Type': 'application/json' },
});