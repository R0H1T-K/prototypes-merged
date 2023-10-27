import React, { useState, useRef, useEffect } from 'react';
import { Nav, Card, Form, Button, FormLabel, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import Markdown from 'markdown-to-jsx';
import { paraphraseTextInSpanish } from '../../../service/engPhraserService';


const EsPhraser = () => {
  const [mode, setMode] = useState('standard');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSliderChange = (event) => {
    setSliderValue(parseInt(event.target.value));
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);

    try {
      const response = await paraphraseTextInSpanish(input, mode, sliderValue);

      setOutput(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const wordPattern = /\b[\w'-]+\b/g;
  const wordCount = input.match(wordPattern)?.length || 0;
  const wordCountOut = output.match(wordPattern)?.length || 0;

  return (
    <Card>
      <div style={{ marginLeft: '10px', alignContent: 'space-between', justifyContent: 'space-evenly' }}>
        <Nav variant="underline" activeKey={mode} onSelect={setMode}>
          <h5 style={{ marginTop: '8px' }}>Types:</h5>
          <Nav.Item>
            <Nav.Link eventKey="standard">Standard</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="natural">Natural</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="formal">Formal</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="expand">Expand</Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '10px' }}>
        <Card style={{ flex: '1', marginRight: '10px', height: 'auto' }}>
          <Card.Body style={{
            border: 'none',
            boxShadow: 'none',
            height: '100%',
            width: '100%',
            resize: 'none',
            overflow: 'auto',
          }}>
            <Form.Group controlId="leftCard">
              <Form.Control
                as="textarea"
                style={{
                  border: 'none',
                  boxShadow: 'none',
                  height: 'auto',
                  width: '100%',
                  resize: 'none',
                  overflow: 'auto',
                }}
                placeholder="Start typing..."
                ref={textareaRef}
                autoFocus
                value={input}
                onChange={handleInputChange}
                rows={10}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ marginTop: '10px' }}>{wordCount}</p>
                <Button variant="primary" onClick={handleSubmit} style={{ marginTop: '10px', float: 'right' }}>
                  Re-Write
                </Button>
              </div>
              {loading && (
                <Spinner style={{ position: 'absolute', top: '50%', left: '50%', color: '#0C2E42' }} animation="border" role="status">
                </Spinner>
              )}
            </Form.Group>
          </Card.Body>
        </Card>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexFlow: 'column-reverse wrap',
          placeContent: 'space-between space-evenly',
          flexWrap: 'wrap',
          alignContent: 'flex-end',
          justifyContent: 'space-evenly'
        }}>
          <FormLabel style={{ color: '#0C2E42', border: '2px solid #0C2E42' }}>Synonyms</FormLabel>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip">
                Higher Value means more changes in the text.
              </Tooltip>
            }
          >
            <Form.Range
              min={0}
              max={3}
              step={1}
              value={sliderValue}
              onChange={handleSliderChange}
              style={{
                border: '3px solid #0C2E42',
                marginTop: '15px',
                height: '10px',
                borderRadius: '5px',
                marginRight: '10px',
                width: '100px',
                transform: 'rotate(-90deg)'
              }}
            />
          </OverlayTrigger>
        </div>

        <Card style={{ flex: '1', marginRight: '10px', height: 'auto' }}>
          <Card.Body style={{
            border: 'none',
            boxShadow: 'none',
            height: '100%',
            width: '100%',
            resize: 'none',
            overflow: 'auto',
          }}>
            <Markdown>{output}</Markdown>
          </Card.Body>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ marginTop: '10px' }}>{wordCountOut} words.</p>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default EsPhraser;
