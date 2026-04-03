'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SandboxDirectory.module.css';

interface Sandbox {
  slug: string;
  name: string;
  description: string;
  status: string;
}

interface Props {
  sandboxes: Sandbox[];
  approvedSlugs: string[];
}

export default function SandboxDirectory({ sandboxes, approvedSlugs }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function requestAccess(slug: string) {
    setLoading(slug);
    try {
      const res = await fetch('/api/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sandbox_slug: slug }),
      });

      if (res.ok) {
        router.push(`/${slug}`);
      }
    } catch {
      setLoading(null);
    }
  }

  return (
    <div className={styles.grid}>
      {sandboxes.map((sb) => {
        const hasAccess = approvedSlugs.includes(sb.slug);
        const isComingSoon = sb.status === 'coming_soon';
        const isLoading = loading === sb.slug;

        return (
          <div className={styles.card} key={sb.slug}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{sb.name}</h2>
              <span className={`${styles.badge} ${isComingSoon ? styles.badgeSoon : styles.badgeActive}`}>
                {isComingSoon ? 'Coming Soon' : 'Active'}
              </span>
            </div>
            <p className={styles.cardDesc}>{sb.description}</p>
            {isComingSoon ? (
              <span className={styles.disabledButton}>Coming Soon</span>
            ) : hasAccess ? (
              <button className={styles.openButton} onClick={() => router.push(`/${sb.slug}`)}>
                Open
              </button>
            ) : (
              <button
                className={styles.requestButton}
                onClick={() => requestAccess(sb.slug)}
                disabled={isLoading}
              >
                {isLoading ? 'Requesting...' : 'Request Access'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
