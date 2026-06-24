import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Button,
  Alert,
  Card,
  Row,
  Col,
  Container
} from 'react-bootstrap';
import { questionApi } from '../api/api';

const QuestionAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    quetion: '',
    opt1: '',
    opt2: '',
    opt3: '',
    opt4: '',
    correctAns: 1,
    cateogary: '',
    level: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    const payload = {
      ...formData,
      correctAns: parseInt(formData.correctAns, 10),
    };

    try {
      await questionApi.post('/quetions/add', payload);

      setSuccess('Question Added Successfully!');

      setFormData({
        quetion: '',
        opt1: '',
        opt2: '',
        opt3: '',
        opt4: '',
        correctAns: 1,
        cateogary: '',
        level: '',
      });

      setTimeout(() => {
        navigate('/questions');
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data ||
        'Failed to add question'
      );
    }
  };

  return (
    <Container className="py-4">

      <Row className="justify-content-center">

        <Col lg={10}>

          <Card className="shadow border-0">

            <Card.Header className="bg-success text-white text-center py-3">
              <h2 className="mb-0">
                ➕ Add New Question
              </h2>
            </Card.Header>

            <Card.Body className="p-4">

              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success">
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-4">
                  <Form.Label>
                    Question
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="quetion"
                    placeholder="Enter Question"
                    value={formData.quetion}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Option 1
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="opt1"
                        placeholder="Enter Option 1"
                        value={formData.opt1}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Option 2
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="opt2"
                        placeholder="Enter Option 2"
                        value={formData.opt2}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Option 3
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="opt3"
                        placeholder="Enter Option 3"
                        value={formData.opt3}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Option 4
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="opt4"
                        placeholder="Enter Option 4"
                        value={formData.opt4}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                </Row>

                <Row>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Correct Answer
                      </Form.Label>

                      <Form.Select
                        name="correctAns"
                        value={formData.correctAns}
                        onChange={handleChange}
                      >
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                        <option value="3">Option 3</option>
                        <option value="4">Option 4</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Category
                      </Form.Label>

                      <Form.Select
                        name="cateogary"
                        value={formData.cateogary}
                        onChange={handleChange}
                        required
                      >
                        <option value="">
                          Select Category
                        </option>

                        <option value="Java">
                          Java
                        </option>

                        <option value="Python">
                          Python
                        </option>

                        <option value="C#">
                          C#
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Level
                      </Form.Label>

                      <Form.Select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        required
                      >
                        <option value="">
                          Select Level
                        </option>

                        <option value="Easy">
                          Easy
                        </option>

                        <option value="Medium">
                          Medium
                        </option>

                        <option value="Hard">
                          Hard
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                </Row>

                <div className="d-grid mt-4">

                  <Button
                    variant="success"
                    size="lg"
                    type="submit"
                  >
                    Add Question
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

export default QuestionAdd;