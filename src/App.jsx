import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import QuestionList from './components/QuestionList';
import QuestionAdd from './components/QuestionAdd';
import QuizList from './components/QuizList';
import QuizCreate from './components/QuizCreate';
import QuizTake from './components/QuizTake';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<h2>Welcome to Quiz App</h2>} />
          <Route path="questions" element={<QuestionList />} />
          <Route path="questions/add" element={<QuestionAdd />} />
          <Route path="quizzes" element={<QuizList />} />
          <Route path="quizzes/create" element={<QuizCreate />} />
          <Route path="quiz/:id" element={<QuizTake />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;