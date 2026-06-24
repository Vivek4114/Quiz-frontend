import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
  Badge,
  Container
} from 'react-bootstrap';
import { quizApi } from '../api/api';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await quizApi.get('/quiz/all');
      setQuizzes(res.data);
    } catch (err) {
      setError(
        err.response?.data || 'Failed to load quizzes'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this quiz?')) return;

    try {
      await quizApi.delete('/quiz/delete', {
        params: { quizId: id }
      });

      setQuizzes((prev) =>
        prev.filter((quiz) => quiz.id !== id)
      );
    } catch (err) {
      alert(
        err.response?.data || 'Delete failed'
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

  return (
    <Container>

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2 className="fw-bold">
          🎯 Available Quizzes
        </h2>

        <Badge bg="dark" pill>
          {quizzes.length} Quiz
          {quizzes.length !== 1 ? 'es' : ''}
        </Badge>

      </div>

      {quizzes.length === 0 ? (
        <Alert variant="info">
          No quizzes available.
        </Alert>
      ) : (
        <Row>

          {quizzes.map((quiz) => (
            <Col
              key={quiz.id}
              lg={4}
              md={6}
              className="mb-4"
            >
              <Card
                className="h-100 shadow-sm border-0"
              >
                <Card.Body>

                  <Card.Title className="fw-bold mb-3">
                    🎯 {quiz.title}
                  </Card.Title>

                  <hr />

                  <div className="mb-3">
                    <small className="text-muted">
                      CATEGORY
                    </small>

                    <br />

                    <Badge bg="primary">
                      {quiz.category}
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">
                      LEVEL
                    </small>

                    <br />

                    <Badge bg="success">
                      {quiz.level}
                    </Badge>
                  </div>

                  <div>
                    <small className="text-muted">
                      QUESTIONS
                    </small>

                    <h5 className="mt-1">
                      {quiz.questionIds?.length || 0}
                    </h5>
                  </div>

                </Card.Body>

                <Card.Footer className="bg-white border-0">

                  <div className="d-grid gap-2">

                    <Link
                      to={`/quiz/${quiz.id}`}
                      className="btn btn-success"
                    >
                      Start Quiz
                    </Link>

                    <Button
                      variant="outline-danger"
                      onClick={() =>
                        handleDelete(quiz.id)
                      }
                    >
                      Delete Quiz
                    </Button>

                  </div>

                </Card.Footer>

              </Card>
            </Col>
          ))}

        </Row>
      )}
    </Container>
  );
};

export default QuizList;