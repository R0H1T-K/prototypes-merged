import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { checkGrammar } from '../../../service/grammarCheckService';

const GrammarChecker = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState({ errors: [] });
  const [replacedErrors, setReplacedErrors] = useState([]);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleCheckGrammar = async () => {
    if (!input.trim()) return;

    try {
      const grammarErrors = await checkGrammar(input);
      setOutput(grammarErrors);
      setReplacedErrors([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReplaceWord = (error) => {
    if (error) {
      const correctedInput = input.replace(error.error, error.correction);
      setInput(correctedInput);

      setReplacedErrors([...replacedErrors, error]);
    }
  };

  const handleFixAllErrors = () => {
    let correctedInput = input;
    const outputErrorsArray = output && output.errors ? output.errors : [];

    outputErrorsArray.forEach((error) => {
      correctedInput = correctedInput.replace(error.error, error.correction);
    });

    setInput(correctedInput);
    setReplacedErrors([...outputErrorsArray]);
  };

  const remainingErrors =
    output && output.errors && output.errors.length
      ? output.errors.filter((error) => !replacedErrors.includes(error))
      : [];

  const showFixAllErrorsButton = output && output.errors && output.errors.length > 0 && remainingErrors.length > 0;

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1', paddingRight: '20px' }}>
          <Card>
            <Card.Body>
              <Form.Group controlId="grammarChecker">
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
                  placeholder="Enter English text for grammar checking..."
                  ref={textareaRef}
                  autoFocus
                  value={input}
                  onChange={handleInputChange}
                  rows={10}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    variant="primary"
                    onClick={handleCheckGrammar}
                    style={{ marginTop: '10px', float: 'right' }}
                  >
                    Check Grammar
                  </Button>
                  {showFixAllErrorsButton && (
                    <Button
                      variant="success"
                      onClick={handleFixAllErrors}
                      style={{ marginTop: '10px', float: 'right' }}
                    >
                      Fix All Errors
                    </Button>
                  )}
                </div>
              </Form.Group>
            </Card.Body>
          </Card>
        </div>
        {output && (
          <div style={{ flex: '1', width: '20vw', height: '100%' }}>
            <Card>
              <Card.Body>
                {remainingErrors.length ? (
                  remainingErrors.map((error, index) => (
                    <Card
                      key={index}
                      style={{ margin: '10px 0', cursor: 'pointer' }}
                      onClick={() => handleReplaceWord(error)}
                    >
                      <Card.Body>
                        <Card.Text>
                          <span
                            style={{
                              fontSize: '12px',
                              margin: '0px',
                              lineHeight: '1.5',
                              fontWeight: '600',
                              color: '#505050',
                              float: 'right',
                            }}
                          >
                            Type: {error.error_type}
                          </span>
                          <br />
                          <span
                            style={{
                              overflowWrap: 'break-word',
                              textAlign: 'left',
                              color: 'rgb(251, 63, 75)',
                              fontWeight: 'bold',
                              margin: '0px',
                              textDecoration: 'line-through',
                            }}
                          >
                            {error.error}
                          </span>{' '}
                          <span
                            style={{
                              margin: '0px',
                              whiteSpace: 'pre-wrap',
                              overflowWrap: 'break-word',
                              textAlign: 'left',
                              color: 'rgb(73, 149, 87)',
                              fontWeight: 'bold',
                            }}
                          >
                            {error.correction}
                          </span>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <p>No more grammar mistakes found.</p>
                )}
              </Card.Body>
            </Card>
          </div>
        )}
        <div>

        </div>
      </div>
    </>
  );
};

export default GrammarChecker;
