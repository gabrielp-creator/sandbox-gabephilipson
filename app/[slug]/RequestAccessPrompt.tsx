'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface Props {
  sandboxName: string;
  sandboxSlug: string;
}

export default function RequestAccessPrompt({ sandboxName, sandboxSlug }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRequest() {
    setLoading(true);
    const res = await fetch('/api/request-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sandbox_slug: sandboxSlug }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      setLoading(false);
    }
  }

  return (
    <div className={styles.promptCard}>
      <h1 className={styles.promptTitle}>{sandboxName}</h1>
      <p className={styles.promptDesc}>
        You need access to view this sandbox. Click below to request it.
      </p>
      <button
        onClick={handleRequest}
        disabled={loading}
        style={{
          fontFamily: "var(--font-abel), 'Abel', sans-serif",
          fontSize: '14px',
          letterSpacing: '0.06em',
          color: '#fff',
          background: 'var(--color-primary)',
          border: 'none',
          borderRadius: '3px',
          padding: '10px 24px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Requesting...' : 'Request Access'}
      </button>
    </div>
  );
}
