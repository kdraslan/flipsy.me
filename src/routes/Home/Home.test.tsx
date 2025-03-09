import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';

// Mock the dependencies
jest.mock('react-dropzone', () => ({
  useDropzone: () => ({
    getRootProps: () => ({}),
    getInputProps: () => ({}),
    isDragActive: false
  })
}));

jest.mock('file-saver', () => ({
  saveAs: jest.fn()
}));

// Mock the Logo component
jest.mock('../../components/Logo/Logo', () => {
  return function MockLogo() {
    return <div data-testid="mock-logo">Logo</div>;
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock canvas functionality without directly overriding prototype methods
beforeAll(() => {
  // Store original method
  const originalGetContext = HTMLCanvasElement.prototype.getContext;

  // Mock getContext
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function(this: HTMLCanvasElement, contextId: string) {
    if (contextId === '2d') {
      return {
        drawImage: jest.fn(),
        fillRect: jest.fn(),
        clearRect: jest.fn(),
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
  jest.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/jpeg;base64,mockDataUrl');
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
        id: '123',
        name: 'test.jpg',
        originalFormat: 'image/jpeg',
        size: 12345,
        dataUrl: 'data:image/jpeg;base64,/test'
      }
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
