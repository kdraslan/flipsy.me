# Simple Firebase Tracking

This is a simplified Firebase Analytics setup for tracking basic user interactions.

## Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Analytics in your Firebase project
3. Get your Firebase configuration from Project Settings > General > Your apps
4. Create a `.env` file in the root of your project with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Usage

Import the tracking functions and use them in your components:

```typescript
import { trackButtonClick, trackError } from '@/firebase/tracking';

// Track a button click
const handleClick = () => {
  trackButtonClick('my_button');
  // Your button logic here
};

// Track an error
try {
  // Some code that might throw
} catch (error) {
  trackError(error.message, 'component_name');
}
```

## What's Tracked

- **Button Clicks**: Tracked with `button_click` event and `button_name` parameter
- **Errors**: Tracked with `app_error` event, `error_message` and `error_context` parameters
- **Global Errors**: Automatically tracked via window error listener

## Files

- `config.ts` - Firebase initialization
- `tracking.ts` - Simple tracking functions
- `README.md` - This file

That's it! No complex services, hooks, or performance monitoring. Just simple, effective tracking.
