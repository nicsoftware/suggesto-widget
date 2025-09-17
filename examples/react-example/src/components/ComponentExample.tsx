import { useState } from 'react';
import { SuggestoWidget } from '@suggesto/react';

function ComponentExample() {
  const [events, setEvents] = useState<string[]>([]);

  const addEvent = (message: string) => {
    setEvents((prev) => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleReady = (data: any) => {
    addEvent(`Widget ready for board: ${data.boardSlug || data.boardId}`);
  };

  const handleFeedbackSubmitted = (data: any) => {
    addEvent(`Feedback submitted: "${data.title}" (${data.category})`);
  };

  const handleError = (error: any) => {
    addEvent(`Error: ${error.error || error.message}`);
  };

  return (
    <div>
      <div className="event-log">
        <h4>Event Log:</h4>
        {events.length === 0 ? (
          <p className="text-muted">No events yet...</p>
        ) : (
          <ul>
            {events.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="code-example">
        <h4>Code:</h4>
        <pre>
          <code>{`<SuggestoWidget
  boardId="your-board-id"
  onReady={(data) => console.log('Ready:', data)}
  onFeedbackSubmitted={(data) => {
    console.log('Submitted:', data.title);
  }}
  onError={(error) => console.error('Error:', error)}
/>`}</code>
        </pre>
      </div>

      {/* Component instance for this example */}
      <SuggestoWidget
        boardId={import.meta.env.VITE_SUGGESTO_BOARD_ID || 'component-demo-board'}
        onReady={handleReady}
        onFeedbackSubmitted={handleFeedbackSubmitted}
        onError={handleError}
      />
    </div>
  );
}

export default ComponentExample;
