'use client';

import { useEffect, useState } from 'react';
import { useSuggesto } from '@suggesto/react';

export default function ClientWidgetDemo() {
  const [events, setEvents] = useState<string[]>([]);

  const { isLoading, error, openModal, closeModal, on } = useSuggesto({
    boardId: process.env.NEXT_PUBLIC_SUGGESTO_BOARD_ID || 'client-demo-board',
  });

  const addEvent = (message: string) => {
    setEvents((prev) => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    on('ready', (data) => {
      addEvent(`Client widget ready: ${data.boardSlug || data.boardId}`);
    });

    on('feedbackSubmitted', (data) => {
      addEvent(`Client feedback: "${data.title}" (${data.category})`);
    });

    on('error', (errorData) => {
      addEvent(`Client error: ${errorData.error}`);
    });
  }, [on]);

  if (error) {
    return (
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c33',
        }}
      >
        <strong>Error loading widget:</strong> {error}
      </div>
    );
  }

  return (
    <div
      style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '1rem' }}
    >
      <h4>Client Component Widget Control</h4>

      {isLoading && (
        <div
          style={{
            padding: '0.5rem',
            backgroundColor: '#e1f5fe',
            borderRadius: '4px',
            margin: '0.5rem 0',
            color: '#01579b',
          }}
        >
          Loading client widget...
        </div>
      )}

      <div style={{ margin: '1rem 0' }}>
        <button
          onClick={openModal}
          disabled={isLoading}
          style={{
            padding: '0.5rem 1rem',
            marginRight: '0.5rem',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          Open Modal
        </button>
        <button
          onClick={closeModal}
          disabled={isLoading}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: isLoading ? '#ccc' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          Close Modal
        </button>
      </div>

      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '1rem',
          borderRadius: '4px',
          border: '1px solid #dee2e6',
        }}
      >
        <h5 style={{ margin: '0 0 0.5rem 0' }}>Event Log:</h5>
        {events.length === 0 ? (
          <p style={{ color: '#6c757d', fontStyle: 'italic', margin: 0 }}>No events yet...</p>
        ) : (
          <ul
            style={{
              margin: 0,
              paddingLeft: '1.5rem',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            }}
          >
            {events.map((event, index) => (
              <li key={index} style={{ marginBottom: '0.25rem', color: '#495057' }}>
                {event}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
