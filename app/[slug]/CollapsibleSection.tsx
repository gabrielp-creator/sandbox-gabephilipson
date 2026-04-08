'use client';

import { useState } from 'react';
import styles from './CompassSandbox.module.css';

interface Props {
  label: string;
  children: React.ReactNode;
}

export default function CollapsibleSection({ label, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.collapsible}>
      <button
        className={styles.collapsibleToggle}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{label}</span>
        <span className={styles.chevron}>{open ? '\u25B2' : '\u25BC'}</span>
      </button>
      {open && <div className={styles.collapsibleBody}>{children}</div>}
    </div>
  );
}
