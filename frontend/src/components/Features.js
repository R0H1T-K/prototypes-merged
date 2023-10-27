import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';

const Features = () => {
  return (
    <div className="py-5 ">
      <Container className=''>
        <Row>
          <Col md={12}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title style={{ color: '#0C2E42' }}>Features</Card.Title>
                <Card.Text>
                  AI Chat assistant with a high degree of flexibility for your website. It can be assigned any role and will respond to inquiries based on that role. Currently, it is assigned to the role of a career counsellor, who assists students in 10th grade in India in deciding what subjects they should study beyond 10th grade based on their areas of interest.
                </Card.Text>
                <Card.Text>
                  The tone with which the AI assistant responds can be changed. Right now, it will respond to the user in a Encouraging tone. All of these characteristics can be changed as needed.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={12}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title style={{ color: '#0C2E42' }}>Technologies Used</Card.Title>
                <Card.Text>
                  ReactJS, NodeJS, OpenAI.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Features;
