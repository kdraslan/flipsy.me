/* eslint-disable @typescript-eslint/member-ordering */
import {
  Analytics,
  logEvent,
  setAnalyticsCollectionEnabled,
  setUserId,
  setUserProperties,
} from 'firebase/analytics';
import { FirebasePerformance, trace } from 'firebase/performance';

import { initializeAnalytics, initializePerformance } from './config';

// Analytics Service
// eslint-disable-next-line @typescript-eslint/member-ordering
class AnalyticsService {
  private analytics: Analytics | null = null;
  private initializationPromise: Promise<Analytics | null> | null = null;
  private initialized = false;

  constructor() {
    this.initializationPromise = this.initialize();
  }

  // Log a custom event
  async logEvent(eventName: string, eventParams?: Record<string, unknown>) {
    if ((await this.ensureInitialized()) && this.analytics) {
      logEvent(this.analytics, eventName, eventParams);
    }
  }

  // Set user ID for user-scoped analytics - use this if you have a way to identify users
  // (like localStorage or URL params)
  async setUserId(userId: string) {
    if ((await this.ensureInitialized()) && this.analytics) {
      setUserId(this.analytics, userId);
    }
  }

  // Set user properties for analytics
  async setUserProperties(properties: Record<string, unknown>) {
    if ((await this.ensureInitialized()) && this.analytics) {
      setUserProperties(this.analytics, properties);
    }
  }

  // Enable or disable analytics collection
  async setAnalyticsCollectionEnabled(enabled: boolean) {
    if ((await this.ensureInitialized()) && this.analytics) {
      setAnalyticsCollectionEnabled(this.analytics, enabled);
    }
  }

  // Predefined events for common scenarios
  async logPageView(pageName: string, pageClass?: string) {
    await this.logEvent('page_view', {
      page_class: pageClass || 'standard',
      page_name: pageName,
    });
  }

  async logButtonClick(buttonName: string, componentName?: string) {
    await this.logEvent('button_click', {
      button_name: buttonName,
      component: componentName,
    });
  }

  async logSearch(searchTerm: string, resultsCount: number) {
    await this.logEvent('search', {
      results_count: resultsCount,
      search_term: searchTerm,
    });
  }

  async logError(errorCode: string, errorMessage: string, errorContext?: string) {
    await this.logEvent('app_error', {
      error_code: errorCode,
      error_context: errorContext || 'unknown',
      error_message: errorMessage,
    });
  }

  private async initialize() {
    try {
      this.analytics = await initializeAnalytics();
      this.initialized = !!this.analytics;
      return this.analytics;
    } catch (error) {
      console.error('Failed to initialize Analytics:', error);
      this.initialized = false;
      return null;
    }
  }

  // Wait for initialization before using any methods
  private async ensureInitialized() {
    if (!this.initialized && this.initializationPromise) {
      await this.initializationPromise;
    }
    return this.initialized;
  }
}

// Performance Service
// eslint-disable-next-line @typescript-eslint/member-ordering
class PerformanceService {
  private activeTraces: Map<string, unknown> = new Map();
  private initializationPromise: Promise<FirebasePerformance | null> | null = null;
  private initialized = false;
  private performance: FirebasePerformance | null = null;

  constructor() {
    this.initializationPromise = this.initialize();
  }

  // Start a custom trace
  async startTrace(traceName: string) {
    if ((await this.ensureInitialized()) && this.performance) {
      try {
        // Use the trace function from firebase/performance
        const newTrace = trace(this.performance, traceName);
        await newTrace.start();
        this.activeTraces.set(traceName, newTrace);
        return newTrace;
      } catch (error) {
        console.error(`Error starting trace "${traceName}":`, error);
        return null;
      }
    }
    return null;
  }

  // Stop a custom trace
  async stopTrace(traceName: string) {
    if ((await this.ensureInitialized()) && this.performance) {
      try {
        const traceToStop = this.activeTraces.get(traceName);
        if (traceToStop) {
          await (traceToStop as { stop: () => Promise<void> }).stop();
          this.activeTraces.delete(traceName);
          return true;
        }
      } catch (error) {
        console.error(`Error stopping trace "${traceName}":`, error);
      }
    }
    return false;
  }

  // Add a custom attribute to a trace
  async setAttribute(traceName: string, attributeName: string, attributeValue: string) {
    if ((await this.ensureInitialized()) && this.performance) {
      try {
        const currentTrace = this.activeTraces.get(traceName);
        if (currentTrace) {
          (currentTrace as { putAttribute: (name: string, value: string) => void }).putAttribute(attributeName, attributeValue);
          return true;
        }
      } catch (error) {
        console.error(
          `Error setting attribute "${attributeName}" for trace "${traceName}":`,
          error
        );
      }
    }
    return false;
  }

  // Get a custom attribute from a trace
  async getAttribute(traceName: string, attributeName: string) {
    if ((await this.ensureInitialized()) && this.performance) {
      try {
        const currentTrace = this.activeTraces.get(traceName);
        if (currentTrace) {
          return (currentTrace as { getAttribute: (name: string) => string | null }).getAttribute(attributeName);
        }
      } catch (error) {
        console.error(
          `Error getting attribute "${attributeName}" from trace "${traceName}":`,
          error
        );
      }
    }
    return null;
  }

  // Record a custom metric within a trace
  async putMetric(traceName: string, metricName: string, value: number) {
    if ((await this.ensureInitialized()) && this.performance) {
      try {
        const currentTrace = this.activeTraces.get(traceName);
        if (currentTrace) {
          (currentTrace as { putMetric: (name: string, value: number) => void }).putMetric(metricName, value);
          return true;
        }
      } catch (error) {
        console.error(`Error putting metric "${metricName}" for trace "${traceName}":`, error);
      }
    }
    return false;
  }

  // Enable or disable performance collection
  async setPerformanceCollectionEnabled(enabled: boolean) {
    if ((await this.ensureInitialized()) && this.performance) {
      try {
        // Set these properties directly on the performance object
        this.performance.instrumentationEnabled = enabled;
        this.performance.dataCollectionEnabled = enabled;
        return true;
      } catch (error) {
        console.error(`Error setting performance collection enabled:`, error);
        return false;
      }
    }
    return false;
  }

  // Utility function to measure component render times
  componentRenderTrace(componentName: string) {
    const traceName = `render_${componentName}`;

    return {
      putMetric: async (name: string, value: number) =>
        await this.putMetric(traceName, name, value),
      setAttribute: async (name: string, value: string) =>
        await this.setAttribute(traceName, name, value),
      start: async () => await this.startTrace(traceName),
      stop: async () => await this.stopTrace(traceName),
    };
  }

  private async initialize() {
    try {
      this.performance = await initializePerformance();
      this.initialized = !!this.performance;
      return this.performance;
    } catch (error) {
      console.error('Failed to initialize Performance:', error);
      this.initialized = false;
      return null;
    }
  }

  // Wait for initialization before using any methods
  private async ensureInitialized() {
    if (!this.initialized && this.initializationPromise) {
      await this.initializationPromise;
    }
    return this.initialized;
  }
}

// Initialize services
const analyticsService = new AnalyticsService();
const performanceService = new PerformanceService();

export { analyticsService, performanceService };
