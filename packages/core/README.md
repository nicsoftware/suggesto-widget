# @suggesto/core

Core library for Suggesto feedback widget integration. This package provides the base functionality to load and interact with the Suggesto widget in any JavaScript environment.

## Installation

```bash
npm install @suggesto/core
```

## Quick Start

```typescript
import { SuggestoWidget } from '@suggesto/core';

const widget = new SuggestoWidget({
  boardId: 'your-board-id', // Required: Your feedback board UUID
  baseUrl: 'https://suggesto.io' // Optional: Custom server URL
});

// Listen for events (register before loading)
widget.on('ready', (data) => {
  console.log('Widget ready:', data);
});

widget.on('feedbackSubmitted', (data) => {
  console.log('Feedback submitted:', data);
});

widget.on('error', (data) => {
  console.error('Widget error:', data);
});

// Load the widget
await widget.load();
```

## API Reference

### SuggestoWidget Class

#### Constructor

```typescript
new SuggestoWidget(config: SuggestoConfig)
```

**SuggestoConfig:**
- `boardId: string` - UUID of your feedback board (required)
- `baseUrl?: string` - Base URL for Suggesto API (default: 'https://suggesto.io')

#### Methods

##### `load(): Promise<void>`

Loads the widget script and initializes it. Safe to call multiple times.

```typescript
await widget.load();
```

##### `on<K>(event: K, callback: (data: SuggestoEvents[K]) => void): void`

Registers an event listener.

```typescript
widget.on('ready', (data) => {
  console.log('Board:', data.boardSlug);
});
```

##### `off<K>(event: K, callback: Function): void`

Removes an event listener.

```typescript
const handler = (data) => console.log(data);
widget.on('ready', handler);
widget.off('ready', handler);
```

##### `openModal(): void`

Opens the feedback modal programmatically.

```typescript
widget.openModal();
```

##### `closeModal(): void`

Closes the feedback modal programmatically.

```typescript
widget.closeModal();
```

##### `destroy(): void`

Completely removes the widget from the page and cleans up all resources.

```typescript
widget.destroy();
```

## Events

The widget emits the following events:

### `ready`

Fired when the widget is fully loaded and configured.

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

Fired when feedback is successfully submitted.

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

Fired when an error occurs.

```typescript
{
  type: string;
  error: string;
  boardId: string;
  context: string;
}
```

## Best Practices

### Event Registration

Always register event listeners before calling `load()`:

```typescript
// ✅ Good: Register events first
widget.on('ready', handleReady);
await widget.load();

// ❌ Bad: Events may be missed
await widget.load();
widget.on('ready', handleReady);
```

### Error Handling

Always include error handling:

```typescript
widget.on('error', (error) => {
  console.error('Widget error:', error);
  // Handle error gracefully
});

try {
  await widget.load();
} catch (err) {
  console.error('Failed to load widget:', err);
}
```

### Cleanup

Always call `destroy()` when the widget is no longer needed:

```typescript
// In framework cleanup (useEffect return, onUnmounted, etc.)
widget.destroy();
```

## Framework Integration

This core library is used by framework-specific packages:

- [@suggesto/react](../react) - React hooks and components with event queue system
- [@suggesto/vue](../vue) - Vue 3 composables and components with event queue system
- [@suggesto/nuxt](../nuxt) - Nuxt 3 module with singleton pattern

**Note**: Framework packages handle event timing automatically. For direct core usage, follow the best practices above.

## Troubleshooting

### Widget not loading

1. Verify your `boardId` is correct
2. Check browser console for network errors
3. Ensure your domain is whitelisted in Suggesto dashboard
4. Check for CORS issues or content security policy restrictions

### Events not firing

1. Register event listeners before calling `load()`
2. Check browser console for JavaScript errors
3. Verify the widget script loads successfully (Network tab)

### Memory leaks

Always call `destroy()` when cleaning up:

```typescript
// Example cleanup in vanilla JS
window.addEventListener('beforeunload', () => {
  widget.destroy();
});
```

## TypeScript Support

This package includes full TypeScript definitions and supports both CommonJS and ES modules.

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## License

MIT
