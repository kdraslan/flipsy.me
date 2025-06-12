import React, { useState } from 'react';

import { trackButtonClick, trackError } from '@/firebase/tracking';

import styles from './Tracking.module.css';

const Tracking: React.FC = () => {
  const [count, setCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const handleButtonClick = () => {
    trackButtonClick('demo_button');

    setCount(count + 1);
  };

  const handleErrorClick = () => {
    trackButtonClick('error_button');

    setErrorCount(errorCount + 1);
    try {
      throw new Error('This is a demo error');
    } catch (error) {
      trackError((error as Error).message, 'Tracking.handleErrorClick');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Firebase Tracking</h2>
      <p className={styles.description}>Simple demo showing button clicks and error tracking.</p>

      <div className={styles.buttonContainer}>
        <button
          onClick={handleButtonClick}
          className={`${styles.button} ${styles.primaryButton}`}
        >
          Click Me (Count: {count})
        </button>

        <button
          onClick={handleErrorClick}
          className={`${styles.button} ${styles.dangerButton}`}
        >
          Trigger Error (Count: {errorCount})
        </button>
      </div>

      <p className={styles.note}>
        Check the browser console to see tracking events.
      </p>
    </div>
  );
};

export default Tracking;
