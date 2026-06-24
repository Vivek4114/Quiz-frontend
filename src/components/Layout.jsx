import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';

const Layout = () => {
  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        sticky="top"
      >
        <Container>

          <Navbar.Brand as={Link} to="/">
            🎯 Quiz Management
          </Navbar.Brand>

          <Navbar.Toggle />

          <Navbar.Collapse>

            <Nav className="ms-auto">

              <Nav.Link as={Link} to="/questions">
                Questions
              </Nav.Link>

              <Nav.Link as={Link} to="/questions/add">
                Add Question
              </Nav.Link>

              <Nav.Link as={Link} to="/quizzes">
                Quizzes
              </Nav.Link>

              <Nav.Link as={Link} to="/quizzes/create">
                Create Quiz
              </Nav.Link>

            </Nav>

          </Navbar.Collapse>

        </Container>
      </Navbar>

      <Container className="py-4">
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;