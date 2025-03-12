// Tracking.tsx - Add fallbacks for all hook functions
import React, { useEffect, useState } from 'react';

import {
  useButtonTracking,
  useComponentPerformance,
  useErrorTracking,
  usePageTracking,
} from '@/firebase/hooks.ts';
import { analyticsService } from '@/firebase/services.ts';

import styles from './Tracking.module.css';

const Tracking: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [showError, setShowError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [customEventData, setCustomEventData] = useState<string>('');

  // Track page view with this component
  usePageTracking?.('tracking_test_page', 'test_component');

  // Button tracking hooks with fallbacks
  const handleIncrementClick =
    useButtonTracking?.('increment_button', 'Tracking') ||
    (() => {
      console.log('Mock: Tracked button click: increment_button');
    });

  const handleErrorClick =
    useButtonTracking?.('error_button', 'Tracking') ||
    (() => {
      console.log('Mock: Tracked error button click');
    });

  const handleSearchClick =
    useButtonTracking?.('search_button', 'Tracking') ||
    (() => {
      console.log('Mock: Tracked search button click');
    });

  const handleCustomEventClick =
    useButtonTracking?.('custom_event_button', 'Tracking') ||
    (() => {
      console.log('Mock: Tracked custom event button click');
    });

  // Error tracking with fallback
  const trackError =
    useErrorTracking?.() ||
    ((code, message, context) => {
      console.log(`Mock: Tracked error: ${code}, ${message}, ${context}`);
    });

  // Component performance tracking with fallback
  const { measureOperation = async (_name: string, fn: () => Promise<any>) => await fn() } =
    useComponentPerformance?.('Tracking') || {};

  // Tracks user ID for analytics - simulating a user login
  useEffect(() => {
    // Simulating a user ID from localStorage
    const userId = `test-user-${Date.now()}`;
    analyticsService.setUserId?.(userId);
    analyticsService.setUserProperties?.({
      test_session: true,
      user_type: 'tester',
    });

    console.log('Set user ID:', userId);
  }, []);

  // Test increment counter - basic interaction
  const incrementCounter = () => {
    handleIncrementClick();
    setCount((prevCount) => prevCount + 1);
    console.log('Tracked button click: increment_button');
  };

  // Test error tracking
  const triggerError = async () => {
    handleErrorClick();
    try {
      // Intentionally throw an error
      throw new Error('This is a test error');
    } catch (error) {
      trackError('TEST_ERROR', (error as Error).message, 'Tracking.triggerError');
      setShowError(true);
      console.log('Tracked error: TEST_ERROR');
    }
  };

  // Test search tracking
  const performSearch = async () => {
    handleSearchClick();

    // Perform a measured search operation
    await measureOperation('search_operation', async () => {
      // Simulate search delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate fake results
      const results = [
        `Result for "${searchQuery}" - Item 1`,
        `Result for "${searchQuery}" - Item 2`,
        `Result for "${searchQuery}" - Item 3`,
      ];

      setSearchResults(results);

      // Log search event
      analyticsService.logSearch?.(searchQuery, results.length);
      console.log(`Tracked search for: "${searchQuery}" with ${results.length} results`);
    });
  };

  // Test custom event
  const logCustomEvent = () => {
    handleCustomEventClick();

    // Log a custom event with the data
    analyticsService.logEvent?.('custom_test_event', {
      data: customEventData,
      timestamp: new Date().toISOString(),
    });

    console.log('Tracked custom event with data:', customEventData);
    setCustomEventData(''); // Clear the input
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Firebase Tracking Test Component</h1>
      <p className={styles.subtitle}>Use this component to test all tracking functionality</p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Button Click Tracking</h2>
        <p className={styles.counter}>Counter: {count}</p>
        <button className={styles.button} onClick={incrementCounter}>
          Increment Counter (Tracks Button Click)
        </button>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Error Tracking</h2>
        <button className={styles.button} onClick={triggerError}>
          Trigger Test Error
        </button>
        {showError && (
          <p className={styles.errorMessage}>Error triggered and tracked! Check console.</p>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Search Tracking</h2>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter search query"
            className={styles.input}
          />
          <button className={styles.button} onClick={performSearch}>
            Search
          </button>
        </div>
        {searchResults.length > 0 && (
          <div>
            <h3 className={styles.sectionTitle}>Search Results:</h3>
            <ul className={styles.resultList}>
              {searchResults.map((result, index) => (
                <li key={index} className={styles.resultItem}>
                  {result}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Custom Event Tracking</h2>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={customEventData}
            onChange={(e) => setCustomEventData(e.target.value)}
            placeholder="Enter custom event data"
            className={styles.input}
          />
          <button className={styles.button} onClick={logCustomEvent}>
            Log Custom Event
          </button>
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          Check your browser console to see tracking confirmations
        </p>
        <p className={styles.footerText}>
          All events should be visible in your Firebase Analytics dashboard after processing
        </p>
      </div>
    </div>
  );
};

export default Tracking;
