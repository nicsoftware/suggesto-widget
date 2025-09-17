export interface SuggestoConfig {
  boardId: string;
  baseUrl?: string; // Default: https://suggesto.io
}

export interface SuggestoEvents {
  ready: {
    boardId: string;
    boardSlug: string;
    position: string;
    theme: string;
    color: string;
    widget: any;
  };
  feedbackSubmitted: {
    boardId: string;
    category: string;
    title: string;
    body: string;
    feedbackId: string;
    success: boolean;
  };
  error: {
    type: string;
    error: string;
    boardId: string;
    context: string;
  };
}

export class SuggestoWidget {
  private config: SuggestoConfig;
  private listeners: Map<keyof SuggestoEvents, Function[]> = new Map();
  private isLoaded = false;
  private scriptElement: HTMLScriptElement | null = null;

  constructor(config: SuggestoConfig) {
    this.config = {
      baseUrl: 'https://suggesto.io',
      ...config
    };
    this.setupEventListeners();
  }

  async load(): Promise<void> {
    if (this.isLoaded) {
      console.warn('Suggesto widget already loaded');
      return;
    }

    return new Promise((resolve, reject) => {
      this.scriptElement = document.createElement('script');
      this.scriptElement.src = `${this.config.baseUrl}/widget/${this.config.boardId}`;
      this.scriptElement.async = true;

      this.scriptElement.onload = () => {
        this.isLoaded = true;
        this.waitForSuggestoReady().then(resolve).catch(reject);
      };

      this.scriptElement.onerror = () => {
        reject(new Error('Failed to load Suggesto widget script'));
      };

      document.head.appendChild(this.scriptElement);
    });
  }

  private async waitForSuggestoReady(): Promise<void> {
    return new Promise((resolve) => {
      const checkSuggesto = () => {
        if (window.Suggesto) {
          resolve();
        } else {
          setTimeout(checkSuggesto, 50);
        }
      };
      checkSuggesto();
    });
  }

  private setupEventListeners(): void {
    // Setup global event listeners for Suggesto events
    if (typeof window !== 'undefined') {
      window.addEventListener('suggestoReady', (event) => {
        const customEvent = event as CustomEvent;
        this.emit('ready', customEvent.detail);
      });

      window.addEventListener('suggestoFeedbackSubmitted', (event) => {
        const customEvent = event as CustomEvent;
        this.emit('feedbackSubmitted', customEvent.detail);
      });

      window.addEventListener('suggestoError', (event) => {
        const customEvent = event as CustomEvent;
        this.emit('error', customEvent.detail);
      });
    }
  }

  on<K extends keyof SuggestoEvents>(
    event: K,
    callback: (data: SuggestoEvents[K]) => void
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off<K extends keyof SuggestoEvents>(
    event: K,
    callback: (data: SuggestoEvents[K]) => void
  ): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  }

  private emit<K extends keyof SuggestoEvents>(
    event: K,
    data: SuggestoEvents[K]
  ): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  openModal(): void {
    if (window.Suggesto) {
      window.Suggesto.openModal();
    }
  }

  closeModal(): void {
    if (window.Suggesto) {
      window.Suggesto.closeModal();
    }
  }

  destroy(): void {
    if (window.Suggesto) {
      window.Suggesto.destroy();
    }

    if (this.scriptElement) {
      this.scriptElement.remove();
      this.scriptElement = null;
    }

    this.listeners.clear();
    this.isLoaded = false;
  }
}

// Global type augmentation
declare global {
  interface Window {
    Suggesto?: {
      init(): void;
      destroy(): void;
      openModal(): void;
      closeModal(): void;
      forceRefresh(): void;
      version: string;
    };
  }
}
