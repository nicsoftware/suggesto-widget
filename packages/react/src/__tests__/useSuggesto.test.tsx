import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSuggesto, SuggestoWidget } from '../index';

// Mock the core package
vi.mock('@suggesto/core', () => ({
  SuggestoWidget: vi.fn(() => ({
    load: vi.fn().mockResolvedValue(undefined),
    destroy: vi.fn(),
    on: vi.fn(),
    openModal: vi.fn(),
    closeModal: vi.fn(),
  }))
}));

describe('useSuggesto', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize widget with correct config', async () => {
    const config = { boardId: 'test-board-id' };
    
    const { result } = renderHook(() => useSuggesto(config));
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    
    // Wait for loading to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle loading errors', async () => {
    const mockWidget = {
      load: vi.fn().mockRejectedValue(new Error('Failed to load')),
      destroy: vi.fn(),
      on: vi.fn(),
      openModal: vi.fn(),
      closeModal: vi.fn(),
    };

    vi.mocked(SuggestoWidget as any).mockImplementation(() => mockWidget);

    const config = { boardId: 'test-board-id' };
    const { result } = renderHook(() => useSuggesto(config));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Failed to load');
  });

  it('should provide openModal function', () => {
    const config = { boardId: 'test-board-id' };
    const { result } = renderHook(() => useSuggesto(config));
    
    expect(typeof result.current.openModal).toBe('function');
    
    act(() => {
      result.current.openModal();
    });
  });

  it('should provide closeModal function', () => {
    const config = { boardId: 'test-board-id' };
    const { result } = renderHook(() => useSuggesto(config));
    
    expect(typeof result.current.closeModal).toBe('function');
    
    act(() => {
      result.current.closeModal();
    });
  });

  it('should provide on function for event listeners', () => {
    const config = { boardId: 'test-board-id' };
    const { result } = renderHook(() => useSuggesto(config));
    
    expect(typeof result.current.on).toBe('function');
    
    const callback = vi.fn();
    act(() => {
      result.current.on('ready', callback);
    });
  });

  it('should cleanup widget on unmount', () => {
    const mockWidget = {
      load: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn(),
      on: vi.fn(),
      openModal: vi.fn(),
      closeModal: vi.fn(),
    };

    vi.mocked(SuggestoWidget as any).mockImplementation(() => mockWidget);

    const config = { boardId: 'test-board-id' };
    const { unmount } = renderHook(() => useSuggesto(config));
    
    unmount();
    
    expect(mockWidget.destroy).toHaveBeenCalled();
  });

  it('should recreate widget when config changes', async () => {
    const mockWidget1 = {
      load: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn(),
      on: vi.fn(),
      openModal: vi.fn(),
      closeModal: vi.fn(),
    };

    const mockWidget2 = {
      load: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn(),
      on: vi.fn(),
      openModal: vi.fn(),
      closeModal: vi.fn(),
    };

    vi.mocked(SuggestoWidget as any)
      .mockImplementationOnce(() => mockWidget1)
      .mockImplementationOnce(() => mockWidget2);

    const { rerender } = renderHook(
      ({ config }) => useSuggesto(config),
      {
        initialProps: { config: { boardId: 'test-board-id-1' } }
      }
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    rerender({ config: { boardId: 'test-board-id-2' } });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockWidget1.destroy).toHaveBeenCalled();
    expect(SuggestoWidget).toHaveBeenCalledTimes(2);
  });
});
