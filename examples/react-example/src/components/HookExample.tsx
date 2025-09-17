import { useEffect } from 'react';
import { useSuggesto } from '@suggesto/react';

function HookExample() {
  const { isLoading, error, openModal, closeModal, on } = useSuggesto({
    boardId: import.meta.env.VITE_SUGGESTO_BOARD_ID || 'demo-board-id',
  });

  useEffect(() => {
    // Register event listeners
    on('ready', (data) => {
      console.log('Hook widget ready:', data);
    });

    on('feedbackSubmitted', (data) => {
      console.log('Hook feedback submitted:', data);
    });

    on('error', (errorData) => {
      console.error('Hook widget error:', errorData);
    });
  }, [on]);

  if (error) {
    return (
      <div className="status error">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div>
      {isLoading && <div className="status loading">Loading widget...</div>}

      {!isLoading && <div className="status ready">Widget ready!</div>}

      <div className="controls">
        <button className="btn" onClick={openModal} disabled={isLoading}>
          Open Feedback Modal
        </button>
        <button className="btn btn-secondary" onClick={closeModal} disabled={isLoading}>
          Close Modal
        </button>
      </div>

      <div className="code-example">
        <h4>Code:</h4>
        <pre>
          <code>{`const { isLoading, error, openModal, on } = useSuggesto({
  boardId: 'your-board-id'
});

useEffect(() => {
  on('ready', (data) => console.log('Ready:', data));
  on('feedbackSubmitted', (data) => console.log('Submitted:', data));
}, [on]);`}</code>
        </pre>
      </div>
    </div>
  );
}

export default HookExample;
