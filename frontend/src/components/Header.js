import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import LoginButton from '../AuthComponents/LoginButton';
import LogoutButton from '../AuthComponents/LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';

const headerStyle = {
  position: 'relative',
  zIndex: 1000,
  maxHeight: 'auto',
  height: 'auto',
  backgroundColor: '#0C2E42',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: '6%',
};

const linkStyle = {
  color: 'white',
  padding: '5px 15px',
  borderRadius: '5px',
  marginRight: '10px',
  textDecoration: 'none',
  backgroundColor: '#0C2E42',
};

const currentLinkStyle = {
  ...linkStyle,
  backgroundColor: 'black',
};

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth0();

  return (
    <Navbar style={headerStyle} expand="lg">
      <Navbar.Brand>
        <Link to="/">
          <img src="/logo192.png" alt="Logo" height="40" width="auto" />
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" style={{ justifyContent: 'right', marginRight: '10%' }}>
        <Nav className="ml-auto">
          {isAuthenticated && (
            <>
            <Link to="/chat" style={location.pathname === '/chat' ? currentLinkStyle : linkStyle}>
            Chat
          </Link>
          <Link
            to="/image-generation"
            style={location.pathname === '/image-generation' ? currentLinkStyle : linkStyle}
          >
            Text-To-Image
          </Link>
          <Link to="/video" style={location.pathname === '/video' ? currentLinkStyle : linkStyle}>
            Video-To-Text
          </Link>
          <Link to="/speech" style={location.pathname === '/speech' ? currentLinkStyle : linkStyle} >
            Speech-To-Text
          </Link>          
          <Link
            to="/lingocraft"
            style={location.pathname === '/lingocraft' ? currentLinkStyle : linkStyle}
          >
            LingoCraft
          </Link>
          <Link
            to="/convert-to-pdf"
            style={
              location.pathname === '/convert-to-pdf' ||
              location.pathname === '/split-pdf' ||
              location.pathname === '/merge-pdf'
                ? currentLinkStyle
                : linkStyle
            }
          >
            PDF
          </Link>
          </>
            )}
          <Link
            to="/features"
            style={location.pathname === '/features' ? currentLinkStyle : linkStyle}
          >
            Features
          </Link>
        </Nav>
        {isAuthenticated ? (
          <NavDropdown title="Account" id="collasible-nav-dropdown">
            <NavDropdown.Item onClick={() => logout({ returnTo: window.location.origin })}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        ) : (
          <LoginButton />
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
