import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SuggestoWidget } from '../index';

describe('SuggestoWidget', () => {
  beforeEach(() => {
    // Reset DOM
    document.head.innerHTML = '';
    delete (window as any).Suggesto;
  });

  it('should create widget with correct configuration', () => {
    const widget = new SuggestoWidget({ boardId: 'test-id' });
    expect(widget).toBeDefined();
  });

  it('should load widget script', async () => {
    const widget = new SuggestoWidget({ boardId: 'test-id' });

    // Mock window.Suggesto immediately
    (window as any).Suggesto = { version: '1.0.0' };

    // Mock script onload to fire immediately
    const originalCreateElement = document.createElement;
    document.createElement = vi.fn().mockImplementation((tagName) => {
      if (tagName === 'script') {
        const script = originalCreateElement.call(document, tagName);
        // Mock onload to fire immediately
        setTimeout(() => {
          if (script.onload) script.onload(new Event('load') as any);
        }, 0);
        return script;
      }
      return originalCreateElement.call(document, tagName);
    });

    await widget.load();

    const scripts = document.head.querySelectorAll('script');
    expect(scripts).toHaveLength(1);
    expect(scripts[0].src).toBe('https://suggesto.io/widget/test-id');

    // Restore
    document.createElement = originalCreateElement;
  });

  it('should use custom baseUrl when provided', async () => {
    const widget = new SuggestoWidget({
      boardId: 'test-id',
      baseUrl: 'https://custom.domain.com'
    });

    // Mock window.Suggesto immediately
    (window as any).Suggesto = { version: '1.0.0' };

    // Mock script onload to fire immediately
    const originalCreateElement = document.createElement;
    document.createElement = vi.fn().mockImplementation((tagName) => {
      if (tagName === 'script') {
        const script = originalCreateElement.call(document, tagName);
        setTimeout(() => {
          if (script.onload) script.onload(new Event('load') as any);
        }, 0);
        return script;
      }
      return originalCreateElement.call(document, tagName);
    });

    await widget.load();

    const scripts = document.head.querySelectorAll('script');
    expect(scripts[0].src).toBe('https://custom.domain.com/widget/test-id');

    document.createElement = originalCreateElement;
  });

  it('should not load multiple times', async () => {
    const widget = new SuggestoWidget({ boardId: 'test-id' });

    // Mock window.Suggesto immediately
    (window as any).Suggesto = { version: '1.0.0' };

    // Mock script onload to fire immediately
    const originalCreateElement = document.createElement;
    document.createElement = vi.fn().mockImplementation((tagName) => {
      if (tagName === 'script') {
        const script = originalCreateElement.call(document, tagName);
        setTimeout(() => {
          if (script.onload) script.onload(new Event('load') as any);
        }, 0);
        return script;
      }
      return originalCreateElement.call(document, tagName);
    });

    await widget.load();
    await widget.load();

    const scripts = document.head.querySelectorAll('script');
    expect(scripts).toHaveLength(1);

    document.createElement = originalCreateElement;
  });

  it('should handle load errors', async () => {
    const widget = new SuggestoWidget({ boardId: 'test-id' });

    // Mock script onerror
    const originalCreateElement = document.createElement;
    document.createElement = vi.fn().mockImplementation((tagName) => {
      if (tagName === 'script') {
        const script = originalCreateElement.call(document, tagName);
        setTimeout(() => {
          if (script.onerror) script.onerror(new Error('Network error'));
        }, 0);
        return script;
      }
      return originalCreateElement.call(document, tagName);
    });

    await expect(widget.load()).rejects.toThrow('Failed to load Suggesto widget script');

    document.createElement = originalCreateElement;
  });

  it('should register and emit events', () => {
    const widget = new SuggestoWidget({ boardId: 'test-id' });
    const readyHandler = vi.fn();

    widget.on('ready', readyHandler);

    // Simulate the ready event
    const event = new CustomEvent('suggestoReady', {
      detail: {
        boardId: 'test-id',
        boardSlug: 'test-slug',
        position: 'bottom_right',
        theme: 'light',
        color: '#000000',
        widget: {}
      }
    });

    window.dispatchEvent(event);

    expect(readyHandler).toHaveBeenCalledWith({
      boardId: 'test-id',
      boardSlug: 'test-slug',
      position: 'bottom_right',
      theme: 'light',
      color: '#000000',
      widget: {}
    });
  });

  it('should unregister event listeners', () => {
    const widget = new SuggestoWidget({ boardId: 'test-id' });
    const readyHandler = vi.fn();

    widget.on('ready', readyHandler);
    widget.off('ready', readyHandler);

    // Simulate the ready event
    const event = new CustomEvent('suggestoReady', {
      detail: {
        boardId: 'test-id',
        boardSlug: 'test-slug',
        position: 'bottom_right',
        theme: 'light',
        color: '#000000',
        widget: {}
      }
    });

    window.dispatchEvent(event);

    expect(readyHandler).not.toHaveBeenCalled();
  });

  it('should call openModal when available', () => {
    const widget = new SuggestoWidget({ boardId: 'test-id' });
    const mockOpenModal = vi.fn();

    (window as any).Suggesto = {
      openModal: mockOpenModal
    };

    widget.openModal();

    expect(mockOpenModal).toHaveBeenCalled();
  });

  it('should call closeModal when available', () => {
    const widget = new SuggestoWidget({ boardId: 'test-id' });
    const mockCloseModal = vi.fn();

    (window as any).Suggesto = {
      closeModal: mockCloseModal
    };

    widget.closeModal();

    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('should clean up on destroy', () => {
    const widget = new SuggestoWidget({ boardId: 'test-id' });
    const mockDestroy = vi.fn();

    // Add a script element
    const script = document.createElement('script');
    document.head.appendChild(script);
    (widget as any).scriptElement = script;

    (window as any).Suggesto = {
      destroy: mockDestroy
    };

    widget.destroy();

    expect(mockDestroy).toHaveBeenCalled();
    expect(document.head.querySelectorAll('script')).toHaveLength(0);
  });
});
