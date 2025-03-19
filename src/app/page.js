'use client'
import React from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const AgendeaquiPage = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
        <Container>
          <Navbar.Brand href="#">agendeaqui</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/">HOME</Nav.Link>
              <Nav.Link href="#sobre">SOBRE</Nav.Link>
              <Nav.Link href="#funcoes">FUNÇÕES</Nav.Link>
              <Nav.Link href="#precos">PREÇOS</Nav.Link>
              <Nav.Link href="#blog">BLOG</Nav.Link>
              <Nav.Link href="/login">ACESSAR</Nav.Link>
              <Button variant="warning" className="ms-2">TESTE GRÁTIS</Button>
              <Button variant="warning" className="ms-2">SOU CLIENTE</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div className="hero bg-dark text-white text-center py-5" style={{ backgroundImage: "url('/path-to-your-image.jpg')", backgroundSize: "cover" }}>
        <Container>
          <h1>Agendeaqui</h1>
          <p>Uma nova experiência para uma antiga tradição.</p>
          <Button variant="warning" size="lg">INICIE ESSA EXPERIÊNCIA</Button>
          <div className="mt-3">
           
          </div>
        </Container>
      </div>

      {/* Sobre Section */}
      <Container className="my-5" id="sobre">
        <h2 className="text-center">Sobre o Agendeaqui</h2>
        <p className="text-center">
          O Agendeaqui é um sistema de gestão on-line que permite agendamentos de horários...
        </p>
      </Container>
    </>
  );
};

export default AgendeaquiPage;