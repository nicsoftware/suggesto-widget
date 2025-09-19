import { useEffect, useRef, useState } from 'react';
import {
  SuggestoWidget as SuggestoWidgetCore,
  SuggestoConfig,
  SuggestoEvents,
} from '@suggesto/core';

export function useSuggesto(config: SuggestoConfig) {
  const widgetRef = useRef<SuggestoWidgetCore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);

  // Queue for events registered before widget is loaded
  const eventQueueRef = useRef<Array<{
    event: keyof SuggestoEvents;
    callback: (data: any) => void;
  }>>([]);

  useEffect(() => {
    const widget = new SuggestoWidgetCore(config);
    widgetRef.current = widget;

    widget
      .load()
      .then(() => {
        setIsLoading(false);
        setIsWidgetLoaded(true);

        // Process queued events
        eventQueueRef.current.forEach(({ event, callback }) => {
          widget.on(event, callback);
        });
        eventQueueRef.current = []; // Clear the queue
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });

    return () => {
      widget.destroy();
      widgetRef.current = null;
      eventQueueRef.current = [];
    };
  }, [config.boardId, config.baseUrl]);

  const on = <K extends keyof SuggestoEvents>(
    event: K,
    callback: (data: SuggestoEvents[K]) => void
  ) => {
    if (isWidgetLoaded && widgetRef.current) {
      // Widget is loaded, register immediately
      widgetRef.current.on(event, callback);
    } else {
      // Widget not loaded yet, add to queue
      eventQueueRef.current.push({ event, callback });
    }
  };

  const openModal = () => widgetRef.current?.openModal();
  const closeModal = () => widgetRef.current?.closeModal();

  return {
    isLoading,
    error,
    openModal,
    closeModal,
    on,
  };
}

export interface SuggestoWidgetProps extends SuggestoConfig {
  onReady?: (data: SuggestoEvents['ready']) => void;
  onFeedbackSubmitted?: (data: SuggestoEvents['feedbackSubmitted']) => void;
  onError?: (data: SuggestoEvents['error']) => void;
}

export function SuggestoWidget({
  onReady,
  onFeedbackSubmitted,
  onError,
  ...config
}: SuggestoWidgetProps) {
  const { on } = useSuggesto(config);

  useEffect(() => {
    if (onReady) on('ready', onReady);
    if (onFeedbackSubmitted) on('feedbackSubmitted', onFeedbackSubmitted);
    if (onError) on('error', onError);
  }, [on, onReady, onFeedbackSubmitted, onError]);

  return null; // Widget renders itself
}

// Re-export types and utilities from core
export type { SuggestoConfig, SuggestoEvents } from '@suggesto/core';
