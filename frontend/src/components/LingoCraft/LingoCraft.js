import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Pharaphraser from './Paraphraser/Pharaphraser';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import GrammarChecker from './GrammarCheck/GrammarCheck';
import Summarizer from './Summarizer/Summarizer';
import Translator from './Translator/Translator';
import CoWriterAssistant from './CoWriter/CoWriter';

const LingoCraft = () => {
  const [isSidebarShrunk, setIsSidebarShrunk] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarShrunk(!isSidebarShrunk);
  };

  const renderTabName = (name) => {
    return isSidebarShrunk ? name.charAt(0) : name;
  };

  return (
    <>
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="tooltip">
            {isSidebarShrunk ? 'Expand Sidebar' : 'Shrink Sidebar'}
          </Tooltip>
        }
      >
        <Button variant='outline-secondary' onClick={toggleSidebar}>
          {isSidebarShrunk ? <BsArrowRight /> : <BsArrowLeft />}
        </Button>
      </OverlayTrigger>
      <Tab.Container id="sidebar" defaultActiveKey="pharaphraser">
        <Row>
          <Col sm={isSidebarShrunk ? 1 : 2} className="custom-sidebar">
            <Nav variant="tabs" className={`flex-column ${isSidebarShrunk ? 'shrunk' : 'expanded'}`}>
              <Nav.Item>
                <Nav.Link
                  eventKey="pharaphraser"
                >
                  {renderTabName('Pharaphraser')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="grammar"
                >
                  {renderTabName('Grammar Checker')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="summarizer"
                >
                  {renderTabName('Summarizer')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="translator"
                >
                  {renderTabName('Translator')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="cowriter"
                >
                  {renderTabName('CoWriter')}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={isSidebarShrunk ? 11 : 10}>
            <Tab.Content>
              <Tab.Pane eventKey="pharaphraser"><Pharaphraser /></Tab.Pane>
              <Tab.Pane eventKey="grammar"><GrammarChecker /></Tab.Pane>
              <Tab.Pane eventKey="summarizer"><Summarizer /></Tab.Pane>
              <Tab.Pane eventKey="translator"><Translator /></Tab.Pane>
              <Tab.Pane eventKey="cowriter"><CoWriterAssistant /></Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
};

export default LingoCraft;