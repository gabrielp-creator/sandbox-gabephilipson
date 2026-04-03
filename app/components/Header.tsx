import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="https://gabephilipson.com" className={styles.logo}>
          IES
        </Link>
        <span className={styles.label}>Sandbox</span>
      </div>
    </header>
  );
}
