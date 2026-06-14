import { logEvent } from 'firebase/analytics'

import { analytics } from './config'

export const trackButtonClick = (buttonName: string) => {
  if (analytics) logEvent(analytics, 'button_click', { button_name: buttonName })
}

export const trackError = (errorMessage: string, errorContext?: string) => {
  if (analytics) {
    logEvent(analytics, 'app_error', {
      error_context: errorContext || 'unknown',
      error_message: errorMessage,
    })
  }
}
