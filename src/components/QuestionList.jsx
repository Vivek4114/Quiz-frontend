import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionApi } from '../api/api';
import {
  Table,
  Button,
  Spinner,
  Alert,
  Badge,
  Card,
  Form,
  Row,
  Col
} from 'react-bootstrap';

const QuestionList = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filterCategory, setFilterCategory] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  const fetchQuestions = async () => {
    try {
      const res = await questionApi.get('/quetions/all');
      setQuestions(res.data);
      setFilteredQuestions(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    let result = questions;
    if (filterCategory) {
      result = result.filter(q => q.cateogary === filterCategory);
    }
    if (filterLevel) {
      result = result.filter(q => q.level === filterLevel);
    }
    setFilteredQuestions(result);
  }, [questions, filterCategory, filterLevel]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await questionApi.delete('/quetions/delete', { params: { id } });
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data || 'Delete failed');
    }
  };

  // ✅ Unique categories from data, excluding ".NET" if any
  const uniqueCategories = [...new Set(questions.map(q => q.cateogary))]
    .filter(cat => cat !== '.NET'); // <-- remove .NET from dynamic set

  // ✅ Static categories (without .NET)
  const staticCategories = ['Java', 'C#', 'Python']; // .NET removed

  // ✅ Combine and remove duplicates
  const allCategories = [...new Set([...staticCategories, ...uniqueCategories])];

  const uniqueLevels = [...new Set(questions.map(q => q.level))];

  const clearFilters = () => {
    setFilterCategory('');
    setFilterLevel('');
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="page-title">📚 Question Bank</h2>
        <Button variant="success" onClick={() => navigate('/questions/add')}>
          ➕ Add New Question
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {allCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Level</Form.Label>
                <Form.Select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                >
                  <option value="">All Levels</option>
                  {uniqueLevels.map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Button variant="secondary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Table */}
      {filteredQuestions.length === 0 ? (
        <Alert variant="info">No questions match the filters.</Alert>
      ) : (
        <Card>
          <Card.Body>
            <Table hover responsive className="align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Question</th>
                  <th>Category</th>
                  <th>Level</th>
                  <th>Options</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map((q) => (
                  <tr key={q.id}>
                    <td>{q.id}</td>
                    <td><strong>{q.quetion}</strong></td>
                    <td><Badge bg="primary">{q.cateogary}</Badge></td>
                    <td><Badge bg="success">{q.level}</Badge></td>
                    <td>
                      <small>
                        1. {q.opt1}<br/>
                        2. {q.opt2}<br/>
                        3. {q.opt3}<br/>
                        4. {q.opt4}
                      </small>
                    </td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(q.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default QuestionList;