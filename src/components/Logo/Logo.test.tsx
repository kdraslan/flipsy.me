import '@testing-library/jest-dom';

import { render, waitFor } from '@testing-library/react';

import Logo from './Logo';

// Use fake timers for animation testing
jest.useFakeTimers();

describe('Logo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render SVG element', () => {
    render(<Logo />);

    // Check if SVG element is rendered
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('should apply animation class after delay', async () => {
    render(<Logo />);

    // Get the animated path element
    const pathElement = document.querySelector('path');
    expect(pathElement).toBeInTheDocument();

    // Initially the animation class should not be applied
    // Fix the null check for the style attribute
    const initialStyle = pathElement?.getAttribute('style') || '';
    expect(initialStyle).not.toContain('animation');

    // Advance timers to trigger the animation
    jest.advanceTimersByTime(300);

    // Now the animation style should be applied
    await waitFor(() => {
      const animationStyle = pathElement?.getAttribute('style') || '';
      const hasStyleAnimation = animationStyle.includes('animation');
      const hasClassAnimation = pathElement?.classList.contains('animatePullRelease');

      // Check that animation is applied in either style or class
      expect(hasStyleAnimation || hasClassAnimation).toBeTruthy();
    });
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

  test('should render correct SVG structure', () => {
    render(<Logo />);

    // Check if SVG has correct viewBox
    const svgElement = document.querySelector('svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 1920 1080');

    // Check if it has the expected number of path elements
    const pathElements = document.querySelectorAll('path');

    // There should be several path elements in the SVG
    expect(pathElements.length).toBeGreaterThan(1);

    // Check that at least one path has the expected fill color
    const hasExpectedPathColor = Array.from(pathElements).some(
      (path) => path.getAttribute('fill') === '#e4e4e4'
    );
    expect(hasExpectedPathColor).toBeTruthy();
  });
});
