import '@/firebase/config'; // Just importing this will initialize Firebase

import React from 'react';
import { createRoot } from 'react-dom/client';

import { trackError } from '@/firebase/tracking';
import Home from '@/routes/Home/Home';

// Configure global error tracking
window.addEventListener('error', (event) => {
  trackError(
    event.message || 'Unknown error',
    event.filename ? `${event.filename}:${event.lineno}:${event.colno}` : 'unknown'
  );
});

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);
