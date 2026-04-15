import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthApp from './App';

/**
 * React App Entry Point
 * Mounts React Auth App to #react-root element in Django template
 */

// Get root element from Django template
const rootElement = document.getElementById('react-root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AuthApp />
    </React.StrictMode>
  );
} else {
  console.error('React root element not found. Make sure #react-root exists in your HTML template.');
}
