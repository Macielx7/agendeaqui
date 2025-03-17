'use client';

import { Nav, Navbar, Container, Image } from 'react-bootstrap';
import Link from 'next/link';
import styles from './menuNavegacao.module.css'; // Importando o arquivo CSS

export default function MenuNavegacao() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className={styles.navbar}>
      <Container>
        {/* Adicionando a logo */}
        <Navbar.Brand href="/home" className={styles.brandContainer}>
          <Image
            src="/logo.png" // Caminho da logo
            alt="Logo da Empresa"
            width={50} // Tamanho da logo
            height={50} // Tamanho da logo
            className={styles.logo}
          />
          <span className={styles.brandText}>Agenda Facil</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto"> {/* Alinhar os links à direita */}
            <Nav.Link as={Link} href="/agendar" className={styles.navLink}>Agendar</Nav.Link>
            <Nav.Link as={Link} href="/meus-agendamentos" className={styles.navLink}>Meus Agendamentos</Nav.Link>
            <Nav.Link as={Link} href="/configuracoes" className={styles.navLink}>Configurações</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}