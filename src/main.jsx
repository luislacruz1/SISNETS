import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Registro de Service Worker para PWA (solo en producción para no interferir con Vite dev server)
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          console.log('SISNETS PWA activa con scope:', registration.scope);
        },
        (err) => {
          console.warn('SISNETS PWA registro no disponible:', err);
        }
      );
    });
  } else {
    // En desarrollo local desregistrar cualquier SW previo para evitar pantalla en blanco en Vite
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        reg.unregister();
      }
    });
    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => caches.delete(key));
      });
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
