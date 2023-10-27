import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Image, Card, Modal } from 'react-bootstrap';
import { generateImage } from '../service/imageService';

function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateImage = async (e) => {
    e.preventDefault();
    setChatMessages([
      ...chatMessages,
      { type: 'user', text: prompt },
    ]);
    setPrompt('');

    setIsLoading(true);
    try {
      const imageUrl = await generateImage(prompt);
      setImageUrl(imageUrl);

      setChatMessages([
        ...chatMessages,
        { type: 'user', text: prompt },
        { type: 'gpt', imageUrl },
      ]);
      setPrompt('');
      setFullScreenImageUrl(imageUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
  };

  return (
    <Container className="container w-100 p-3">
      <Card className="chat" style={{ backgroundColor: '#ece5dd' }}>

        <Card.Body className="chat-messages" style={{ maxHeight: '65vh', height: '100vh', overflowY: 'auto' }}>
          <div className="chat-container">
            <div className="chat-messages">
              {chatMessages.map((message, index) => (
                <div key={index} className={`chat-message ${message.type}`}>
                  {message.type === 'user' ? (
                    <span className="user-message">{message.text}</span>
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      onClick={() => {
                        setShowImageModal(true);
                        setFullScreenImageUrl(message.imageUrl);
                      }}
                    >
                      <Image src={message.imageUrl} alt="Generated" fluid style={{ maxWidth: '300px' }} />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="text-center p-3">
                  <span className="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
                  <p>Loading...</p>
                </div>
              )}
            </div>
          </div>
        </Card.Body>

      </Card>
      <Form onSubmit={handleGenerateImage} className="input-form p-3">
        <Container>

          <Row className='justify-content-center'>

            <Col xs='12' sm='9' md="10" lg="10.5">
              <Form.Group className='mb-3' controlId="prompt">
                <Form.Control
                  type="text"
                  placeholder="Enter Prompt..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col xs="12" sm="3" md="2" lg="1.5">
              <Button style={{ float: 'right', color: '#fff', backgroundColor: '#0C2E42' }} onClick={handleGenerateImage} variant="outline-primary">
                Generate
              </Button>
            </Col>

          </Row>
        </Container>
      </Form>
      <div style={{ flex: '1' }}></div>

      <Modal show={showImageModal} onHide={handleCloseImageModal} centered>
        <Modal.Body>
          <Image src={fullScreenImageUrl} alt="Generated" fluid />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ImageGenerator;
