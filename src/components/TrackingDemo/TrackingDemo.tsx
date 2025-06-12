import React, { useState } from 'react';

import { trackButtonClick, trackError } from '@/firebase/tracking';

const TrackingDemo: React.FC = () => {
  const [count, setCount] = useState(0);

  const handleButtonClick = () => {
    trackButtonClick('demo_button');
    setCount(count + 1);
  };

  const handleErrorClick = () => {
    trackButtonClick('error_button');
    try {
      throw new Error('This is a demo error');
    } catch (error) {
      trackError((error as Error).message, 'TrackingDemo.handleErrorClick');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', margin: '20px', padding: '20px' }}>
      <h2>Firebase Tracking Demo</h2>
      <p>Simple demo showing button clicks and error tracking.</p>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleButtonClick}
          style={{
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            marginRight: '10px',
            padding: '10px 20px'
          }}
        >
          Click Me (Count: {count})
        </button>

        <button
          onClick={handleErrorClick}
          style={{
            backgroundColor: '#dc3545',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            padding: '10px 20px'
          }}
        >
          Trigger Error
        </button>
      </div>

      <p style={{ color: '#666', fontSize: '14px' }}>
        Check the browser console to see tracking events.
      </p>
    </div>
  );
};

export default TrackingDemo;
