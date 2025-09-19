import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit';

export interface ModuleOptions {
  boardId?: string;
  baseUrl?: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@suggesto/nuxt',
    configKey: 'suggesto',
    compatibility: {
      nuxt: '^3.0.0 || ^4.0.0',
    },
  },
  defaults: {
    baseUrl: 'https://suggesto.io',
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // Add runtime config
    nuxt.options.runtimeConfig.public.suggesto = {
      ...options,
    };

    // Add plugin
    addPlugin(resolve('./runtime/plugin.client.js'));

    // Add types
    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ types: '@suggesto/nuxt' });
    });
  },
});
