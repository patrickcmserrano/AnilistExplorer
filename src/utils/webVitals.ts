/**
 * Web Vitals monitoring for performance tracking
 * Helps identify performance regressions
 */

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

// Thresholds based on Core Web Vitals
const THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

function logMetric(metric: WebVitalsMetric) {
  // Only log in development
  if (import.meta.env.DEV) {
    const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
    console.log(`${emoji} ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
  }
  
  // In production, you could send to analytics
  // sendToAnalytics(metric);
}

export function initWebVitals() {
  // First Contentful Paint (FCP)
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        const metric: WebVitalsMetric = {
          name: 'FCP',
          value: entry.startTime,
          rating: getRating('FCP', entry.startTime),
          delta: entry.startTime,
          id: crypto.randomUUID(),
        };
        logMetric(metric);
      }
    }
  });

  try {
    observer.observe({ type: 'paint', buffered: true });
  } catch (e) {
    // Paint timing not supported
  }

  // Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    
    const metric: WebVitalsMetric = {
      name: 'LCP',
      value: lastEntry.startTime,
      rating: getRating('LCP', lastEntry.startTime),
      delta: lastEntry.startTime,
      id: crypto.randomUUID(),
    };
    logMetric(metric);
  });

  try {
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    // LCP not supported
  }

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
      }
    }
  });

  try {
    clsObserver.observe({ type: 'layout-shift', buffered: true });
    
    // Report CLS on page hide
    addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        const metric: WebVitalsMetric = {
          name: 'CLS',
          value: clsValue,
          rating: getRating('CLS', clsValue),
          delta: clsValue,
          id: crypto.randomUUID(),
        };
        logMetric(metric);
      }
    });
  } catch (e) {
    // Layout shift not supported
  }

  // Time to First Byte (TTFB)
  const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navEntry) {
    const ttfb = navEntry.responseStart;
    const metric: WebVitalsMetric = {
      name: 'TTFB',
      value: ttfb,
      rating: getRating('TTFB', ttfb),
      delta: ttfb,
      id: crypto.randomUUID(),
    };
    logMetric(metric);
  }
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') {
    initWebVitals();
  } else {
    addEventListener('load', initWebVitals);
  }
}
