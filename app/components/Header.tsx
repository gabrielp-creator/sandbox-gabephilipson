import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link href="https://gabephilipson.com" className={styles.logo}>
            IES
          </Link>
          <span className={styles.label}>Sandbox</span>
        </div>
        <nav className={styles.nav}>
          <Link href="/directory" className={styles.navLink}>Directory</Link>
          <Link href="https://gabephilipson.com/ai-poc-lab" className={styles.navLink}>POC Lab</Link>
          <Link href="https://gabephilipson.com" className={styles.navLink}>Main Site</Link>
        </nav>
      </div>
    </header>
  );
}
