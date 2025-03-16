// app/components/MenuNavegacao.js

'use client';

import { Nav, Navbar, Container } from 'react-bootstrap';
import Link from 'next/link';
import styles from './menuNavegacao.module.css'; // Importando o arquivo CSS

export default function MenuNavegacao() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className={styles.navbar}>
      <Container>
        <Navbar.Brand href="#">Agenda Facil</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/agendar">Agendar</Nav.Link>
            <Nav.Link as={Link} href="/meus-agendamentos">Meus Agendamentos</Nav.Link>
            <Nav.Link as={Link} href="/configuracoes">Configurações</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
