'use client';

import { Nav, Navbar, Container, Form, InputGroup, Dropdown, Badge, Button } from 'react-bootstrap';
import { Bell, Search, PersonCircle, List, Grid, Calendar, Gear, People } from 'react-bootstrap-icons';
import { useState, useEffect } from 'react';
import styles from './MenuNavegacao.module.css';
import { usePathname } from 'next/navigation';
import { IoIosArrowDown } from 'react-icons/io';


export default function MenuNavegacao({ activeRoute = '/dashboard', collapsed, setCollapsed }) {
  const pathname = usePathname();
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [chatbotOpen, setChatbotOpen] = useState(false);

  useEffect(() => {
    const usuario = sessionStorage.getItem('usuario');
    if (usuario) {
      const dados = JSON.parse(usuario);
      setNomeUsuario(dados.nome);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('usuario');
    window.location.href = '/login';
  };

  const menuItems = [
    { path: '/dashboard', icon: <Grid size={20} />, label: 'Dashboard' },
    { path: '/agenda', icon: <Calendar size={20} />, label: 'Agenda' },
    { path: '/colaboradores', icon: <People size={20} />, label: 'Colaboradores' },
    { path: '/clientes', icon: <People size={20} />, label: 'Clientes' },
    {
      label: 'Chatbot', icon: <Gear size={20} />, isDropdown: true, items: [
        { path: '/chatbot', label: 'Lista de chatbots' },
        { path: '/chatbot/bases', label: 'Bases de conhecimento' },
        { path: '/chatbot/conversas', label: 'Conversas' },
        { path: '/chatbot/fluxos', label: 'Mapa de fluxos' },
      ]
    },
    { path: '/configuracoes', icon: <Gear size={20} />, label: 'Configurações' }
  ];

  return (
    <>
      {/* Cabeçalho */}
      <div
        className="d-flex position-fixed top-0 bg-white shadow-sm z-3"
        style={{
          height: '80px',
          left: collapsed ? '70px' : '170px',
          width: collapsed ? 'calc(100% - 60px)' : 'calc(100% - 170px)',
          transition: 'left 0.3s ease, width 0.3s ease'
        }}
      >
        <Navbar expand="lg" className="flex-grow-1 h-100 bg-white p-0">
          <Container fluid className="h-100 px-3">
            <div className="d-flex align-items-center h-100 w-100">
              <Button
                variant="light"
                className="p-2 me-2 border-0"
                onClick={() => setCollapsed(!collapsed)}
              >
                <List size={24} />
              </Button>

              <Form className="flex-grow-1 mx-3" style={{ maxWidth: '600px' }}>
                <InputGroup>
                  <InputGroup.Text className="bg-transparent border-end-0 pe-1">
                    <Search />
                  </InputGroup.Text>
                  <Form.Control
                    type="search"
                    placeholder="Pesquisar..."
                    className="border-start-0 bg-light"
                  />
                </InputGroup>
              </Form>

              <div className="d-flex align-items-center ms-auto">
                <Dropdown className="me-3">
                  <Dropdown.Toggle variant="light" className="p-2 border-0 position-relative">
                    <Bell size={20} />
                    <Badge pill bg="danger" className="position-absolute top-0 end-0 translate-middle" style={{ fontSize: '0.6rem' }}>
                      3
                    </Badge>
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    <Dropdown.Item href="#">Nova mensagem</Dropdown.Item>
                    <Dropdown.Item href="#">Atualização do sistema</Dropdown.Item>
                    <Dropdown.Item href="#">Novo agendamento</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown>
                  <Dropdown.Toggle variant="light" className="d-flex align-items-center gap-2 p-1 border-0">
                    <PersonCircle size={32} style={{ color: '#4e73df' }} />
                    {!collapsed && <span className="fw-semibold text-dark">{nomeUsuario}</span>}
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    <Dropdown.Item href="#">Meu perfil</Dropdown.Item>
                    <Dropdown.Item href="#">Configurações</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>Sair</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </Container>
        </Navbar>
      </div>

      {/* Menu Lateral */}
      <div
        className={`position-fixed start-0 top-0 bottom-0 bg-white shadow-sm z-3 ${collapsed ? 'w-60px' : 'w-250px'}`}
        style={{
          transition: 'width 0.3s ease',
          overflowY: 'auto'
        }}
      >
        {/* Logo */}
        <div className="bg-dark d-flex align-items-center justify-content-center text-warning bg-primary" style={{ height: '80px', flexShrink: 0 }}>
          {!collapsed ? (
            <div className="text-center ps-3 pe-3">
              <h1 className="fs-4 fw-bold mb-1">AgendaFlow</h1>
              <div className="fs-6 opacity-80">Gestor</div>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="fs-5 fw-bold">AF</h1>
            </div>
          )}
        </div>

        {/* Itens do menu */}
        <Nav className="flex-column pt-3 p-1">
          {menuItems.map((item) => {
            if (!item.isDropdown) {
              return (
                <a
                  key={item.path}
                  href={item.path}
                  className={`${styles.menuItem} ${pathname === item.path ? styles.menuItemActive : ''}`}
                >
                  <span className="me-2">{item.icon}</span>
                  {!collapsed && <span className="text-truncate">{item.label}</span>}
                </a>
              );
            }

            // Item dropdown (ex: Chatbot)
            return (
              <div key={item.label}>
                <div
                  onClick={() => setChatbotOpen(!chatbotOpen)}
                  className={`${styles.menuItem} d-flex justify-content-between align-items-center ${pathname.startsWith('/chatbot') ? styles.menuItemActive : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center">
                    <span className="me-2">{item.icon}</span>
                    {!collapsed && <span className="text-truncate">{item.label}</span>}
                  </div>
                  {!collapsed && (
                    <IoIosArrowDown
                      size={16}
                      className={`${styles.arrowIcon} ${chatbotOpen ? styles.arrowOpen : ''}`}
                    />
                  )}

                </div>

                {!collapsed && chatbotOpen && (
                  <div className={styles.submenuContainer}>
                    {item.items.map((subItem) => (
                      <a
                        key={subItem.path}
                        href={subItem.path}
                        className={`${styles.submenuItem} ${pathname === subItem.path ? styles.menuItemActive : ''}`}
                      >
                        {subItem.label}
                      </a>
                    ))}
                  </div>

                )}
              </div>
            );
          })}
        </Nav>
      </div>

      {/* Conteúdo Principal */}
      <div
        className={`${collapsed ? 'ps-60px' : 'ps-250px'}`}
        style={{
          paddingTop: '80px',
          transition: 'padding-left 0.3s ease',
          backgroundColor: 'transparent',
        }}
      >
        {/* Conteúdo */}
      </div>
    </>
  );
}
