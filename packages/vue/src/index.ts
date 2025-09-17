import { ref, onMounted, onUnmounted, Ref } from 'vue';
import {
  SuggestoWidget as SuggestoWidgetCore,
  SuggestoConfig,
  SuggestoEvents,
} from '@suggesto/core';

export function useSuggesto(config: SuggestoConfig) {
  const widget = ref<SuggestoWidgetCore | null>(null);
  const isLoading = ref(true);
  const error = ref<string | null>(null);

  onMounted(async () => {
    widget.value = new SuggestoWidgetCore(config);

    try {
      await widget.value.load();
      isLoading.value = false;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      isLoading.value = false;
    }
  });

  onUnmounted(() => {
    widget.value?.destroy();
  });

  const on = <K extends keyof SuggestoEvents>(
    event: K,
    callback: (data: SuggestoEvents[K]) => void
  ) => {
    widget.value?.on(event, callback);
  };

  const openModal = () => widget.value?.openModal();
  const closeModal = () => widget.value?.closeModal();

  return {
    isLoading,
    error,
    openModal,
    closeModal,
    on,
  };
}

export interface SuggestoWidgetProps {
  boardId: string;
  baseUrl?: string;
}

// Vue Component
export default {
  name: 'SuggestoWidget',
  props: {
    boardId: {
      type: String,
      required: true,
    },
    baseUrl: {
      type: String,
      default: 'https://suggesto.io',
    },
  },
  emits: ['ready', 'feedback-submitted', 'error'],
  setup(props: any, { emit }: any) {
    const { on } = useSuggesto({
      boardId: props.boardId,
      baseUrl: props.baseUrl,
    });

    on('ready', (data) => emit('ready', data));
    on('feedbackSubmitted', (data) => emit('feedback-submitted', data));
    on('error', (data) => emit('error', data));

    return {};
  },
  render() {
    return null; // Widget renders itself
  },
};

// Named export for composition API style
export const SuggestoWidget = {
  name: 'SuggestoWidget',
  props: {
    boardId: {
      type: String,
      required: true,
    },
    baseUrl: {
      type: String,
      default: 'https://suggesto.io',
    },
  },
  emits: ['ready', 'feedback-submitted', 'error'],
  setup(props: any, { emit }: any) {
    const { on } = useSuggesto({
      boardId: props.boardId,
      baseUrl: props.baseUrl,
    });

    on('ready', (data) => emit('ready', data));
    on('feedbackSubmitted', (data) => emit('feedback-submitted', data));
    on('error', (data) => emit('error', data));

    return {};
  },
  render() {
    return null;
  },
};

// Re-export types and utilities from core
export type { SuggestoConfig, SuggestoEvents } from '@suggesto/core';
