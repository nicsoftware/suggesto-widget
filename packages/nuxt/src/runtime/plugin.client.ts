import { useSuggesto } from '@suggesto/vue';
import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { SuggestoWidget as SuggestoCore } from '@suggesto/core';
import { ref } from 'vue';

// Global singleton instance
let globalWidget: SuggestoCore | null = null;
const globalIsLoading = ref(true);
const globalError = ref<string | null>(null);

// Custom composable that uses the global instance
function useSuggestoSingleton(config: any) {
  const openModal = () => globalWidget?.openModal();
  const closeModal = () => globalWidget?.closeModal();

  const on = (event: string, callback: Function) => {
    if (globalWidget) {
      globalWidget.on(event, callback);
    } else {
      // Queue the event listener for when widget is ready
      const checkWidget = () => {
        if (globalWidget) {
          globalWidget.on(event, callback);
        } else {
          setTimeout(checkWidget, 100);
        }
      };
      checkWidget();
    }
  };

  return {
    isLoading: globalIsLoading,
    error: globalError,
    openModal,
    closeModal,
    on,
  };
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.suggesto;

  // Auto-initialize the widget using core library (singleton)
  if (config?.boardId && typeof window !== 'undefined' && !globalWidget) {
    // Use setTimeout to ensure DOM is ready
    setTimeout(async () => {
      try {
        globalWidget = new SuggestoCore(config);
        await globalWidget.load();
        globalIsLoading.value = false;

        // Widget is now loaded silently
        // Event listeners can be added by the application using the composable
      } catch (error) {
        globalError.value = error instanceof Error ? error.message : 'Unknown error';
        globalIsLoading.value = false;
        console.error('Failed to initialize Suggesto widget:', error);
      }
    }, 0);
  }

  return {
    provide: {
      suggesto: useSuggestoSingleton,
      suggestoConfig: config,
      suggestoInstance: () => globalWidget,
    },
  };
});
