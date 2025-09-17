# @suggesto/vue

Vue 3 composables and components for Suggesto feedback widget integration.

## Installation

```bash
npm install @suggesto/vue
```

## Quick Start

### Using the Component (Recommended)

```vue
<template>
  <div>
    <h1>My App</h1>
    <SuggestoWidget
      :board-id="boardId"
      @ready="handleReady"
      @feedback-submitted="handleFeedbackSubmitted"
      @error="handleError"
    />
  </div>
</template>

<script setup>
import { SuggestoWidget } from '@suggesto/vue';

const boardId = 'your-board-id';

const handleReady = (data) => {
  console.log('Widget ready:', data.boardSlug);
};

const handleFeedbackSubmitted = (data) => {
  console.log('Feedback submitted:', data.title);
};

const handleError = (error) => {
  console.error('Widget error:', error);
};
</script>
```

### Using with Options API

```vue
<template>
  <div>
    <h1>My App</h1>
    <SuggestoWidget
      :board-id="boardId"
      @ready="onReady"
      @feedback-submitted="onFeedbackSubmitted"
    />
  </div>
</template>

<script>
import { SuggestoWidget } from '@suggesto/vue';

export default {
  components: {
    SuggestoWidget
  },
  data() {
    return {
      boardId: 'your-board-id'
    };
  },
  methods: {
    onReady(data) {
      console.log('Widget ready:', data);
    },
    onFeedbackSubmitted(data) {
      console.log('Feedback submitted:', data);
    }
  }
};
</script>
```

### Using the Composable

```vue
<template>
  <div>
    <h1>My App</h1>
    <div v-if="isLoading">Loading widget...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <button @click="openModal" :disabled="isLoading">
      Give Feedback
    </button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useSuggesto } from '@suggesto/vue';

const { isLoading, error, openModal, on } = useSuggesto({
  boardId: 'your-board-id'
});

onMounted(() => {
  on('ready', (data) => {
    console.log('Widget ready:', data);
  });

  on('feedbackSubmitted', (data) => {
    console.log('Feedback submitted:', data);
  });
});
</script>
```

## API Reference

### `<SuggestoWidget>`

Vue component that automatically manages the widget lifecycle.

#### Props

- `board-id` (required): Your feedback board UUID
- `base-url` (optional): Custom server URL (default: 'https://suggesto.io')

#### Events

- `@ready`: Emitted when widget loads successfully
- `@feedback-submitted`: Emitted when feedback is submitted
- `@error`: Emitted when an error occurs

#### Example

```vue
<SuggestoWidget
  :board-id="boardId"
  :base-url="customUrl"
  @ready="(data) => console.log('Ready:', data)"
  @feedback-submitted="(data) => trackFeedback(data)"
  @error="(error) => handleError(error)"
/>
```

### `useSuggesto(config)`

Vue 3 composable for programmatic control over the widget.

#### Parameters

- `config: SuggestoConfig`
  - `boardId: string` - Your feedback board UUID (required)
  - `baseUrl?: string` - Custom server URL (optional)

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

#### Example

```vue
<script setup>
import { useSuggesto } from '@suggesto/vue';

const { isLoading, error, openModal, closeModal, on } = useSuggesto({
  boardId: 'your-board-id'
});

// Register event listeners
on('ready', (data) => {
  console.log('Widget configuration:', data);
});

on('feedbackSubmitted', (data) => {
  // Track analytics, show toast, etc.
  console.log('Feedback:', data.title);
});
</script>
```

## Events

Both the component and composable support the same events from [@suggesto/core](../core):

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

## Nuxt Integration

For Nuxt projects, use the dedicated [@suggesto/nuxt](../nuxt) module instead.

## Vite Integration

Works seamlessly with Vite-based Vue projects:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  // No additional configuration needed
});
```

## TypeScript Support

Full TypeScript support with proper type inference:

```vue
<script setup lang="ts">
import { SuggestoEvents } from '@suggesto/vue';

const handleReady = (data: SuggestoEvents['ready']) => {
  // data is fully typed
  console.log(data.boardSlug);
};

const handleFeedback = (data: SuggestoEvents['feedbackSubmitted']) => {
  // data is fully typed
  console.log(data.title, data.category);
};
</script>
```

## Performance

- **Lazy Loading**: Widget script loads only when component is mounted
- **Automatic Cleanup**: Removes widget on unmount to prevent memory leaks
- **Reactive State**: Loading and error states are reactive Vue refs
- **Minimal Bundle Size**: Core functionality is loaded from CDN

## Troubleshooting

### Widget not loading in SSR

If you're using server-side rendering, the widget will only load on the client side, which is expected behavior.

### Hydration mismatches

The widget renders as a comment node (`<!---->`), so it won't cause hydration issues in SSR applications.

### TypeScript errors with events

Make sure to import the event types:

```typescript
import type { SuggestoEvents } from '@suggesto/vue';
```

## Migration from Vue 2

This package requires Vue 3. For Vue 2 compatibility, use the core package directly:

```javascript
import { SuggestoWidget } from '@suggesto/core';

// In Vue 2 component
export default {
  async mounted() {
    this.widget = new SuggestoWidget({
      boardId: 'your-board-id'
    });
    await this.widget.load();
  },
  beforeDestroy() {
    this.widget?.destroy();
  }
};
```

## License

MIT
