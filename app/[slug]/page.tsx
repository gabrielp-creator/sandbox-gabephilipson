import { redirect } from 'next/navigation';
import { getSession } from '../lib/auth';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import RequestAccessPrompt from './RequestAccessPrompt';
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

function CompassSandbox() {
  return (
    <div className={styles.compassStatus}>
      <div className={styles.compassHeader}>
        <div>
          <h1 className={styles.compassTitle}>Compass — PM Agent Pipeline</h1>
          <p className={styles.compassSub}>
            A multi-agent AI pipeline for product managers, from discovery to delivery
          </p>
        </div>
        <span className={styles.phaseBadge}>Phase I, POC Complete</span>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Phase</span>
          <span className={styles.metricValue}>I of III</span>
          <span className={styles.metricNote}>POC</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Agents operational</span>
          <span className={styles.metricValue}>4</span>
          <span className={styles.metricNote}>Discovery, Strategy, Requirements, Orchestrator</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Decisions locked</span>
          <span className={styles.metricValue}>14</span>
          <span className={styles.metricNote}>Architecture complete</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Docs complete</span>
          <span className={styles.metricValue}>5+</span>
          <span className={styles.metricNote}>ADL, schema, roadmap, commands, context</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Pipeline runs</span>
          <span className={styles.metricValue}>1</span>
          <span className={styles.metricNote}>First test session, payment checkout scenario</span>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pipeline Stages</h2>
        <div className={styles.stagesGrid}>
          {[
            { name: 'Discovery', status: 'Complete', desc: 'Problem framing, target user, JTBD, assumptions. Always manual gate, locked.' },
            { name: 'Strategy', status: 'Complete', desc: 'Vision, OKRs, feature prioritization, roadmap horizon. Configurable gate.' },
            { name: 'Requirements', status: 'Complete', desc: 'PRD, user stories, acceptance criteria, open questions. Configurable gate.' },
            { name: 'Execution', status: 'Phase II', desc: 'Sprint planning, backlog, dependencies, risk flagging.' },
            { name: 'Launch', status: 'Phase II', desc: 'GTM checklist, release notes, rollout strategy.' },
            { name: 'Analytics', status: 'Phase II', desc: 'Post-launch metrics, feedback synthesis, iteration priorities.' },
          ].map((stage) => (
            <div className={styles.stageCard} key={stage.name}>
              <div className={styles.stageHeader}>
                <span className={styles.stageName}>{stage.name}</span>
                <span className={`${styles.stageStatus} ${stage.status === 'Phase II' ? styles.stagePhaseII : stage.status === 'Complete' ? styles.stageComplete : styles.stageSpeccing}`}>
                  {stage.status}
                </span>
              </div>
              <p className={styles.stageDesc}>{stage.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Build Sequence</h2>
        <div className={styles.buildList}>
          {[
            { step: 1, name: 'Documentation baseline', status: 'Done' },
            { step: 2, name: 'Spec all four agents', status: 'Done' },
            { step: 3, name: 'Scaffold GitHub repo + folder structure', status: 'Done' },
            { step: 4, name: 'Dossier schema + session init', status: 'Done' },
            { step: 5, name: 'Provider abstraction layer', status: 'Done' },
            { step: 6, name: 'Discovery agent, build + test', status: 'Done' },
            { step: 7, name: 'React app shell', status: 'Done' },
            { step: 8, name: 'Wire Discovery end-to-end', status: 'Done' },
            { step: 9, name: 'Strategy + Requirements agents', status: 'Done' },
            { step: 10, name: 'Orchestrator routing + auto mode timer', status: 'Done' },
            { step: 11, name: 'End-to-end test + prompt tuning', status: 'Done' },
          ].map((item) => (
            <div className={styles.buildRow} key={item.step}>
              <span className={styles.buildNum}>{item.step}</span>
              <span className={`${styles.buildName} ${item.status === 'Done' ? styles.buildDone : ''}`}>
                {item.name}
              </span>
              <span className={`${styles.buildStatus} ${
                item.status === 'Done' ? styles.statusDone :
                item.status === 'Next' ? styles.statusNext : styles.statusPending
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Stack</h2>
        <div className={styles.stackRow}>
          {['React', 'Claude (Anthropic)', 'OpenAI', 'Gemini', 'JSON / GitHub', 'Provider abstraction layer', 'Node.js'].map((t) => (
            <span className={styles.stackTag} key={t}>{t}</span>
          ))}
        </div>
      </section>

      <div className={styles.compassFooter}>
        <span>Last updated: April 2026</span>
        <span>Phase II: Full pipeline. Phase III: Auth, hosting, monetization</span>
      </div>
    </div>
  );
}
