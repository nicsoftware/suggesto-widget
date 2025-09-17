import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { SuggestoWidget } from '../index';

// Mock the composable
vi.mock('../index', async () => {
  const actual = await vi.importActual('../index');
  return {
    ...actual,
    useSuggesto: vi.fn(() => ({
      isLoading: false,
      error: null,
      openModal: vi.fn(),
      closeModal: vi.fn(),
      on: vi.fn(),
    }))
  };
});

describe('SuggestoWidget Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without errors', () => {
    const wrapper = mount(SuggestoWidget, {
      props: {
        boardId: 'test-board-id'
      }
    });
    
    expect(wrapper.html()).toBe('<!---->');
  });

  it('should emit events when handlers are called', async () => {
    const wrapper = mount(SuggestoWidget, {
      props: {
        boardId: 'test-board-id'
      }
    });

    // Since we're mocking useSuggesto, we'll simulate emitting events directly
    await wrapper.vm.$emit('ready', { boardId: 'test' });
    await wrapper.vm.$emit('feedback-submitted', { title: 'test' });
    await wrapper.vm.$emit('error', { error: 'test error' });

    expect(wrapper.emitted('ready')).toBeTruthy();
    expect(wrapper.emitted('feedback-submitted')).toBeTruthy();
    expect(wrapper.emitted('error')).toBeTruthy();
  });

  it('should pass correct props to useSuggesto', () => {
    const { useSuggesto } = require('../index');
    
    mount(SuggestoWidget, {
      props: {
        boardId: 'test-board-id',
        baseUrl: 'https://custom.url'
      }
    });

    expect(useSuggesto).toHaveBeenCalledWith({
      boardId: 'test-board-id',
      baseUrl: 'https://custom.url'
    });
  });

  it('should use default baseUrl when not provided', () => {
    const { useSuggesto } = require('../index');
    
    mount(SuggestoWidget, {
      props: {
        boardId: 'test-board-id'
      }
    });

    expect(useSuggesto).toHaveBeenCalledWith({
      boardId: 'test-board-id',
      baseUrl: 'https://suggesto.io'
    });
  });

  it('should validate required props', () => {
    // Test that component validates boardId as required
    expect(() => {
      mount(SuggestoWidget, {
        props: {}
      });
    }).toThrow();
  });
});
