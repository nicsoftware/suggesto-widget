'use client';

import { SuggestoWidget } from '@suggesto/react';

export default function SuggestoWidgetWrapper() {
  return (
    <SuggestoWidget
      boardId={process.env.NEXT_PUBLIC_SUGGESTO_BOARD_ID || 'demo-board-id'}
      onReady={(data) => {
        console.log('Next.js widget ready:', data);
      }}
      onFeedbackSubmitted={(data) => {
        console.log('Next.js feedback submitted:', data);
      }}
      onError={(error) => {
        console.error('Next.js widget error:', error);
      }}
    />
  );
}
