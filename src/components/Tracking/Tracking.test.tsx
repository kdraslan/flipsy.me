import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tracking from './Tracking';
import { analyticsService } from '../../firebase/services';

// Mock CSS Module
jest.mock('./Tracking.module.css', () => ({
    container: 'container',
    title: 'title',
    subtitle: 'subtitle',
    section: 'section',
    sectionTitle: 'sectionTitle',
    counter: 'counter',
    button: 'button',
    errorMessage: 'errorMessage',
    inputContainer: 'inputContainer',
    input: 'input',
    resultList: 'resultList',
    resultItem: 'resultItem',
    footer: 'footer',
    footerText: 'footerText'
}));

// Simple mock for the firebase hooks
jest.mock('../../firebase/hooks', () => ({
    // Just return undefined for all hooks to trigger fallbacks
}));

// Mock the firebase services
jest.mock('../../firebase/services', () => ({
    analyticsService: {
        setUserId: jest.fn(),
        setUserProperties: jest.fn(),
        logSearch: jest.fn(),
        logEvent: jest.fn()
    }
}));

describe('Tracking', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        console.log = jest.fn() as jest.Mock;
    });

    test('should render the component with all sections', () => {
        render(<Tracking />);

        // Check main heading
        expect(screen.getByText('Firebase Tracking Test Component')).toBeInTheDocument();

        // Check section headings
        expect(screen.getByText('Button Click Tracking')).toBeInTheDocument();
        expect(screen.getByText('Error Tracking')).toBeInTheDocument();
        expect(screen.getByText('Search Tracking')).toBeInTheDocument();
        expect(screen.getByText('Custom Event Tracking')).toBeInTheDocument();
    });

    test('should set user ID and properties on mount', () => {
        render(<Tracking />);

        // Check that we attempted to set user ID
        expect(console.log).toHaveBeenCalled();
        const mockedLog = console.log as jest.Mock;
        expect(mockedLog.mock.calls[0][0]).toBe('Set user ID:');
    });

    test('should increment counter and track button click', () => {
        render(<Tracking />);

        // Initial counter should be 0
        expect(screen.getByText('Counter: 0')).toBeInTheDocument();

        // Click the increment button
        fireEvent.click(screen.getByText('Increment Counter (Tracks Button Click)'));

        // Counter should increment
        expect(screen.getByText('Counter: 1')).toBeInTheDocument();

        // Should log a tracking message
        expect(console.log).toHaveBeenCalledWith('Tracked button click: increment_button');
    });

    test('should trigger and track an error', () => {
        render(<Tracking />);

        // Error message should not be visible initially
        expect(screen.queryByText(/Error triggered and tracked/)).not.toBeInTheDocument();

        // Click the error button
        fireEvent.click(screen.getByText('Trigger Test Error'));

        // Error message should now be visible
        expect(screen.getByText(/Error triggered and tracked/)).toBeInTheDocument();

        // Should log a tracking message
        expect(console.log).toHaveBeenCalledWith('Tracked error: TEST_ERROR');
    });

    test('should perform and track a search', async () => {
        render(<Tracking />);

        // Set search query
        const searchInput = screen.getByPlaceholderText('Enter search query');
        fireEvent.change(searchInput, { target: { value: 'test query' } });

        // Perform search
        fireEvent.click(screen.getByText('Search'));

        // Wait for search to complete and results to be displayed
        await waitFor(() => {
            expect(screen.getByText(/Result for "test query" - Item 1/)).toBeInTheDocument();
        });

        // Check for the specific log message
        const mockedLog = console.log as jest.Mock;
        const calls = mockedLog.mock.calls;
        const hasSearchLog = calls.some(call =>
            call[0].includes('Tracked search for:') && call[0].includes('test query')
        );
        expect(hasSearchLog).toBe(true);
    });

    test('should log a custom event', () => {
        render(<Tracking />);

        // Set custom event data
        const customEventInput = screen.getByPlaceholderText('Enter custom event data');
        fireEvent.change(customEventInput, { target: { value: 'custom data' } });

        // Log custom event
        fireEvent.click(screen.getByText('Log Custom Event'));

        // Check that custom event was tracked - find it in any console.log call
        const mockedLog = console.log as jest.Mock;
        const calls = mockedLog.mock.calls;
        const hasCustomEventLog = calls.some(call =>
            call[0] === 'Tracked custom event with data:' && call[1] === 'custom data'
        );
        expect(hasCustomEventLog).toBe(true);

        // Input should be cleared
        expect(customEventInput).toHaveValue('');
    });
});
