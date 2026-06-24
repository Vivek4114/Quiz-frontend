import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Button,
  Alert,
  Card,
  Container,
  Row,
  Col
} from 'react-bootstrap';
import { quizApi } from '../api/api';

const QuizCreate = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    category: '',
    difficulty: '',
    count: 1,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [fieldErrors, setFieldErrors] = useState({
    title: '',
    category: '',
    difficulty: '',
    count: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let valid = true;
    const errors = { title: '', category: '', difficulty: '', count: '' };

    if (!form.title.trim()) {
      errors.title = 'Quiz title is required.';
      valid = false;
    }
    if (!form.category) {
      errors.category = 'Please select a category.';
      valid = false;
    }
    if (!form.difficulty) {
      errors.difficulty = 'Please select a difficulty level.';
      valid = false;
    }
    if (form.count < 1) {
      errors.count = 'Number of questions must be at least 1.';
      valid = false;
    }

    setFieldErrors(errors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    try {
      const response = await quizApi.post('/quiz/create', {
        title: form.title,
        category: form.category,
        difficulty: form.difficulty,
        count: parseInt(form.count, 10),
      });

      setSuccess(`✅ Quiz "${form.title}" created successfully! (ID: ${response.data.id})`);

      setTimeout(() => {
        navigate('/quizzes');
      }, 2000);
    } catch (err) {
      const backendMsg = err.response?.data || '';
      let userMessage = '⚠️ Failed to create quiz. Please try again.';

      // ✅ Handle "Not enough questions" error gracefully
      if (backendMsg.includes('Not enough questions')) {
        // Try to extract numbers like "Required: 5, found: 0"
        const match = backendMsg.match(/Required: (\d+), found: (\d+)/);
        if (match) {
          const required = match[1];
          const found = match[2];
          userMessage =
            `❌ Not enough questions available for **${form.category}** (${form.difficulty}). ` +
            `You requested **${required}**, but only **${found}** exist. ` +
            `Please reduce the number of questions or add more questions of this category/level.`;
        } else {
          userMessage =
            `❌ Not enough questions available for this category and difficulty. ` +
            `Please reduce the count or add more questions.`;
        }
      } else if (backendMsg) {
        userMessage = backendMsg; // show other backend errors as-is
      }

      setError(userMessage);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={8} md={10}>
          <Card className="shadow border-0">
            <Card.Header className="bg-primary text-white text-center py-3">
              <h2 className="mb-0">🎯 Create Quiz</h2>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Quiz Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter Quiz Title"
                    value={form.title}
                    onChange={handleChange}
                    isInvalid={!!fieldErrors.title}
                  />
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.title}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        isInvalid={!!fieldErrors.category}
                      >
                        <option value="">Select Category</option>
                        <option value="Java">Java</option>
                        <option value="C#">C#</option>
                        <option value="Python">Python</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {fieldErrors.category}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Difficulty Level</Form.Label>
                      <Form.Select
                        name="difficulty"
                        value={form.difficulty}
                        onChange={handleChange}
                        isInvalid={!!fieldErrors.difficulty}
                      >
                        <option value="">Select Level</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {fieldErrors.difficulty}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Number of Questions</Form.Label>
                  <Form.Control
                    type="number"
                    name="count"
                    min="1"
                    value={form.count}
                    onChange={handleChange}
                    isInvalid={!!fieldErrors.count}
                  />
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.count}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" size="lg" type="submit">
                    Create Quiz
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default QuizCreate;