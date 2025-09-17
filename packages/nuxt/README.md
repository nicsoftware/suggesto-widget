# @suggesto/nuxt

Nuxt 3 module for Suggesto feedback widget integration. Provides zero-configuration setup with automatic widget loading and optimal performance.

## Installation

```bash
npm install @suggesto/nuxt
```

## Quick Setup

Add the module to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: [
    '@suggesto/nuxt'
  ],
  suggesto: {
    boardId: 'your-board-id', // Required
    baseUrl: 'https://suggesto.io' // Optional
  }
});
```

That's it! The widget will be automatically loaded on all pages.

## Usage

### Automatic Widget Loading

With the module configured, the widget loads automatically on all pages without any additional code:

```vue
<template>
  <div>
    <h1>My Nuxt App</h1>
    <!-- Widget loads automatically -->
  </div>
</template>
```

### Programmatic Control

Access the widget programmatically using the provided composable:

```vue
<template>
  <div>
    <h1>My App</h1>
    <button @click="openFeedback" :disabled="isLoading">
      {{ isLoading ? 'Loading...' : 'Give Feedback' }}
    </button>
    <div v-if="error" class="error">
      Error loading widget: {{ error }}
    </div>
  </div>
</template>

<script setup>
// Access the suggesto composable through Nuxt app
const { $suggesto, $suggestoConfig } = useNuxtApp();
const { isLoading, error, openModal, closeModal, on } = $suggesto($suggestoConfig);

const openFeedback = () => {
  openModal();
};

// Listen for events
on('ready', (data) => {
  console.log('Widget ready:', data);
});

on('feedbackSubmitted', (data) => {
  console.log('Feedback submitted:', data);
  // Track analytics, show toast, etc.
});
</script>
```

### Custom Configuration Per Page

Override default configuration for specific pages:

```vue
<template>
  <div>
    <h1>Special Page</h1>
    <!-- Custom widget instance -->
  </div>
</template>

<script setup>
// Use custom config for this page
const { $suggesto } = useNuxtApp();
const { openModal, on } = $suggesto({
  boardId: 'special-board-id',
  baseUrl: 'https://custom.domain.com'
});

on('ready', (data) => {
  console.log('Custom widget ready:', data);
});
</script>
```

## Configuration

### Module Options

Configure the module in your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@suggesto/nuxt'],
  suggesto: {
    // Required: Your feedback board UUID
    boardId: 'your-board-id',
    
    // Optional: Custom server URL (default: 'https://suggesto.io')
    baseUrl: 'https://your-custom-domain.com'
  }
});
```

### Environment Variables

Use environment variables for different environments:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@suggesto/nuxt'],
  suggesto: {
    boardId: process.env.NUXT_SUGGESTO_BOARD_ID,
    baseUrl: process.env.NUXT_SUGGESTO_BASE_URL || 'https://suggesto.io'
  }
});
```

```bash
# .env
NUXT_SUGGESTO_BOARD_ID=your-production-board-id
NUXT_SUGGESTO_BASE_URL=https://suggesto.io
```

### Runtime Config

Access configuration at runtime:

```vue
<script setup>
const config = useRuntimeConfig();
console.log('Board ID:', config.public.suggesto.boardId);
</script>
```

## API Reference

### Composable: `$suggesto(config)`

The module provides the same composable from [@suggesto/vue](../vue) through the Nuxt app context.

#### Parameters

- `config?: SuggestoConfig` - Optional config override

#### Returns

```typescript
{
  isLoading: Ref<boolean>;         // Widget loading state
  error: Ref<string | null>;       // Error message if loading failed
  openModal: () => void;           // Open feedback modal
  closeModal: () => void;          // Close feedback modal
  on: (event, callback) => void;   // Register event listener
}
```

### Global Properties

The module adds these properties to the Nuxt app:

- `$suggesto` - The useSuggesto composable from @suggesto/vue
- `$suggestoConfig` - The module configuration

## Events

The module supports all events from [@suggesto/core](../core):

### `ready`
```typescript
{
  boardId: string;
  boardSlug: string;
  position: string;
  theme: string;
  color: string;
  widget: any;
}
```

### `feedbackSubmitted`
```typescript
{
  boardId: string;
  category: string;
  title: string;
  body: string;
  feedbackId: string;
  success: boolean;
}
```

### `error`
```typescript
{
  type: string;
  error: string;
  boardId: string;
  context: string;
}
```

## Advanced Usage

### Conditional Loading

Load the widget only on specific pages:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@suggesto/nuxt'],
  suggesto: {
    boardId: 'your-board-id'
  }
});
```

```vue
<!-- pages/contact.vue -->
<template>
  <div>
    <h1>Contact Us</h1>
    <!-- Widget only loads on this page -->
  </div>
</template>

<script setup>
// Only initialize widget on this specific page
const { $suggesto, $suggestoConfig } = useNuxtApp();

onMounted(() => {
  if (process.client) {
    $suggesto($suggestoConfig);
  }
});
</script>
```

### Multiple Widgets

Use different widgets for different sections:

```vue
<script setup>
const { $suggesto } = useNuxtApp();

// Main product feedback
const mainWidget = $suggesto({
  boardId: 'main-product-board-id'
});

// Beta feature feedback
const betaWidget = $suggesto({
  boardId: 'beta-features-board-id'
});
</script>
```

### Analytics Integration

Track widget events with your analytics:

```vue
<script setup>
const { $suggesto, $suggestoConfig } = useNuxtApp();
const { on } = $suggesto($suggestoConfig);

on('feedbackSubmitted', (data) => {
  // Google Analytics
  gtag('event', 'feedback_submitted', {
    category: data.category,
    board_id: data.boardId
  });
  
  // Plausible
  plausible('Feedback Submitted', {
    props: {
      category: data.category,
      board: data.boardId
    }
  });
});
</script>
```

## Performance

### Server-Side Rendering

The widget is client-side only and won't affect your SSR performance. It loads after hydration is complete.

### Code Splitting

The widget script is loaded dynamically, keeping your main bundle size minimal.

### Caching

Widget configurations are cached on the server for optimal performance.

## TypeScript Support

Full TypeScript support with auto-completion:

```typescript
// types/suggesto.d.ts
import type { SuggestoEvents } from '@suggesto/nuxt';

// Extend Nuxt app type
declare module '#app' {
  interface NuxtApp {
    $suggesto: typeof import('@suggesto/vue').useSuggesto;
    $suggestoConfig: import('@suggesto/core').SuggestoConfig;
  }
}
```

## Troubleshooting

### Module not loading

1. Ensure you've added the module to `nuxt.config.ts`
2. Check that `boardId` is correctly configured
3. Verify your domain is whitelisted in Suggesto dashboard

### Widget not appearing

The widget loads client-side only. Check browser console for errors and ensure JavaScript is enabled.

### TypeScript errors

Install the required types:

```bash
npm install @types/node
```

Make sure your `nuxt.config.ts` has proper TypeScript configuration.

## Migration

### From Vue Plugin

If migrating from the Vue plugin:

```diff
- import { SuggestoWidget } from '@suggesto/vue';
+ // Remove manual import, widget loads automatically

// nuxt.config.ts
export default defineNuxtConfig({
+  modules: ['@suggesto/nuxt'],
+  suggesto: {
+    boardId: 'your-board-id'
+  }
});
```

### From Script Tag

If migrating from script tag installation:

```diff
// Remove from app.html or layouts
- <script src="https://suggesto.io/widget/your-board-id"></script>

// Add to nuxt.config.ts
+ modules: ['@suggesto/nuxt'],
+ suggesto: {
+   boardId: 'your-board-id'
+ }
```

## Examples

Check the [playground](./playground/) directory for a complete working example.

## License

MIT
