import { redirect } from 'next/navigation';
import { getSession } from '../lib/auth';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import RequestAccessPrompt from './RequestAccessPrompt';
import CompassSandbox from './CompassSandbox';
import styles from './page.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { data: sandbox } = await supabase
    .from('sandboxes')
    .select('name')
    .eq('slug', slug)
    .single();

  return {
    title: `${sandbox?.name || slug} | Gabriel Philipson`,
  };
}

export default async function SandboxPage({ params }: Props) {
  const { slug } = await params;
  const session = await getSession();

  if (!session) redirect('/');

  // Check if sandbox exists
  const { data: sandbox } = await supabase
    .from('sandboxes')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();

  if (!sandbox) redirect('/directory');

  // Check access
  const { data: access } = await supabase
    .from('sandbox_access')
    .select('status')
    .eq('subscriber_id', session.subscriberId)
    .eq('sandbox_slug', slug)
    .eq('status', 'approved')
    .single();

  if (!access) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <RequestAccessPrompt sandboxName={sandbox.name} sandboxSlug={slug} />
        </main>
      </>
    );
  }

  // Render sandbox content based on slug
  return (
    <>
      <Header />
      <main className={styles.main}>
        <span className={styles.eyebrow}>{sandbox.name}</span>
        <div className={styles.sandboxContent}>
          {slug === 'compass' && <CompassSandbox />}
          {slug !== 'compass' && (
            <p className={styles.placeholder}>Sandbox content loading.</p>
          )}
        </div>
      </main>
    </>
  );
}
