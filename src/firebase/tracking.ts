import { logEvent } from 'firebase/analytics';

import { analytics } from './config';

// Simple function to track button clicks
export const trackButtonClick = (buttonName: string) => {
  if (analytics) {
    logEvent(analytics, 'button_click', {
      button_name: buttonName,
    });
    console.log(`Tracked button click: ${buttonName}`);
  } else {
    console.log(`Mock tracked button click: ${buttonName}`);
  }
};

// Simple function to track errors
export const trackError = (errorMessage: string, errorContext?: string) => {
  if (analytics) {
    logEvent(analytics, 'app_error', {
      error_context: errorContext || 'unknown',
      error_message: errorMessage,
    });
    console.log(`Tracked error: ${errorMessage}`);
  } else {
    console.log(`Mock tracked error: ${errorMessage}`);
  }
};
