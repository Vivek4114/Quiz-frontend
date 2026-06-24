import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  ProgressBar,
  Container
} from 'react-bootstrap';
import { quizApi, questionApi } from '../api/api';

const QuizTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const progress =
    questions.length > 0
      ? (
          Object.values(selectedAnswers).filter(
            (ans) => ans !== ''
          ).length /
          questions.length
        ) * 100
      : 0;

  useEffect(() => {
    const fetchQuizAndQuestions = async () => {
      try {
        const quizRes = await quizApi.get('/quiz/byid', {
          params: { id }
        });

        const quizData = quizRes.data;
        setQuiz(quizData);

        if (
          !quizData.questionIds ||
          quizData.questionIds.length === 0
        ) {
          setError('No questions available in this quiz.');
          setLoading(false);
          return;
        }

        const responses = await Promise.all(
          quizData.questionIds.map((qId) =>
            questionApi.get('/quetions/getbyid', {
              params: { id: qId }
            })
          )
        );

        const questionData = responses.map(
          (res) => res.data
        );

        setQuestions(questionData);

        const initialAnswers = {};

        questionData.forEach((_, index) => {
          initialAnswers[index] = '';
        });

        setSelectedAnswers(initialAnswers);
      } catch (err) {
        setError(
          err.response?.data ||
            'Failed to load quiz.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuizAndQuestions();
  }, [id]);

  const handleOptionChange = (
    questionIndex,
    optionValue
  ) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const responses = questions.map(
      (_, idx) => selectedAnswers[idx] || ''
    );

    if (responses.includes('')) {
      alert('Please answer all questions.');
      return;
    }

    try {
      const res = await quizApi.post(
        '/quiz/submit',
        responses,
        {
          params: {
            quizId: id
          }
        }
      );

      setScore(res.data);
      setSubmitted(true);
    } catch (err) {
      alert(
        err.response?.data ||
          'Failed to submit quiz.'
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }

  if (!quiz) {
    return (
      <Alert variant="warning">
        Quiz not found.
      </Alert>
    );
  }

  if (submitted) {
    return (
      <Container style={{ maxWidth: '600px' }}>
        <Card className="text-center p-5">
          <h1 className="mb-3">🎉</h1>

          <h2>Quiz Completed!</h2>

          <h3 className="text-success mt-3">
            {score}
          </h3>

          <Button
            variant="primary"
            className="mt-4"
            onClick={() =>
              navigate('/quizzes')
            }
          >
            Back to Quizzes
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container>

      <Card className="mb-4">
        <Card.Body>

          <h2 className="fw-bold">
            {quiz.title}
          </h2>

          <p className="text-muted">
            Category: {quiz.category}
            {' | '}
            Level: {quiz.level}
          </p>

          <ProgressBar
            now={progress}
            label={`${Math.round(progress)}%`}
          />

        </Card.Body>
      </Card>

      <Form onSubmit={handleSubmit}>

        {questions.map((q, index) => (
          <Card
            key={q.id}
            className="mb-4"
          >
            <Card.Body>

              <h5 className="mb-3 text-primary">
                Question {index + 1}
              </h5>

              <h6 className="mb-4">
                {q.quetion}
              </h6>

              {[q.opt1, q.opt2, q.opt3, q.opt4].map(
                (option, idx) => (
                  <Form.Check
                    key={idx}
                    type="radio"
                    className="mb-3"
                    label={option}
                    name={`question-${index}`}
                    checked={
                      selectedAnswers[index] ===
                      option
                    }
                    onChange={() =>
                      handleOptionChange(
                        index,
                        option
                      )
                    }
                  />
                )
              )}

            </Card.Body>
          </Card>
        ))}

        <Button
          variant="success"
          size="lg"
          className="w-100 mb-5"
          type="submit"
        >
          Submit Quiz
        </Button>

      </Form>

    </Container>
  );
};

export default QuizTake;