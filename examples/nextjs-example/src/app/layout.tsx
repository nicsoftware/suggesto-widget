import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SuggestoWidgetWrapper from '@/components/SuggestoWidgetWrapper';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Suggesto Next.js Example',
  description: 'Example app showing Suggesto integration with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        
        {/* Global Suggesto widget */}
        <SuggestoWidgetWrapper />
      </body>
    </html>
  );
}
