import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const footerStyle = {
  backgroundColor: '#2C3E50',
  color: '#fff',
  paddingTop: '15px',
  paddingBottom: '15px',
};

const listStyle = {
  display: 'flex',
  listStyle: 'none',
  justifyContent: 'center',
  padding: '0',
  color: 'white',
};

const linkStyle = {
  color: 'white',
  padding: '5px 15px',
  borderRadius: '5px',
  marginRight: '10px',
  textDecoration: 'none',
};

const listItemStyle = {
  margin: '0 10px',
};

const Footer = () => {
  return (
    <footer id="footer" style={footerStyle}>
      <Container>
        <Row className="align-items-center">
          <Col xs={12} sm={6}>
            <a style={linkStyle} href="http://www.76east.com/" target="_blank" rel="noopener" title="76East">
              76East.com
            </a>{' '}
            © 2010 . All Rights Reserved.
          </Col>
          <Col xs={12} sm={6}>
            <ul style={listStyle}>
              <li style={listItemStyle}>
                <a href="http://www.76east.com/index.php" style={linkStyle}>
                  Home
                </a>
              </li>
              <li style={listItemStyle}>
                <a href="http://www.76east.com/about-us.php" style={linkStyle}>
                  About Us
                </a>
              </li>
              <li style={listItemStyle}>
                <a href="http://www.76east.com/services.php" style={linkStyle}>
                  Services
                </a>
              </li>
              <li style={listItemStyle}>
                <a href="http://www.76east.com/contact-us.php" style={linkStyle}>
                  Contact Us
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
