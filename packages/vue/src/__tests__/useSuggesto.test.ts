import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { useSuggesto } from '../index';

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
    const TestComponent = defineComponent({
      setup() {
        const { isLoading, error, openModal, closeModal, on } = useSuggesto({
          boardId: 'test-board-id'
        });

        return {
          isLoading,
          error,
          openModal,
          closeModal,
          on
        };
      },
      template: '<div>{{ isLoading }}</div>'
    });

    const wrapper = mount(TestComponent);

    expect(wrapper.vm.isLoading).toBe(true);
    expect(wrapper.vm.error).toBe(null);
    expect(typeof wrapper.vm.openModal).toBe('function');
    expect(typeof wrapper.vm.closeModal).toBe('function');
    expect(typeof wrapper.vm.on).toBe('function');
  });

  it('should handle loading errors', async () => {
    const { SuggestoWidget } = await import('@suggesto/core');
    
    const mockWidget = {
      load: vi.fn().mockRejectedValue(new Error('Failed to load')),
      destroy: vi.fn(),
      on: vi.fn(),
      openModal: vi.fn(),
      closeModal: vi.fn(),
    };

    vi.mocked(SuggestoWidget as any).mockImplementation(() => mockWidget);

    const TestComponent = defineComponent({
      setup() {
        const { isLoading, error } = useSuggesto({
          boardId: 'test-board-id'
        });

        return {
          isLoading,
          error
        };
      },
      template: '<div>{{ error }}</div>'
    });

    const wrapper = mount(TestComponent);

    // Wait for the next tick to allow async operations
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(wrapper.vm.isLoading).toBe(false);
    expect(wrapper.vm.error).toBe('Failed to load');
  });

  it('should cleanup widget on unmount', async () => {
    const { SuggestoWidget } = await import('@suggesto/core');
    
    const mockWidget = {
      load: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn(),
      on: vi.fn(),
      openModal: vi.fn(),
      closeModal: vi.fn(),
    };

    vi.mocked(SuggestoWidget as any).mockImplementation(() => mockWidget);

    const TestComponent = defineComponent({
      setup() {
        return useSuggesto({
          boardId: 'test-board-id'
        });
      },
      template: '<div>test</div>'
    });

    const wrapper = mount(TestComponent);
    wrapper.unmount();

    expect(mockWidget.destroy).toHaveBeenCalled();
  });

  it('should provide working openModal function', () => {
    const { SuggestoWidget } = require('@suggesto/core');
    
    const mockWidget = {
      load: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn(),
      on: vi.fn(),
      openModal: vi.fn(),
      closeModal: vi.fn(),
    };

    vi.mocked(SuggestoWidget as any).mockImplementation(() => mockWidget);

    const TestComponent = defineComponent({
      setup() {
        const { openModal } = useSuggesto({
          boardId: 'test-board-id'
        });

        return {
          openModal
        };
      },
      template: '<button @click="openModal">Open</button>'
    });

    const wrapper = mount(TestComponent);
    wrapper.find('button').trigger('click');

    expect(mockWidget.openModal).toHaveBeenCalled();
  });

  it('should provide working closeModal function', () => {
    const { SuggestoWidget } = require('@suggesto/core');
    
    const mockWidget = {
      load: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn(),
      on: vi.fn(),
      openModal: vi.fn(),
      closeModal: vi.fn(),
    };

    vi.mocked(SuggestoWidget as any).mockImplementation(() => mockWidget);

    const TestComponent = defineComponent({
      setup() {
        const { closeModal } = useSuggesto({
          boardId: 'test-board-id'
        });

        return {
          closeModal
        };
      },
      template: '<button @click="closeModal">Close</button>'
    });

    const wrapper = mount(TestComponent);
    wrapper.find('button').trigger('click');

    expect(mockWidget.closeModal).toHaveBeenCalled();
  });
});
