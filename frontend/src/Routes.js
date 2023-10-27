import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import SpeechToText from './components/SpeechtoText';
import VideoToText from './components/VideotoText';
import Chat from './Chat';
import Features from './components/Features';
import ImageGenerator from './components/ImageGenerator';
import LingoCraft from './components/LingoCraft/LingoCraft';
import { useAuth0 } from '@auth0/auth0-react';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <Routes>
      <Route path="/ai-app" element={<HomePage />} />
      <Route path="/" element={<HomePage />} />
      {isAuthenticated ? (
        <>
          <Route path="/chat" element={<Chat />} />
          <Route path="/speech" element={<SpeechToText />} />
          <Route path="/video" element={<VideoToText />} />
          <Route path="/image-generation" element={<ImageGenerator />} />
          <Route path="/lingocraft" element={<LingoCraft />} />
          <Route path="/speech" element={<SpeechToText />} />
          <Route path="/video" element={<VideoToText />} />
        </>
      ) : (
        <Route path="/unauthorized" element={<UnauthorizedMessage />} />
      )}
      <Route path="/features" element={<Features />} />
    </Routes>
  );
};

const UnauthorizedMessage = () => {
  return <div>Unauthorized: You do not have permission to access this page.</div>;
};

export default AppRoutes;
