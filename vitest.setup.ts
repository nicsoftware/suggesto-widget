import { beforeEach, vi } from 'vitest';

// Mock DOM environment
Object.defineProperty(window, 'location', {
  value: {
    href: 'https://example.com'
  },
  writable: true
});

// Mock CustomEvent for browsers that don't support it
global.CustomEvent = class CustomEvent extends Event {
  detail: any;
  
  constructor(event: string, params: any = {}) {
    super(event, params);
    this.detail = params.detail;
  }
};

// Reset DOM before each test
beforeEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  
  // Reset window.Suggesto
  delete (window as any).Suggesto;
  
  // Clear all timers
  vi.clearAllTimers();
});

// Mock window.addEventListener for custom events
const originalAddEventListener = window.addEventListener;
window.addEventListener = vi.fn().mockImplementation((event, handler, options) => {
  return originalAddEventListener.call(window, event, handler, options);
});
