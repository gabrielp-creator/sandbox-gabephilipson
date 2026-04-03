import { redirect } from 'next/navigation';
import { getSession } from '../lib/auth';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import SandboxDirectory from './SandboxDirectory';
import styles from './page.module.css';

export const metadata = {
  title: 'Sandbox Directory | Gabriel Philipson',
};

export default async function DirectoryPage() {
  const session = await getSession();
  if (!session) redirect('/');

  const { data: sandboxes } = await supabase
    .from('sandboxes')
    .select('*')
    .in('status', ['active', 'coming_soon'])
    .order('created_at', { ascending: true });

  const { data: accessRecords } = await supabase
    .from('sandbox_access')
    .select('sandbox_slug, status')
    .eq('subscriber_id', session.subscriberId)
    .eq('status', 'approved');

  const approvedSlugs = new Set(
    (accessRecords || []).map((r: { sandbox_slug: string }) => r.sandbox_slug)
  );

  return (
    <>
      <Header />
      <main className={styles.main}>
        <span className={styles.eyebrow}>Sandbox Directory</span>
        <h1 className={styles.headline}>Available Projects</h1>
        <p className={styles.intro}>
          Browse live demos from the POC Lab. Request access to explore any project.
        </p>
        <SandboxDirectory
          sandboxes={sandboxes || []}
          approvedSlugs={Array.from(approvedSlugs)}
        />
      </main>
    </>
  );
}
