import React from 'react';
import ReactDOM from 'react-dom/client';
// Tokens and shared primitives must precede component styles in the cascade.
import './styles/global.css';
import './styles/controls.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
