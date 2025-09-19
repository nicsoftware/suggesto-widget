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

    on('error', (errorData) => {
      console.error('Widget error:', errorData);
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
        {isLoading ? 'Loading...' : 'Give Feedback'}
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

### App Router (Recommended)

For Next.js 13+ with App Router, create a Client Component wrapper:

```tsx
// src/components/SuggestoProvider.tsx
'use client';

import { SuggestoWidget } from '@suggesto/react';

export default function SuggestoProvider() {
  const handleReady = (data: unknown) => {
    console.log('Widget ready:', data);
  };

  const handleFeedbackSubmitted = (data: unknown) => {
    console.log('Feedback submitted:', data);
  };

  const handleError = (error: unknown) => {
    console.error('Widget error:', error);
  };

  return (
    <SuggestoWidget
      boardId="your-board-id"
      onReady={handleReady}
      onFeedbackSubmitted={handleFeedbackSubmitted}
      onError={handleError}
    />
  );
}
```

Then use it in your layout:

```tsx
// src/app/layout.tsx
import SuggestoProvider from '@/components/SuggestoProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <SuggestoProvider />
      </body>
    </html>
  );
}
```

### Pages Router

```tsx
// pages/_app.tsx
import { SuggestoWidget } from '@suggesto/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <SuggestoWidget boardId="your-board-id" />
    </>
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
- **Event Queue System**: Events are properly queued and processed after widget loads (v1.0.1+)
- **Minimal Bundle Size**: Core functionality is loaded from CDN
- **React 18 Ready**: Supports Concurrent Features and Strict Mode

## Troubleshooting

### Widget not loading

1. Verify your `boardId` is correct
2. Check browser console for errors
3. Ensure your domain is whitelisted in Suggesto dashboard
4. Check network tab for failed requests to `https://suggesto.io/widget/...`

### Events not firing

**Fixed in v1.0.1**: Events are now properly queued and will fire correctly after widget loads.

If you're still having issues:
1. Ensure you're using v1.0.1 or later
2. Check that event handlers are registered before widget loads
3. Verify console for event logs (ready, feedbackSubmitted, error)

### Next.js App Router issues

**Server Component Error**: "Event handlers cannot be passed to Client Component props"
- **Solution**: Use the Client Component wrapper pattern shown above
- Create a separate `'use client'` component for the Suggesto widget

### SSR/Hydration issues

1. Widget loads client-side only, which is expected
2. Use `'use client'` directive for Next.js App Router
3. No hydration mismatches should occur with proper client component setup

### TypeScript errors

Make sure you have the correct React types installed:

```bash
npm install @types/react @types/react-dom
```

## License

MIT
