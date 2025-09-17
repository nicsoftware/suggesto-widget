import Link from 'next/link';
import ClientWidgetDemo from '@/components/ClientWidgetDemo';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Suggesto Next.js Example</h1>
        <p>
          This example demonstrates how to use @suggesto/react with Next.js App Router.
          The widget is loaded globally via the layout and also shown in client components.
        </p>
      </div>

      <div className={styles.center}>
        <div className={styles.card}>
          <h2>Global Widget</h2>
          <p>
            A Suggesto widget is loaded globally in the layout.tsx file. 
            It will appear automatically on all pages.
          </p>
          <p>
            Check the browser console to see the widget events.
          </p>
        </div>

        <div className={styles.card}>
          <h2>Client Component Demo</h2>
          <p>
            Below is a client component that demonstrates programmatic control 
            over the widget using the useSuggesto hook.
          </p>
          <ClientWidgetDemo />
        </div>

        <div className={styles.card}>
          <h2>Server-Side Rendering</h2>
          <p>
            This page is server-rendered, but the Suggesto widget only loads 
            on the client side after hydration. This ensures optimal performance 
            and SEO.
          </p>
          <p>
            <strong>Server time:</strong> {new Date().toISOString()}
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        <Link href="/dashboard" className={styles.card}>
          <h3>Dashboard Example &rarr;</h3>
          <p>See how to use Suggesto in different pages with different configurations.</p>
        </Link>

        <a
          href="https://github.com/suggesto/packages"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3>Documentation &rarr;</h3>
          <p>Learn more about the Suggesto NPM packages and their usage.</p>
        </a>
      </div>
    </main>
  );
}
