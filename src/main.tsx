import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import './App.css';

// Set up your Google OAuth Client ID in .env.local:
// VITE_GOOGLE_CLIENT_ID=your_client_id_here
//
// To create one:
// 1. Go to https://console.cloud.google.com/
// 2. Create a project → APIs & Services → Credentials
// 3. Create OAuth 2.0 Client ID (Web application)
// 4. Add Authorized JavaScript origins: http://localhost:3001
// 5. Copy the Client ID here
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
