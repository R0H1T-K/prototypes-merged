import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { summarizeText } from '../../../service/summarizerService';

const Summarizer = () => {
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const wordPattern = /\b[\w'-]+\b/g;

  const matches = input.match(wordPattern);
  const matchesOut = summary.match(wordPattern);

  const wordCount = matches ? matches.length : 0;
  const wordCountOut = matchesOut ? matchesOut.length : 0;

  const handleSummarize = async () => {
    if (!input.trim()) return;

    try {
      const summary = await summarizeText(input);

      setSummary(summary);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1', paddingRight: '20px',  }}>
          <Card>
            <Card.Body>
              <Form.Group controlId="textSummarizer" >
                <Form.Control
                  as="textarea"
                  style={{
                    border: 'none',
                    boxShadow: 'none',
                    height: '100%',
                    width: '100%',
                    resize: 'none',
                    overflow: 'auto',
                  }}
                  placeholder="Enter text for summarization..."
                  ref={textareaRef}
                  autoFocus
                  value={input}
                  onChange={handleInputChange}
                  rows={14}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <p style={{ marginTop: '10px' }}>{wordCount}</p>
                  <Button
                    variant="primary"
                    onClick={handleSummarize}
                    style={{ marginTop: '10px', float: 'right' }}
                  >
                    Summarize Text
                  </Button>
                </div>
              </Form.Group>
            </Card.Body>
          </Card>
        </div>

        <div style={{ flex: '1', paddingRight: '20px' }}>
          <Card>
            <Card.Body >
              <p rows={14}>{summary}</p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <p style={{ marginTop: '10px', marginLeft: '10px' }}>{wordCountOut}</p>
              </div>

            </Card.Body>

          </Card>
        </div>
      </div>
    </>
  );
};

export default Summarizer;
