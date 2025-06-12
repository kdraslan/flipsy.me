/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */
import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import Logo from './Logo';

// Use fake timers for animation testing
jest.useFakeTimers();

describe('Logo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render Logo component', () => {
    render(<Logo />);

    // Check if the logo container is rendered
    const logoContainer = screen.getByRole('img', { hidden: true });
    expect(logoContainer).toBeInTheDocument();
  });

  test('should render SVG with correct viewBox', () => {
    const { container } = render(<Logo />);

    // Since we need to test SVG attributes, we'll use container as a last resort
    // but acknowledge this is not ideal for testing-library best practices
    const svgElement = container.querySelector('svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 1920 1080');
  });

  test('should clean up animation on unmount', () => {
    // Spy on clearTimeout
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');

    const { unmount } = render(<Logo />);

    // Advance timers to trigger the animation
    jest.advanceTimersByTime(300);

    // Unmount the component
    unmount();

    // Expect clearTimeout to have been called
    expect(clearTimeoutSpy).toHaveBeenCalled();

    // Clean up spy
    clearTimeoutSpy.mockRestore();
  });

  test('should have multiple path elements in SVG', () => {
    const { container } = render(<Logo />);

    // Check if it has the expected number of path elements
    const pathElements = container.querySelectorAll('path');

    // There should be several path elements in the SVG
    expect(pathElements.length).toBeGreaterThan(1);
  });
});
