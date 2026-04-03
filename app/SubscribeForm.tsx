'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SubscribeForm.module.css';

export default function SubscribeForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, role }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to subscribe');
      }

      router.push('/directory');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {status === 'error' && <div className={styles.error}>{errorMsg}</div>}
      <label className={styles.label}>
        Name *
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label className={styles.label}>
        Email *
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label className={styles.label}>
        Company
        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} />
      </label>
      <label className={styles.label}>
        Role / Title
        <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
      </label>
      <button type="submit" className={styles.button} disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
    </form>
  );
}
