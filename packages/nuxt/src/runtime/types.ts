import type { SuggestoConfig, SuggestoEvents } from '@suggesto/core';

declare module '#app' {
  interface NuxtApp {
    $suggesto: typeof import('@suggesto/vue').useSuggesto;
    $suggestoConfig: SuggestoConfig;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $suggesto: typeof import('@suggesto/vue').useSuggesto;
    $suggestoConfig: SuggestoConfig;
  }
}

export type { SuggestoConfig, SuggestoEvents };
