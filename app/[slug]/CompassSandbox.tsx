import Image from 'next/image';
import { FeatureChart, TokenChart } from './CompassCharts';
import CollapsibleSection from './CollapsibleSection';
import styles from './CompassSandbox.module.css';

const featureHighlights = [
  { cat: 'Core', color: '#0F6E56', title: 'Three-stage AI pipeline', desc: 'Problem to requirements in minutes, not weeks' },
  { cat: 'Intake', color: '#534AB7', title: 'Brief extraction', desc: 'Describe your problem in plain English' },
  { cat: 'Export', color: '#D85A30', title: 'Stakeholder-tailored exports', desc: 'Same project, different audiences' },
  { cat: 'Intelligence', color: '#993556', title: 'Coherence check', desc: 'Catches contradictions before you waste time' },
  { cat: 'Intelligence', color: '#185FA5', title: 'Structured risk classification', desc: 'Surfaces what should make you pause' },
  { cat: 'Core', color: '#0F6E56', title: 'Configurable automation', desc: 'Full control to hands-free, your choice' },
  { cat: 'Onboarding', color: '#854F0B', title: '18 real-world scenarios', desc: 'See it working in 30 seconds' },
  { cat: 'Architecture', color: '#5F5E5A', title: 'Provider agnostic', desc: 'Bring your own LLM' },
  { cat: 'Requirements', color: '#185FA5', title: 'Given/When/Then specs', desc: 'Engineering-ready output' },
];

const testRuns = [
  { name: 'PayFlow Checkout', scenario: 'E-commerce payment friction', type: 'Software', tokens: '18,218' },
  { name: 'BC365 Round 1', scenario: 'ERP forecasting capability', type: 'Software', tokens: '17,832' },
  { name: 'BC365 Round 2', scenario: 'ERP forecasting capability', type: 'Software', tokens: '19,184' },
  { name: 'BC365 Round 3', scenario: 'ERP forecasting capability', type: 'Software', tokens: '14,864' },
  { name: 'Baseball pitcher', scenario: 'Athletic velocity development', type: 'Creative', tokens: '18,788' },
  { name: 'Furniture maker', scenario: 'Client scoping process', type: 'Creative', tokens: '16,126' },
  { name: 'Networking platform', scenario: 'Premium conversion optimization', type: 'Software', tokens: '19,411' },
];

const buildSteps = [
  'Documentation baseline',
  'Spec all four agents',
  'Scaffold GitHub repo + folder structure',
  'Dossier schema + session init',
  'Provider abstraction layer',
  'Discovery agent, build + test',
  'React app shell',
  'Wire Discovery end-to-end',
  'Strategy + Requirements agents',
  'Orchestrator routing + auto mode timer',
  'End-to-end test + prompt tuning',
  'Formatted agent output (risk + priority badges)',
  'Stage edit flow (pre-filled from dossier)',
  'Auto-fire between stages after approval',
  'Scenario selector (18 scenarios, filterable grid)',
  'Brief extraction with confidence indicators',
  'Intake coherence check (pass/warn/block)',
  'Field tooltips + loading indicator',
  'GitHub commit wiring',
  'Three full test runs (BC365 Forecasting)',
  'Stakeholder context block + BRD/PRD export',
  'Run creative scenario (Baseball Pitcher)',
  'Run creative scenario (Furniture Maker)',
  'Close "Stop at Strategy" decision (not needed)',
];

export default function CompassSandbox() {
  return (
    <div className={styles.compass}>
      {/* ── Section 1: Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <Image
            src="/compass-icon-primary.svg"
            alt="Compass"
            width={56}
            height={56}
            className={styles.heroIcon}
          />
          <div>
            <h1 className={styles.heroTitle}>Compass &mdash; PM Agent Pipeline</h1>
            <p className={styles.heroSub}>
              Your personal AI product manager. Describe a problem. Get a strategy. Ship requirements.
            </p>
          </div>
        </div>
        <span className={styles.phaseBadge}>Phase II, Active</span>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Phase</span>
          <span className={styles.metricValue}>II of III</span>
          <span className={styles.metricNote}>Phase I complete, Phase II active</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Features</span>
          <span className={styles.metricValue}>60</span>
          <span className={styles.metricNote}>49 live, 11 planned</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Pipeline runs</span>
          <span className={styles.metricValue}>7+</span>
          <span className={styles.metricNote}>Across software, creative, and business domains</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Avg tokens/run</span>
          <span className={styles.metricValue}>17,775</span>
          <span className={styles.metricNote}>Full pipeline, problem to requirements</span>
        </div>
      </div>

      {/* ── Section 2: How it works ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>How it works</div>
        <div className={styles.stagesRow}>
          <div className={styles.stageCard}>
            <div className={styles.stageName}>Discovery</div>
            <p className={styles.stageDesc}>
              Frames the problem, identifies the target user, surfaces assumptions with structured
              risk classification. Always manual, always human-approved.
            </p>
          </div>
          <div className={styles.stageArrow}>&rarr;</div>
          <div className={styles.stageCard}>
            <div className={styles.stageName}>Strategy</div>
            <p className={styles.stageDesc}>
              Makes real prioritization choices. OKRs, ranked features with rationale, explicit
              out-of-scope. Picks the right framework (RICE, MoSCoW, effort-impact) for the project.
            </p>
          </div>
          <div className={styles.stageArrow}>&rarr;</div>
          <div className={styles.stageCard}>
            <div className={styles.stageName}>Requirements</div>
            <p className={styles.stageDesc}>
              Engineering-ready specs. User stories with Given/When/Then acceptance criteria,
              non-functional requirements, open questions with blocking dependencies.
            </p>
          </div>
        </div>
        <p className={styles.stagesNote}>
          Each stage is reviewed and approved by you before the next one runs. Automation is earned, not assumed.
        </p>

        <div className={styles.comingStagesGrid}>
          {[
            { name: 'Execution', desc: 'Sprint planning, backlog, dependencies, risk flagging.' },
            { name: 'Launch', desc: 'GTM checklist, release notes, rollout strategy.' },
            { name: 'Analytics', desc: 'Post-launch metrics, feedback synthesis, iteration priorities.' },
          ].map((stage) => (
            <div className={styles.comingStageCard} key={stage.name}>
              <div className={styles.stageName}>{stage.name}</div>
              <p className={styles.stageDesc}>{stage.desc}</p>
              <div className={styles.comingStageLabel}>Coming soon</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: Feature landscape ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>Feature landscape</div>
        <h2 className={styles.sectionTitle}>60 features across 9 categories</h2>

        <div className={styles.chartWrap}>
          <FeatureChart />
        </div>
        <div className={styles.chartLegend}>
          <span><span className={styles.legendDot} style={{ background: '#1D9E75' }} /> Live</span>
          <span><span className={styles.legendDot} style={{ background: '#B5D4F4' }} /> Planned</span>
        </div>

        <div className={styles.featureGrid}>
          {featureHighlights.map((f) => (
            <div className={styles.featureCard} key={f.title}>
              <div className={styles.featureCat} style={{ color: f.color }}>{f.cat}</div>
              <div className={styles.featureTitle}>{f.title}</div>
              <div className={styles.featureDesc}>{f.desc}</div>
            </div>
          ))}
          <div className={styles.featureCardVision}>
            <div className={styles.featureCat} style={{ color: '#185FA5' }}>Phase III vision</div>
            <div className={styles.featureTitle}>Compass marketplace</div>
            <div className={styles.featureDesc}>From requirements to built product</div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Phase II features ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>What&apos;s new</div>
        <h2 className={styles.sectionTitle}>Phase II features</h2>

        <div className={styles.phaseIIGrid}>
          <div className={styles.phaseIICard}>
            <div className={styles.phaseIICardTitle}>Stakeholder intelligence</div>
            <p className={styles.phaseIICardBody}>
              Mention a stakeholder in your brief or add them mid-session with <code>/cmp:stake</code>.
              The Strategy agent references their priorities in feature rationale. The Requirements agent
              flags stories needing their approval. The BRD export tailors the executive summary to
              their communication style.
            </p>
          </div>
          <div className={styles.phaseIICard}>
            <div className={styles.phaseIICardTitle}>BRD/PRD export</div>
            <p className={styles.phaseIICardBody}>
              One command, stakeholder-ready document. <code>/cmp:export doc</code> generates a
              six-section BRD/PRD from the approved dossier. <code>/cmp:export doc Sarah Chen</code> tailors
              the executive summary to Sarah&apos;s priorities and preferences. Only the summary uses
              an LLM call. Everything else is template rendering.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 5: Test results ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>Test results</div>
        <h2 className={styles.sectionTitle}>7 documented pipeline runs. 100% schema compliance since Round 2.</h2>

        <div className={styles.tokenChartWrap}>
          <TokenChart />
        </div>
        <div className={styles.chartCaption}>Token usage per stage across 7 documented runs (lower is better)</div>

        <table className={styles.resultsTable}>
          <thead>
            <tr>
              <th>Run</th>
              <th>Scenario</th>
              <th>Type</th>
              <th>Total tokens</th>
            </tr>
          </thead>
          <tbody>
            {testRuns.map((run) => (
              <tr key={run.name}>
                <td>{run.name}</td>
                <td>{run.scenario}</td>
                <td>{run.type}</td>
                <td>{run.tokens}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className={styles.insightLine}>
          The pipeline adapts naturally to non-software domains. The baseball pitcher run produced a
          structured training program. The furniture maker run produced a business process design.
          No special handling required.
        </p>
      </section>

      {/* ── Section 6: What's next ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>Roadmap</div>
        <h2 className={styles.sectionTitle}>What&apos;s next</h2>

        <div className={styles.roadmap}>
          <div className={styles.roadmapItem}>
            <span className={styles.roadmapNum}>1</span>
            <div>
              <div className={styles.roadmapTitle}>
                Open question answer flow
                <code className={styles.roadmapCode}>/cmp:ans</code>
              </div>
              <p className={styles.roadmapDesc}>
                Answer open questions from Requirements, optionally trigger a rerun. Closes the feedback loop.
              </p>
            </div>
          </div>
          <div className={styles.roadmapItem}>
            <span className={styles.roadmapNum}>2</span>
            <div>
              <div className={styles.roadmapTitle}>Execution Agent</div>
              <p className={styles.roadmapDesc}>
                Sprint planning, backlog grooming, dependency tracking. From requirements to sprint-ready backlog.
              </p>
            </div>
          </div>
          <div className={styles.roadmapItem}>
            <span className={styles.roadmapNum}>3</span>
            <div>
              <div className={styles.roadmapTitle}>Compass marketplace</div>
              <p className={styles.roadmapDesc}>
                PM-to-builder matching. Compass generates estimates, CC-skilled builders bid on scoped projects.
                The dossier becomes the contract.
              </p>
              <div className={styles.roadmapPhase}>Phase III</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 7: Build sequence (collapsed) ── */}
      <CollapsibleSection label={`Build sequence (${buildSteps.length} steps completed)`}>
        <div className={styles.buildList}>
          {buildSteps.map((name, i) => (
            <div className={styles.buildRow} key={i}>
              <span className={styles.buildNum}>{i + 1}</span>
              <span className={styles.buildName}>{name}</span>
              <span className={styles.buildStatus}>Done</span>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <div className={styles.compassFooter}>
        <span>Last updated: April 2026</span>
        <span>Phase II: Stakeholder intelligence, exports, answer flow. Phase III: Auth, hosting, marketplace</span>
      </div>
    </div>
  );
}
