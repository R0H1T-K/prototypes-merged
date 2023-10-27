import React from 'react';
import { Tabs } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import EngPhraser from './EngPhraser';
import FrPhraser from './FrPhraser';
import EsPhraser from './EsPhraser';

const Pharaphraser = () => {
  return (
    <div>
      <Tabs
        defaultActiveKey="english"
        id="engphraser"
        className="mb-3"
      >
        <Tab eventKey="english" title="English">
          <EngPhraser />
        </Tab>
        <Tab eventKey="french" title="French">
          <FrPhraser />
        </Tab>
        <Tab eventKey="spanish" title="Spanish">
          <EsPhraser />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Pharaphraser;
