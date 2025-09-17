import { SuggestoWidget } from '@suggesto/react';
import HookExample from './components/HookExample';
import ComponentExample from './components/ComponentExample';
import './App.css';

function App() {
  const handleReady = (data: any) => {
    console.log('Widget ready:', data);
  };

  const handleFeedbackSubmitted = (data: any) => {
    console.log('Feedback submitted:', data);
    alert(`Thank you for your feedback: "${data.title}"`);
  };

  const handleError = (error: any) => {
    console.error('Widget error:', error);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Suggesto React Example</h1>
        <p>
          This example demonstrates how to use the @suggesto/react package to integrate the Suggesto
          feedback widget into a React application.
        </p>
      </header>

      <main className="App-main">
        <section className="example-section">
          <h2>Component Example</h2>
          <p>
            The SuggestoWidget component automatically handles the widget lifecycle and provides
            event callbacks:
          </p>
          <ComponentExample />
        </section>

        <section className="example-section">
          <h2>Hook Example</h2>
          <p>The useSuggesto hook provides programmatic control over the widget:</p>
          <HookExample />
        </section>
      </main>

      {/* Global widget that loads automatically */}
      <SuggestoWidget
        boardId={import.meta.env.VITE_SUGGESTO_BOARD_ID || 'demo-board-id'}
        onReady={handleReady}
        onFeedbackSubmitted={handleFeedbackSubmitted}
        onError={handleError}
      />
    </div>
  );
}

export default App;
