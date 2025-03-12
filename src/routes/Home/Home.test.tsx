import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import React from 'react';

import Home from './Home';

jest.mock('../../firebase/services', () => ({
  analyticsService: {
    logEvent: jest.fn(),
    logPageView: jest.fn(),
    logSearch: jest.fn(),
    setUserId: jest.fn(),
    setUserProperties: jest.fn(),
  },
  performanceService: {
    componentRenderTrace: jest.fn().mockReturnValue({
      putMetric: jest.fn(),
      setAttribute: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    }),
    putMetric: jest.fn(),
    setAttribute: jest.fn(),
    startTrace: jest.fn(),
    stopTrace: jest.fn(),
  },
}));

jest.mock('../../firebase/hooks', () => ({
  useButtonTracking: jest.fn(() => jest.fn()),
  useComponentPerformance: jest.fn(() => ({
    measureOperation: jest.fn(async (name, fn) => await fn()),
  })),
  useErrorTracking: jest.fn(() => jest.fn()),
  usePageTracking: jest.fn(),
}));

jest.mock('../../firebase/config', () => ({
  app: {
    options: {
      appId: 'test-app-id',
    },
  },
  initializeAnalytics: jest.fn().mockResolvedValue({}),
  initializePerformance: jest.fn().mockResolvedValue({}),
}));

// Mock the dependencies
jest.mock('react-dropzone', () => ({
  useDropzone: () => ({
    getInputProps: () => ({}),
    getRootProps: () => ({}),
    isDragActive: false,
  }),
}));

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

// Mock the Logo component
jest.mock('@components/Logo/Logo', () => {
  return function MockLogo() {
    return <div data-testid='mock-logo'>Logo</div>;
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    clear: jest.fn(() => {
      store = {};
    }),
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock canvas functionality without directly overriding prototype methods
beforeAll(() => {
  // Store original method
  const originalGetContext = HTMLCanvasElement.prototype.getContext;

  // Mock getContext
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (
    this: HTMLCanvasElement,
    contextId: string
  ) {
    if (contextId === '2d') {
      return {
        clearRect: jest.fn(),
        drawImage: jest.fn(),
        fillRect: jest.fn(),
        getImageData: jest.fn(() => ({
          data: new Uint8ClampedArray(4),
        })),
        putImageData: jest.fn(),

        // Add other required methods
      } as unknown as CanvasRenderingContext2D;
    }

    // For other context types, return null or mock as needed
    return null;
  });

  // Mock toDataURL
  jest
    .spyOn(HTMLCanvasElement.prototype, 'toDataURL')
    .mockReturnValue('data:image/jpeg;base64,mockDataUrl');
});

afterAll(() => {
  // Clean up all mocks
  jest.restoreAllMocks();
});

// Helper function to create a File object
function createMockFile(name: string, type: string, size: number) {
  const file = new File([], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render Home with Logo', () => {
    render(<Home />);
    const logoElement = screen.getByTestId('mock-logo');
    expect(logoElement).toBeInTheDocument();
  });

  test('should render dropzone with correct text', () => {
    render(<Home />);
    const dropzoneText = screen.getByText(/Drag & drop images here, or click to select files/i);
    expect(dropzoneText).toBeInTheDocument();
  });

  test('should load images from localStorage on mount', () => {
    const mockImages = [
      {
        dataUrl: 'data:image/jpeg;base64,/test',
        id: '123',
        name: 'test.jpg',
        originalFormat: 'image/jpeg',
        size: 12345,
      },
    ];

    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockImages));

    render(<Home />);

    expect(localStorageMock.getItem).toHaveBeenCalledWith('flipsy-images');
  });

  test('should show correct copyright year in footer', () => {
    render(<Home />);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`© ${currentYear}.*`))).toBeInTheDocument();
  });

  test('should handle errors when localStorage has invalid data', () => {
    // Mock console.error to avoid test noise
    const originalError = console.error;
    console.error = jest.fn();

    // Set invalid JSON
    localStorageMock.getItem.mockReturnValueOnce('invalid-json');

    render(<Home />);

    expect(console.error).toHaveBeenCalled();

    // Restore original console.error
    console.error = originalError;
  });
});
