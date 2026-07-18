import { useCallback, useRef, useState } from 'react';
import Results from './components/Results';
import { CACHED_RUNS } from './constants';
import { analyzeSources, scoutQueries, synthesizeArchitectures } from './services/gemini';
import { gatherSources } from './services/sources';
import type { AgentName, LogEntry, RunResult } from './types';

const AGENT_TAG: Record<AgentName, string> = {
  scout: 'SCT', analyst: 'ANL', architect: 'ARC', system: 'SYS',
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function App() {
  const [topic, setTopic] = useState('');
  const [phase, setPhase] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState('');
  const logId = useRef(0);
  const runToken = useRef(0);

  const log = useCallback((agent: AgentName, text: string, status: LogEntry['status'] = 'run') => {
    const id = ++logId.current;
    setLogs((prev) => [...prev, { id, agent, text, status }]);
    return id;
  }, []);

  const settle = useCallback((id: number, status: 'ok' | 'err') => {
    setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }, []);

  const begin = (t: string) => {
    runToken.current += 1;
    setTopic(t);
    setResult(null);
    setError('');
    setLogs([]);
    setPhase('running');
    return runToken.current;
  };

  async function runLive(rawTopic: string) {
    const t = rawTopic.trim();
    if (!t || phase === 'running') return;
    const token = begin(t);
    try {
      let id = log('scout', `Reading the idea: “${t}”`);
      const queries = await scoutQueries(t);
      settle(id, 'ok');
      log('scout', `Queries → arXiv: ${queries.arxivQueries.join(' | ')}`, 'ok');
      log('scout', `Queries → GitHub: ${queries.githubQueries.join(' | ')}`, 'ok');

      id = log('scout', 'Searching arXiv and GitHub…');
      const sources = await gatherSources(queries.arxivQueries, queries.githubQueries, (m) => log('scout', m, 'ok'));
      settle(id, 'ok');
      log('scout', `Locked ${sources.length} sources for analysis`, 'ok');

      id = log('analyst', `Extracting architecture, math and limits from ${sources.length} sources…`);
      const insights = await analyzeSources(t, sources);
      settle(id, 'ok');
      log('analyst', `Structured ${insights.length} source briefs`, 'ok');

      id = log('architect', 'Synthesizing 2–3 variants with citations…');
      const { variants, comparison } = await synthesizeArchitectures(t, sources, insights);
      settle(id, 'ok');
      log('architect', `Drafted ${variants.length} sheets + trade-off table`, 'ok');
      log('system', 'Blueprint ready. Every block links to a source.', 'ok');

      if (runToken.current !== token) return;
      setResult({ topic: t, sources, insights, variants, comparison });
      setPhase('done');
    } catch (e) {
      if (runToken.current !== token) return;
      const msg = e instanceof Error ? e.message : String(e);
      log('system', msg, 'err');
      setError(
        /429|quota|RESOURCE_EXHAUSTED/i.test(msg)
          ? 'Rate limit hit. Wait a minute, or open a cached demo topic below — same pipeline, pre-verified sources.'
          : `${msg} — try again, or open a cached demo topic below.`,
      );
      setPhase('error');
    }
  }

  async function runCached(run: RunResult) {
    if (phase === 'running') return;
    const token = begin(run.topic);
    const step = async (agent: AgentName, text: string, ms: number) => {
      if (runToken.current !== token) throw new Error('cancelled');
      const id = log(agent, text);
      await wait(ms);
      settle(id, 'ok');
    };
    try {
      await step('scout', `Reading the idea: “${run.topic}”`, 550);
      await step('scout', `Searching arXiv… ${run.sources.filter((s) => s.kind === 'paper').length} papers found`, 750);
      await step('scout', `Searching GitHub… ${run.sources.filter((s) => s.kind === 'repo').length} repositories found`, 650);
      await step('analyst', `Extracting architecture, math and limits from ${run.sources.length} sources…`, 900);
      await step('architect', `Synthesizing ${run.variants.length} variants with citations…`, 900);
      log('system', 'Blueprint ready. Every block links to a source.', 'ok');
      if (runToken.current !== token) return;
      setResult(run);
      setPhase('done');
    } catch { /* superseded by a newer run */ }
  }

  const copyRunJson = () => {
    if (result) void navigator.clipboard.writeText(JSON.stringify(result, null, 2));
  };

  return (
    <div className="frame">
      <header className="masthead">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <h1>Blueprint</h1>
        </div>
        <p className="strap">Idea → cited architecture in about a minute. Scout reads arXiv &amp; GitHub, Analyst extracts what works, Architect drafts the options.</p>
      </header>

      <section className="drafting-table">
        <label className="input-label" htmlFor="idea">Describe the product you want to build</label>
        <div className="input-row">
          <input
            id="idea"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runLive(topic)}
            placeholder="e.g. a distributed database built on AI agents"
            disabled={phase === 'running'}
          />
          <button className="run" onClick={() => runLive(topic)} disabled={phase === 'running' || !topic.trim()}>
            {phase === 'running' ? 'Drafting…' : 'Draft it'}
          </button>
        </div>
        <div className="chip-row demo-row">
          <span className="demo-label">Cached demos (instant, offline-safe):</span>
          {CACHED_RUNS.map((r) => (
            <button key={r.topic} className="chip chip-btn" onClick={() => runCached(r)} disabled={phase === 'running'}>
              ⚡ {r.topic}
            </button>
          ))}
        </div>
        {error && <p className="error" role="alert">{error}</p>}
      </section>

      <main className={logs.length ? 'workbench' : 'workbench empty'}>
        {logs.length > 0 && (
          <aside className="console" aria-label="Agent console">
            <div className="console-head">
              <span>agent console</span>
              {result && <button className="ghost" onClick={copyRunJson}>Copy run JSON</button>}
            </div>
            <ol>
              {logs.map((l) => (
                <li key={l.id} className={`log log-${l.status}`}>
                  <span className={`tag tag-${l.agent}`}>{AGENT_TAG[l.agent]}</span>
                  <span className="log-text">{l.text}</span>
                  <span className="log-dot" aria-hidden="true">{l.status === 'run' ? '…' : l.status === 'ok' ? '✓' : '✕'}</span>
                </li>
              ))}
            </ol>
          </aside>
        )}
        {result && <Results result={result} />}
        {!logs.length && (
          <div className="blank-slate">
            <p>Between an idea and the first line of code lie days of research.</p>
            <p className="blank-accent">Type the idea. Get the architecture — with receipts.</p>
          </div>
        )}
      </main>

      <footer className="colophon">
        <span>Built with Gemini · sources: arXiv API + GitHub Search</span>
        <span className="mono">GDG Stanford · Build with Google Gemini · 2026</span>
      </footer>
    </div>
  );
}
