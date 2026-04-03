import { redirect } from 'next/navigation';
import { getSession } from './lib/auth';
import Header from './components/Header';
import SubscribeForm from './SubscribeForm';
import LoginForm from './LoginForm';
import styles from './page.module.css';

export const metadata = {
  title: 'Explore AI Projects, Live | Gabriel Philipson',
};

export default async function LandingPage() {
  const session = await getSession();
  if (session) redirect('/directory');

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>POC Lab Sandbox</span>
          <h1 className={styles.headline}>Explore AI Projects, Live</h1>
          <p className={styles.intro}>
            The sandbox gives you hands-on access to working AI projects from the POC Lab.
            Subscribe to browse available demos and request access to any project that interests you.
          </p>
          <div className={styles.tabs}>
            <h2 className={styles.tabHeading}>New here?</h2>
            <SubscribeForm />
            <div className={styles.divider}>
              <span className={styles.dividerText}>Already subscribed?</span>
            </div>
            <LoginForm />
          </div>
        </div>
      </main>
    </>
  );
}
