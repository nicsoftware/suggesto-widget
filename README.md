# Suggesto NPM Packages

[![npm version](https://badge.fury.io/js/@suggesto%2Fcore.svg)](https://badge.fury.io/js/@suggesto%2Fcore)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official NPM packages for integrating the Suggesto feedback widget into modern web applications. Built with a hybrid-wrapper architecture that leverages the existing sophisticated widget system while providing native framework integration.

## 📦 Packages

| Package                               | Version                                              | Description                                    |
| ------------------------------------- | ---------------------------------------------------- | ---------------------------------------------- |
| [`@suggesto/core`](./packages/core)   | ![npm](https://img.shields.io/npm/v/@suggesto/core)  | Core library for JavaScript widget integration |
| [`@suggesto/react`](./packages/react) | ![npm](https://img.shields.io/npm/v/@suggesto/react) | React hooks and components                     |
| [`@suggesto/vue`](./packages/vue)     | ![npm](https://img.shields.io/npm/v/@suggesto/vue)   | Vue 3 composables and components               |
| [`@suggesto/nuxt`](./packages/nuxt)   | ![npm](https://img.shields.io/npm/v/@suggesto/nuxt)  | Nuxt 3 module for zero-config setup            |

## 🚀 Quick Start

### React / Next.js

```bash
npm install @suggesto/react
```

```tsx
import { SuggestoWidget } from '@suggesto/react';

function App() {
  return (
    <div>
      <h1>My App</h1>
      <SuggestoWidget
        boardId="your-board-id"
        onReady={(data) => console.log('Widget ready:', data)}
        onFeedbackSubmitted={(data) => console.log('Feedback:', data)}
      />
    </div>
  );
}
```

### Vue 3

```bash
npm install @suggesto/vue
```

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

<script setup>
import { SuggestoWidget } from '@suggesto/vue';

const boardId = 'your-board-id';
const onReady = (data) => console.log('Ready:', data);
const onFeedbackSubmitted = (data) => console.log('Feedback:', data);
</script>
```

### Nuxt 3

```bash
npm install @suggesto/nuxt
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@suggesto/nuxt'],
  suggesto: {
    boardId: 'your-board-id',
  },
});
```

That's it! The widget loads automatically on all pages.

## 🏗️ Hybrid-Wrapper Architecture

Our packages use an intelligent **hybrid-wrapper** approach:

- ✅ **No Duplication**: Leverages the existing sophisticated widget system
- ✅ **Zero Configuration**: Works out of the box with sensible defaults
- ✅ **Framework Native**: Provides idiomatic APIs for each framework
- ✅ **TypeScript First**: Full type safety and auto-completion
- ✅ **Performance Optimized**: Lazy loading, tree shaking, minimal bundle size
- ✅ **Event-Driven**: Rich event system for deep integration

## 📚 Documentation

Each package includes comprehensive documentation:

- **[Core Documentation](./packages/core/README.md)** - Base widget functionality
- **[React Documentation](./packages/react/README.md)** - React hooks and components
- **[Vue Documentation](./packages/vue/README.md)** - Vue 3 composables
- **[Nuxt Documentation](./packages/nuxt/README.md)** - Nuxt 3 module

## 🎯 Examples

Working examples for all supported frameworks:

- **[React Example](./examples/react-example/)** - Vite + React + TypeScript
- **[Next.js Example](./examples/nextjs-example/)** - Next.js App Router + TypeScript
- **[Vue Example](./examples/vue-example/)** - Vue 3 + Vite + TypeScript
- **[Nuxt Example](./examples/nuxt-example/)** - Nuxt 3 + TypeScript

## ⚡ Features

### Core Features

- **Dynamic Widget Loading** - Widget script loads only when needed
- **Event System** - Listen to widget ready, feedback submitted, error events
- **Error Handling** - Graceful fallbacks and comprehensive error reporting
- **TypeScript Support** - Full type definitions for all APIs

### React Features

- **useSuggesto Hook** - Programmatic control with React state management
- **SuggestoWidget Component** - Declarative component with prop-based configuration
- **Automatic Cleanup** - Proper widget lifecycle management

### Vue Features

- **useSuggesto Composable** - Vue 3 composition API integration
- **Reactive State** - Loading and error states as reactive refs
- **Component & Composable** - Both declarative and programmatic approaches

### Nuxt Features

- **Zero Configuration** - Auto-import and setup
- **Server-Side Safe** - Client-side only loading with SSR compatibility
- **Runtime Configuration** - Environment-based configuration

## 🔧 Development

This is a monorepo managed with npm workspaces.

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test

# Development mode (watch)
npm run dev
```

### Project Structure

```
├── packages/
│   ├── core/           # @suggesto/core
│   ├── react/          # @suggesto/react
│   ├── vue/            # @suggesto/vue
│   └── nuxt/           # @suggesto/nuxt
├── examples/
│   ├── react-example/
│   ├── nextjs-example/
│   ├── vue-example/
│   └── nuxt-example/
└── docs/
```

### Scripts

- `npm run build` - Build all packages
- `npm run dev` - Development mode with watch
- `npm test` - Run all tests
- `npm run lint` - Lint all packages
- `npm run changeset` - Create a changeset for releases

## 📈 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 🔒 Security

- **Content Security Policy** compatible
- **Domain Restrictions** - Server-side validation
- **XSS Prevention** - All inputs sanitized
- **HTTPS Only** - Enforced for production

## 🚀 Publishing

Packages are published using [Changesets](https://github.com/changesets/changesets):

```bash
# 1. Create a changeset
npm run changeset

# 2. Version packages
npm run version-packages

# 3. Publish to NPM
npm run release
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Create a changeset: `npm run changeset`
6. Submit a pull request

## 📄 License

MIT © [Suggesto Team](https://suggesto.io)

## 🆘 Support

- 📖 [Documentation](https://suggesto.io/docs)
- 🐛 [Issue Tracker](https://github.com/nicsoftware/suggesto-widget/issues)
