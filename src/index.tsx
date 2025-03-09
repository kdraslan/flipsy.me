import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './routes/Home/Home';
import './firebase/config'; // Just importing this will initialize Firebase
import { analyticsService, performanceService } from './firebase/services';

// Configure global error tracking
window.addEventListener('error', (event) => {
    analyticsService.logError(
        'UNCAUGHT_ERROR',
        event.message || 'Unknown error',
        event.filename ? `${event.filename}:${event.lineno}:${event.colno}` : 'unknown'
    );
});

// Measure app initialization time
const measureAppInit = async () => {
    await performanceService.startTrace('app_initialization');

    const root = ReactDOM.createRoot(
        document.getElementById('root') as HTMLElement
    );

    root.render(
        <React.StrictMode>
            <Home />
        </React.StrictMode>
    );

    // Finish the trace after a short delay to capture initial rendering
    setTimeout(async () => {
        await performanceService.stopTrace('app_initialization');
    }, 1000);
};

// Handle the promise
measureAppInit().catch(error => {
    console.error('Error during app initialization:', error);
});
