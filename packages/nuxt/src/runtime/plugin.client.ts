import { useSuggesto } from '@suggesto/vue';
import { defineNuxtPlugin, useRuntimeConfig } from '#app';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.suggesto;

  return {
    provide: {
      suggesto: useSuggesto,
      suggestoConfig: config,
    },
  };
});
