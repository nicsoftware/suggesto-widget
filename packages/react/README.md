# @suggesto/react

React hooks and components for Suggesto feedback widget integration.

## Installation

```bash
npm install @suggesto/react
```

## Quick Start

### Using the Component (Recommended)

```tsx
import React from 'react';
import { SuggestoWidget } from '@suggesto/react';

function App() {
  const handleReady = (data) => {
    console.log('Widget ready:', data.boardSlug);
  };

  const handleFeedbackSubmitted = (data) => {
    console.log('Feedback submitted:', data.title);
  };

  return (
    <div>
      <h1>My App</h1>
      <SuggestoWidget
        boardId="your-board-id"
        onReady={handleReady}
        onFeedbackSubmitted={handleFeedbackSubmitted}
        onError={(error) => console.error('Widget error:', error)}
      />
    </div>
  );
}
```

### Using the Hook

```tsx
import React, { useEffect } from 'react';
import { useSuggesto } from '@suggesto/react';

function App() {
  const { isLoading, error, openModal, on } = useSuggesto({
    boardId: 'your-board-id'
  });

  useEffect(() => {
    on('ready', (data) => {
      console.log('Widget ready:', data);
    });

    on('feedbackSubmitted', (data) => {
      console.log('Feedback submitted:', data);
    });
  }, [on]);

  if (error) {
    return <div>Error loading widget: {error}</div>;
  }

  return (
    <div>
      <h1>My App</h1>
      {isLoading && <div>Loading widget...</div>}
      <button onClick={openModal} disabled={isLoading}>
        Give Feedback
      </button>
    </div>
  );
}
```

## API Reference

### `<SuggestoWidget>`

React component that automatically manages the widget lifecycle.

#### Props

```typescript
interface SuggestoWidgetProps {
  boardId: string;                    // Required: Your feedback board UUID
  baseUrl?: string;                   // Optional: Custom server URL
  onReady?: (data) => void;          // Callback when widget loads
  onFeedbackSubmitted?: (data) => void; // Callback when feedback is submitted
  onError?: (data) => void;          // Callback when an error occurs
}
```

#### Example

```tsx
<SuggestoWidget
  boardId="your-board-id"
  baseUrl="https://your-domain.com" // Optional
  onReady={(data) => console.log('Ready:', data)}
  onFeedbackSubmitted={(data) => {
    // Track analytics, show confirmation, etc.
    console.log('Feedback:', data.title);
  }}
  onError={(error) => {
    // Handle errors gracefully
    console.error('Widget error:', error);
  }}
/>
```

### `useSuggesto(config)`

React hook for programmatic control over the widget.

#### Parameters

- `config: SuggestoConfig`
  - `boardId: string` - Your feedback board UUID (required)
  - `baseUrl?: string` - Custom server URL (optional)

#### Returns

```typescript
{
  isLoading: boolean;              // Widget loading state
  error: string | null;            // Error message if loading failed
  openModal: () => void;           // Open feedback modal
  closeModal: () => void;          // Close feedback modal
  on: (event, callback) => void;   // Register event listener
}
```

#### Example

```tsx
function FeedbackButton() {
  const { isLoading, error, openModal } = useSuggesto({
    boardId: 'your-board-id'
  });

  if (error) {
    return <div>Failed to load feedback widget</div>;
  }

  return (
    <button onClick={openModal} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Give Feedback'}
    </button>
  );
}
```

## Events

Both the component and hook support the same events from [@suggesto/core](../core):

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

## Next.js Integration

Works seamlessly with Next.js App Router and Pages Router:

```tsx
// app/layout.tsx or pages/_app.tsx
import { SuggestoWidget } from '@suggesto/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SuggestoWidget boardId="your-board-id" />
      </body>
    </html>
  );
}
```

## TypeScript Support

Full TypeScript support with auto-completion and type safety:

```tsx
import { SuggestoWidgetProps, SuggestoEvents } from '@suggesto/react';

const handleReady = (data: SuggestoEvents['ready']) => {
  // data is fully typed
  console.log(data.boardSlug);
};
```

## Performance

- **Lazy Loading**: Widget script loads only when component mounts
- **Automatic Cleanup**: Removes widget on unmount to prevent memory leaks
- **Minimal Bundle Size**: Core functionality is loaded from CDN
- **React 18 Ready**: Supports Concurrent Features and Strict Mode

## Troubleshooting

### Widget not loading

1. Verify your `boardId` is correct
2. Check browser console for errors
3. Ensure your domain is whitelisted in Suggesto dashboard

### TypeScript errors

Make sure you have the correct React types installed:

```bash
npm install @types/react @types/react-dom
```

## License

MIT
