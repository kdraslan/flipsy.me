import { useEffect, useRef } from 'react';
import { analyticsService, performanceService } from './services';

// Analytics hooks
export const usePageTracking = (pageName: string, pageClass?: string) => {
    useEffect(() => {
        analyticsService.logPageView(pageName, pageClass);
        // You could also track time spent on page here
        const startTime = Date.now();

        return () => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            analyticsService.logEvent('page_exit', {
                page_name: pageName,
                time_spent_seconds: timeSpent
            });
        };
    }, [pageName, pageClass]);
};

export const useButtonTracking = (buttonName: string, componentName?: string) => {
    return () => {
        analyticsService.logButtonClick(buttonName, componentName);
    };
};

export const useErrorTracking = () => {
    return (errorCode: string, errorMessage: string, errorContext?: string) => {
        analyticsService.logError(errorCode, errorMessage, errorContext);
    };
};

// Performance hooks
export const useComponentPerformance = (componentName: string) => {
    const traceRef = useRef<any>(null);

    useEffect(() => {
        const startComponentTrace = async () => {
            try {
                traceRef.current = performanceService.componentRenderTrace?.(componentName);
                if (traceRef.current) {
                    await traceRef.current.start?.();
                    await traceRef.current.putMetric?.('mount_started', performance.now());
                }
            } catch (error) {
                console.error(`Error starting performance trace for ${componentName}:`, error);
            }
        };

        startComponentTrace();

        return () => {
            const finishComponentTrace = async () => {
                try {
                    if (traceRef.current) {
                        await traceRef.current.putMetric?.('unmount_time', performance.now());
                        await traceRef.current.stop?.();
                    }
                } catch (error) {
                    console.error(`Error stopping performance trace for ${componentName}:`, error);
                }
            };

            finishComponentTrace();
        };
    }, [componentName]);

    const measureOperation = async (operationName: string, operation: () => Promise<any>) => {
        if (!traceRef.current) return await operation();

        const startTime = performance.now();
        try {
            return await operation();
        } finally {
            try {
                const duration = performance.now() - startTime;
                await traceRef.current.putMetric?.(`op_${operationName}`, duration);
            } catch (error) {
                console.error(`Error measuring operation ${operationName}:`, error);
            }
        }
    };

    return { measureOperation };
};
