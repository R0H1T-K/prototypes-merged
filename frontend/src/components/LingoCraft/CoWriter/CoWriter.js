import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Button, Spinner } from 'react-bootstrap';
import { generateTitle, generateIdeas, generateNextText } from '../../../service/coWriterService';


const CoWriterAssistant = () => {
  const [input, setInput] = useState('');
  const [title, setTitle] = useState('');
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });
  const [ideasPopupVisible, setIdeasPopupVisible] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const textareaRef = useRef(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleGenerateText = async () => {
    if (!input.trim()) return;

    setLoading(true);

    try {
      const response = await generateNextText(input);

      if (title === '') {
        const newTitle = await generateTitle(input);
        setTitle(newTitle);
      }

      if (response) {
        const combinedText = `${input} ${response}`;
        setInput(combinedText);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const GenerateIdeas = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const ideasData = await generateIdeas(input);

      if (title === '') {
        const newTitle = await generateTitle(input);
        setTitle(newTitle);
      }

      if (ideasData && ideasData.variations) {
        setIdeas(ideasData);
        setIdeasPopupVisible(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const closeIdeasPopup = () => {
    setIdeasPopupVisible(false);
  };

  const handleVariationClick = (variationText) => {
    setInput((prevInput) => prevInput + '' + variationText);
    closeIdeasPopup();
  };

  const handleContextMenu = (event) => {
    if (!input.trim()) return;

    event.preventDefault();
    const position = { top: event.pageY, left: event.pageX };
    setContextMenuPosition(position);
    setContextMenuVisible(true);
  };

  const closeContextMenu = () => {
    setContextMenuVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuVisible && !event.target.closest('.context-menu')) {
        closeContextMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenuVisible]);

  const IdeasPopup = ({ ideas, onClose, onVariationClick }) => {

    const popupStyle = {
      position: 'fixed',
      top: '150px',
      left: '400px',
      width: '50%',
      height: 'auto',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      border: '5px double gray',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };

    const contentStyle = {
      backgroundColor: 'white',
      padding: '20px',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
    };

    const closeButtonStyle = {
      position: 'absolute',
      top: '-5px',
      right: '4px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    };

    return (
      <div style={popupStyle} className="ideas-popup">
        <div style={contentStyle} className="ideas-popup-content">
          {ideas.variations.map((variation) => (
            <div className="idea" key={variation.variation}>
              <Card>
                <p
                  onClick={() => onVariationClick(variation.text)}
                  style={{ fontSize: '90%' }}
                >
                  {variation.text}
                </p>
              </Card>
            </div>
          ))}

          <Button
            style={closeButtonStyle}
            className="close-button"
            onClick={onClose}
            variant='outline-primary'
          >
            Close
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1', paddingRight: '20px' }}>
          <span>{title}</span>
          <Card onContextMenu={handleContextMenu} >
            <Card.Body>
              <Form.Group controlId="coWriterInput">
                <Form.Control
                  as="textarea"
                  style={{
                    border: 'none',
                    boxShadow: 'none',
                    height: '55vh',
                    maxHeight: '55vh',
                    width: '100%',
                    overflow: 'auto',
                  }}
                  placeholder="Enter text for CoWriter assistant..."
                  ref={textareaRef}
                  autoFocus
                  value={input}
                  onChange={handleInputChange}
                  rows={10}
                />
                {loading && (
                  <Spinner style={{position:'fixed',top: '40%', left:'50%', color: '#0C2E42'}}  animation="border" role="status">
                  </Spinner>
                )}
                {ideasPopupVisible && (
                  <IdeasPopup onVariationClick={handleVariationClick} position={contextMenuPosition} onClose={closeIdeasPopup} ideas={ideas} />
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    variant="primary"
                    onClick={handleGenerateText}
                    style={{ marginTop: '10px' }}
                  >
                    Complete Paragraph
                  </Button>
                  <Button
                    variant="primary"
                    onClick={GenerateIdeas}
                    style={{ marginTop: '10px' }}
                  >
                    Suggest Text
                  </Button>
                </div>
              </Form.Group>
            </Card.Body>
          </Card>
        </div>
      </div>
      {contextMenuVisible && (
        <ContextMenu
          position={contextMenuPosition}
          onClose={closeContextMenu}
          onGenerateIdeas={GenerateIdeas}
          onCompleteParagraph={handleGenerateText}
        />
      )}
    </>
  );
};

const ContextMenu = ({ position, onClose, onGenerateIdeas, onCompleteParagraph }) => {
  const menuStyle = {
    position: 'absolute', top: position.top, left: position.left, background: '#0C2E42', border: '1px solid white', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)', minWidth: '150px',
  };

  const menuItemStyle = {
    padding: '10px', cursor: 'pointer', borderBottom: '1px solid white', color: 'white', transition: 'background 0.3s ease',
  };
  const hoverBackground = '#f0a0a0';
  const normalBackground = '#0C2E42';
  return (
    <div className="context-menu" style={menuStyle}>
      <div style={menuItemStyle}
        onClick={() => { onClose(); onGenerateIdeas(); }}
        onMouseEnter={(e) => e.target.style.background = hoverBackground}
        onMouseLeave={(e) => e.target.style.background = normalBackground}
      >
        Generate Ideas
      </div>
      <div
        style={menuItemStyle} onClick={() => { onClose(); onCompleteParagraph(); }}
        onMouseEnter={(e) => e.target.style.background = hoverBackground}
        onMouseLeave={(e) => e.target.style.background = normalBackground}
      >
        Complete Paragraph
      </div>
    </div>
  );
};

export default CoWriterAssistant;
