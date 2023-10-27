import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'markdown-to-jsx';
import { ImSpinner } from 'react-icons/im';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { clearConversation, sendMessage } from './service/chatService';

const chatMessagesStyle = {
  maxHeight: '63vh',
  height: '100vh',
  overflowY: 'auto',
};

const userMessageStyle = {
  backgroundColor: '#0C2E42',
  color: 'white',
  textAlign: 'right',
  borderRadius: '10px',
  padding: '20px',
  marginBottom: '20px',
  marginTop: '10px',
  position: 'relative',
};

const botMessageStyle = {
  backgroundColor: '#fff',
  color: 'black',
  textAlign: 'left',
  borderRadius: '10px',
  padding: '20px',
  marginBottom: '20px',
  marginTop: '10px',
  position: 'relative',
};

const avatarStyle = {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  backgroundColor: 'black',
  color: 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: '-15px',
  left: '10px',
  right: '10px',
};

function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const addMessage = (text, isBot) => {
    const newMessage = {
      text,
      isBot,
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleNewChat = async () => {
    try {
      await clearConversation();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsLoading(true);

    addMessage(input);
    setInput('');

    try {
      const reply = await sendMessage(input);
      addMessage(reply, true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="container w-100 p-3">
      <Card className="chat" style={{ backgroundColor: '#ece5dd' }}>
        <Card.Body className="chat-messages" style={{ maxHeight: '65vh', height: '100vh', overflowY: 'auto' }} ref={chatContainerRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.isBot ? 'bot-message' : 'user-message'}`}
              style={message.isBot ? botMessageStyle : userMessageStyle}
            >
              {message.isBot ? (
                <>
                  <div style={{ ...avatarStyle, left: '10px', right: 'auto' }}>GPT</div>
                  <Markdown>{message.text}</Markdown>
                </>
              ) : (
                <>
                  <div style={{ ...avatarStyle, left: 'auto', right: '10px' }}>You</div>
                  {index === messages.length - 1 && isLoading ? (
                    <h3 className="spinner-border spinner-border-md" style={{ float: 'left' }} role="status" aria-hidden="true"></h3>
                  ) : null}
                  <Markdown>{message.text}</Markdown>
                </>
              )}
            </div>
          ))}
        </Card.Body>
      </Card>
      <Form onSubmit={handleSubmit} className="input-form p-3">
        <Container>
          <Row className='justify-content-center'>
            <Col xs='12' sm='8' md="9" >
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={handleInputChange}
                  className="message-input"
                />
              </Form.Group>
            </Col>
            <Col style={{ alignItems: 'right', display: 'contents' }}>
              <div>
                <Button type="submit" style={{ color: '#fff', backgroundColor: '#0C2E42', marginRight: 10 }} className="send-button shadow-sm">
                  Send
                </Button>
                <Button variant="outline-primary" onClick={handleNewChat} className="shadow-sm">
                  New
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </Form>
    </Container>
  );
}

export default Chat;
