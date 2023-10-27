import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const HomePage = () => {
  return (
    <Container className="mt-5" style={{ height: '75vh' }}>
      <Row className="mt-4 d-flex">
        <Col md={6} className="flex-column">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Student Counselor</Card.Title>
              <Card.Text>
                Our AI-powered chatbot acts as a student counselor, providing academic guidance and support. Whether you have questions about coursework, career advice, or general academic queries, our chatbot is here to help.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="flex-column">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Text to Image Generator</Card.Title>
              <Card.Text>
                Convert text descriptions into visual images using our Text to Image Generator. This feature is ideal for creating illustrations, diagrams, or concept art from textual input.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="flex-column">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Video & Audio to Subtitle</Card.Title>
              <Card.Text>
                Automatically transcribe your video and audio files into subtitles. Whether you're looking to add captions to your videos or need a written transcript of audio content, this feature has you covered.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="flex-column">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Language Tool</Card.Title>
              <Card.Text>
                Our Language Tool offers a range of language processing capabilities. Check and correct grammar, paraphrase text, co-write documents, and create summaries with ease. Enhance your writing and communication skills.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
