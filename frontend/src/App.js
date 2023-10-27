import './App.css';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { Auth0Provider } from '@auth0/auth0-react';
import { useAuth0 } from '@auth0/auth0-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppRoutes from './Routes';
import PdfRouter from './pdf/routers/pdfRoutes';

function App() {
  const { isAuthenticated } = useAuth0();
  console.log(isAuthenticated);

  return (
    <Auth0Provider
    domain="76east-dev.us.auth0.com"
        clientId="i9XLMR3WFJcqHkRZwu2yPSS8TJdFyPmf"
      authorizationParams={{
        redirect_uri: 'http://localhost:6974/ai-app/'
      }}
    >
      <Router>
        <Header />
        <div>
          <AppRoutes />
          <PdfRouter />
        </div>
        <Footer />
      </Router>
    </Auth0Provider>
  );
}

export default App;
