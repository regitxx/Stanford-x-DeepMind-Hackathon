# AI Studio Paste Pack

> Paste each file below over the AI Studio **Build-mode skeleton in this exact order**,
> then delete any leftover skeleton files that are not in this list. Files are ordered
> dependencies-first (entrypoint `index.tsx` last). No API key lives in these files —
> AI Studio injects `process.env.API_KEY` at deploy time.

## 1. metadata.json

```json
{
  "name": "Blueprint — idea to architecture in a minute",
  "description": "Type a product idea. Three agents (Scout, Analyst, Architect) search arXiv and GitHub, extract what actually works, and return 2-3 cited architecture variants with diagrams and a trade-off table.",
  "requestFramePermissions": []
}
```

## 2. index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Blueprint — idea to architecture in a minute</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Sans:wght@400;600&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet" />
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@19.1.0",
    "react/jsx-runtime": "https://esm.sh/react@19.1.0/jsx-runtime",
    "react-dom/client": "https://esm.sh/react-dom@19.1.0/client",
    "@google/genai": "https://esm.sh/@google/genai@1.16.0",
    "mermaid": "https://esm.sh/mermaid@11.4.0"
  }
}
</script>
<style>
  :root {
    --paper: #0E1D33;      /* blueprint field */
    --paper-2: #12253F;    /* raised sheet */
    --ink: #DCE9F7;        /* drafting ink */
    --ink-dim: #8FA9C9;
    --line: #2B4A73;       /* grid + hairlines */
    --cyan: #5FD4F5;       /* active ink */
    --amber: #F5B95F;      /* caution ink, used sparingly */
    --err: #F58F8F;
    --display: "Space Grotesk", sans-serif;
    --body: "IBM Plex Sans", sans-serif;
    --mono: "IBM Plex Mono", monospace;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body {
    background:
      repeating-linear-gradient(0deg, transparent 0 23px, rgba(95,212,245,.05) 23px 24px),
      repeating-linear-gradient(90deg, transparent 0 23px, rgba(95,212,245,.05) 23px 24px),
      var(--paper);
    color: var(--ink);
    font-family: var(--body);
    font-size: 15px;
    line-height: 1.55;
  }
  .frame { max-width: 1180px; margin: 0 auto; padding: 28px 20px 40px; }

  /* Masthead */
  .masthead { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px 24px; border-bottom: 1px solid var(--line); padding-bottom: 18px; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand-mark { width: 22px; height: 22px; border: 2px solid var(--cyan); position: relative; }
  .brand-mark::after { content: ""; position: absolute; inset: 4px -8px -8px 4px; border: 2px solid var(--line); }
  h1 { font-family: var(--display); font-weight: 700; font-size: 30px; letter-spacing: .02em; margin: 0; }
  .strap { color: var(--ink-dim); margin: 0; max-width: 640px; }

  /* Drafting table (input) */
  .drafting-table { margin-top: 26px; }
  .input-label { display: block; font-family: var(--mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--cyan); margin-bottom: 8px; }
  .input-row { display: flex; gap: 10px; }
  input#idea {
    flex: 1; background: var(--paper-2); border: 1px solid var(--line); color: var(--ink);
    font-family: var(--body); font-size: 17px; padding: 14px 16px; border-radius: 2px; min-width: 0;
  }
  input#idea:focus-visible, .tab:focus-visible, .run:focus-visible, .chip-btn:focus-visible, .ghost:focus-visible {
    outline: 2px solid var(--cyan); outline-offset: 2px;
  }
  .run {
    font-family: var(--display); font-weight: 700; font-size: 16px; letter-spacing: .03em;
    background: var(--cyan); color: #06131f; border: 0; padding: 0 26px; border-radius: 2px; cursor: pointer;
  }
  .run:disabled { opacity: .45; cursor: default; }
  .demo-row { margin-top: 12px; align-items: center; }
  .demo-label { font-family: var(--mono); font-size: 12px; color: var(--ink-dim); margin-right: 4px; }
  .error { color: var(--err); margin: 10px 0 0; }

  /* Workbench layout */
  .workbench { display: grid; grid-template-columns: 340px 1fr; gap: 22px; margin-top: 26px; align-items: start; }
  .workbench.empty { grid-template-columns: 1fr; }
  .blank-slate { border: 1px dashed var(--line); padding: 56px 24px; text-align: center; color: var(--ink-dim); }
  .blank-accent { font-family: var(--display); font-size: 22px; color: var(--ink); margin-top: 6px; }

  /* Agent console */
  .console { background: rgba(6,17,31,.72); border: 1px solid var(--line); border-radius: 2px; position: sticky; top: 16px; }
  .console-head { display: flex; justify-content: space-between; align-items: center; font-family: var(--mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--cyan); border-bottom: 1px solid var(--line); padding: 10px 12px; }
  .ghost { background: none; border: 1px solid var(--line); color: var(--ink-dim); font-family: var(--mono); font-size: 11px; padding: 4px 8px; cursor: pointer; border-radius: 2px; text-transform: none; letter-spacing: 0; }
  .ghost:hover { color: var(--cyan); border-color: var(--cyan); }
  .console ol { list-style: none; margin: 0; padding: 10px 12px; display: flex; flex-direction: column; gap: 7px; max-height: 70vh; overflow: auto; }
  .log { display: flex; gap: 8px; align-items: baseline; font-family: var(--mono); font-size: 12.5px; animation: rise .3s ease both; }
  .tag { flex: none; font-size: 10px; letter-spacing: .1em; padding: 1px 5px; border: 1px solid var(--line); color: var(--ink-dim); }
  .tag-scout { color: var(--cyan); border-color: var(--cyan); }
  .tag-analyst { color: var(--amber); border-color: var(--amber); }
  .tag-architect { color: #9FF5C0; border-color: #9FF5C0; }
  .log-text { flex: 1; }
  .log-dot { color: var(--ink-dim); }
  .log-ok .log-dot { color: var(--cyan); }
  .log-err { color: var(--err); }
  .log-err .log-dot { color: var(--err); }
  @keyframes rise { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }

  /* Results */
  .tabbar { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
  .tab { font-family: var(--mono); font-size: 12.5px; background: none; border: 1px solid var(--line); color: var(--ink-dim); padding: 7px 12px; cursor: pointer; border-radius: 2px; }
  .tab-on { color: #06131f; background: var(--cyan); border-color: var(--cyan); font-weight: 600; }
  .sheet { background: var(--paper-2); border: 1px solid var(--line); border-radius: 2px; padding: 20px 22px 24px; }
  .stamp-in { animation: stamp .34s cubic-bezier(.2,.9,.3,1.2) both; }
  @keyframes stamp { from { opacity: 0; transform: scale(1.035); } to { opacity: 1; transform: scale(1); } }

  /* Title block — the signature element */
  .title-block { display: grid; grid-template-columns: 2fr 1fr 1fr 1.4fr; border: 1px solid var(--cyan); margin-bottom: 16px; }
  .tb-cell { border-right: 1px solid var(--line); padding: 8px 12px; min-width: 0; }
  .tb-cell:last-child { border-right: 0; }
  .tb-label { display: block; font-family: var(--mono); font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--ink-dim); }
  .tb-cell h3 { font-family: var(--display); font-size: 19px; margin: 2px 0 0; letter-spacing: .01em; }
  .tb-mono { font-family: var(--mono); font-size: 12.5px; }
  .badge { font-family: var(--mono); font-size: 11.5px; padding: 2px 7px; border: 1px solid; }
  .badge-0 { color: var(--cyan); border-color: var(--cyan); }
  .badge-1 { color: #9FF5C0; border-color: #9FF5C0; }
  .badge-2 { color: var(--amber); border-color: var(--amber); }

  .tagline { font-family: var(--display); font-size: 17px; margin: 0 0 6px; }
  .summary { color: var(--ink-dim); margin: 0 0 16px; }
  .diagram { background: rgba(6,17,31,.55); border: 1px dashed var(--line); padding: 14px; overflow-x: auto; }
  .diagram svg { max-width: 100%; height: auto; }
  .diagram-fallback { background: rgba(6,17,31,.55); border: 1px dashed var(--amber); padding: 14px; font-family: var(--mono); font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
  .sec-label { font-family: var(--mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--cyan); margin: 18px 0 8px; }
  .components { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
  .components li { border-left: 2px solid var(--line); padding-left: 12px; }
  .chip-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 5px; }
  .chip { font-family: var(--mono); font-size: 11.5px; color: var(--cyan); border: 1px solid var(--line); padding: 2px 8px; text-decoration: none; background: none; border-radius: 2px; }
  a.chip:hover { border-color: var(--cyan); }
  .chip-btn { cursor: pointer; color: var(--ink); }
  .chip-btn:hover:enabled { border-color: var(--cyan); color: var(--cyan); }
  .chip-btn:disabled { opacity: .5; }
  .risk-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .risk-grid p { margin: 0; color: var(--ink-dim); }

  .compare-title { font-family: var(--display); font-size: 19px; margin: 0 0 14px; }
  .table-wrap { overflow-x: auto; }
  table { border-collapse: collapse; width: 100%; font-size: 14px; }
  th, td { border: 1px solid var(--line); padding: 9px 12px; text-align: left; vertical-align: top; }
  thead th { font-family: var(--mono); font-size: 12px; letter-spacing: .06em; color: var(--cyan); background: rgba(6,17,31,.55); }
  tbody th { font-weight: 600; color: var(--ink); background: rgba(6,17,31,.35); }
  td { color: var(--ink-dim); }

  .source-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
  .source-list li { display: flex; gap: 12px; align-items: flex-start; }
  .source-list a { color: var(--cyan); text-decoration: none; font-weight: 600; }
  .source-list a:hover { text-decoration: underline; }
  .src-meta { display: block; font-family: var(--mono); font-size: 11.5px; color: var(--ink-dim); margin: 2px 0 4px; }
  .source-list p { margin: 0; color: var(--ink-dim); font-size: 13.5px; }

  .colophon { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; border-top: 1px solid var(--line); margin-top: 34px; padding-top: 14px; color: var(--ink-dim); font-size: 12.5px; }
  .mono { font-family: var(--mono); }

  @media (max-width: 900px) {
    .workbench { grid-template-columns: 1fr; }
    .console { position: static; }
    .console ol { max-height: 34vh; }
    .title-block { grid-template-columns: 1fr 1fr; }
    .tb-cell:nth-child(2) { border-right: 0; }
    .tb-name { grid-column: 1 / -1; border-bottom: 1px solid var(--line); border-right: 0; }
    .risk-grid { grid-template-columns: 1fr; }
    .input-row { flex-direction: column; }
    .run { padding: 13px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .log, .stamp-in { animation: none; }
  }
</style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>
```

## 3. types.ts

```ts
export type AgentName = 'scout' | 'analyst' | 'architect' | 'system';

export interface LogEntry {
  id: number;
  agent: AgentName;
  text: string;
  status: 'run' | 'ok' | 'err';
}

export interface Source {
  id: string; // s1, s2, ...
  kind: 'paper' | 'repo';
  title: string;
  url: string;
  origin: 'arXiv' | 'GitHub';
  snippet: string; // abstract or README excerpt (truncated)
  meta?: string; // authors/year or stars/language
}

export interface Insight {
  sourceId: string;
  architecture: string;
  algorithmOrMath: string;
  limitations: string;
  metrics: string;
  relevance: string;
}

export interface VariantComponent {
  name: string;
  role: string;
  sourceIds: string[];
}

export interface Variant {
  id: string;
  name: string;
  profile: string; // "Fast MVP" | "Scalable" | "Research-grade"
  tagline: string;
  summary: string;
  mermaid: string;
  components: VariantComponent[];
  risks: string;
  whenToChoose: string;
}

export interface ComparisonRow {
  criterion: string;
  values: string[]; // aligned with variants order
}

export interface RunResult {
  topic: string;
  sources: Source[];
  insights: Insight[];
  variants: Variant[];
  comparison: ComparisonRow[];
}
```

## 4. examples.generated.ts

```ts
import type { RunResult } from './types';

// AUTO-GENERATED by scripts/generate-examples.ts — do not edit by hand.
// Real live pipeline runs captured 2026-07-18T09:25:23.911Z.
// Regenerate: npm run examples
export const EXAMPLE_RUNS: RunResult[] = [
  {
    "topic": "distributed database built on AI agents",
    "sources": [
      {
        "kind": "paper",
        "origin": "arXiv",
        "title": "A Survey of Multi-Agent Deep Reinforcement Learning with Communication",
        "url": "https://arxiv.org/abs/2203.08975v2",
        "snippet": "Communication is an effective mechanism for coordinating the behaviors of multiple agents, broadening their views of the environment, and to support their collaborations. In the field of multi-agent deep reinforcement learning (MADRL), agents can improve the overall learning performance and achieve their objectives by communication. Agents can communicate various types of messages, either to all agents or to specific agent groups, or conditioned on specific constraints. With the growing body of research work in MADRL with communication (Comm-MADRL), there is a lack of a systematic and structural approach to distinguish and classify existing Comm-MADRL approaches. In this paper, we survey recent works in the Comm-MADRL field and consider various aspects of communication that can play a role in designing and developing multi-agent reinforcement learning systems. With these aspects in mind,…",
        "meta": "Changxi Zhu, Mehdi Dastani, Shihan Wang · 2022",
        "id": "s1"
      },
      {
        "kind": "paper",
        "origin": "arXiv",
        "title": "A Methodology to Engineer and Validate Dynamic Multi-level Multi-agent Based Simulations",
        "url": "https://arxiv.org/abs/1311.5108v1",
        "snippet": "This article proposes a methodology to model and simulate complex systems, based on IRM4MLS, a generic agent-based meta-model able to deal with multi-level systems. This methodology permits the engineering of dynamic multi-level agent-based models, to represent complex systems over several scales and domains of interest. Its goal is to simulate a phenomenon using dynamically the lightest representation to save computer resources without loss of information. This methodology is based on two mechanisms: (1) the activation or deactivation of agents representing different domain parts of the same phenomenon and (2) the aggregation or disaggregation of agents representing the same phenomenon at different scales.",
        "meta": "Jean-Baptiste Soyez, Gildas Morvan, Daniel Dupont et al. · 2013",
        "id": "s2"
      },
      {
        "kind": "paper",
        "origin": "arXiv",
        "title": "Data Encoding for Byzantine-Resilient Distributed Optimization",
        "url": "https://arxiv.org/abs/1907.02664v2",
        "snippet": "We study distributed optimization in the presence of Byzantine adversaries, where both data and computation are distributed among $m$ worker machines, $t$ of which may be corrupt. The compromised nodes may collaboratively and arbitrarily deviate from their pre-specified programs, and a designated (master) node iteratively computes the model/parameter vector for generalized linear models. In this work, we primarily focus on two iterative algorithms: Proximal Gradient Descent (PGD) and Coordinate Descent (CD). Gradient descent (GD) is a special case of these algorithms. PGD is typically used in the data-parallel setting, where data is partitioned across different samples, whereas, CD is used in the model-parallelism setting, where data is partitioned across the parameter space. In this paper, we propose a method based on data encoding and error correction over real numbers to combat advers…",
        "meta": "Deepesh Data, Linqi Song, Suhas Diggavi · 2019",
        "id": "s3"
      },
      {
        "kind": "paper",
        "origin": "arXiv",
        "title": "Byzantine-Resilient SGD in High Dimensions on Heterogeneous Data",
        "url": "https://arxiv.org/abs/2005.07866v1",
        "snippet": "We study distributed stochastic gradient descent (SGD) in the master-worker architecture under Byzantine attacks. We consider the heterogeneous data model, where different workers may have different local datasets, and we do not make any probabilistic assumptions on data generation. At the core of our algorithm, we use the polynomial-time outlier-filtering procedure for robust mean estimation proposed by Steinhardt et al. (ITCS 2018) to filter-out corrupt gradients. In order to be able to apply their filtering procedure in our {\\em heterogeneous} data setting where workers compute {\\em stochastic} gradients, we derive a new matrix concentration result, which may be of independent interest. We provide convergence analyses for smooth strongly-convex and non-convex objectives. We derive our results under the bounded variance assumption on local stochastic gradients and a {\\em deterministic}…",
        "meta": "Deepesh Data, Suhas Diggavi · 2020",
        "id": "s4"
      },
      {
        "kind": "repo",
        "origin": "GitHub",
        "title": "K-Dense-AI/scientific-agent-skills",
        "url": "https://github.com/K-Dense-AI/scientific-agent-skills",
        "snippet": "Scientific Agent Skills Star History 🔔 Claude Scientific Skills is now Scientific Agent Skills. Same skills, broader compatibility — now works with any AI agent that supports the open Agent Skills standard, not just Claude. New: K Dense BYOK — A free, open source AI co scientist that runs on your desktop, powered by Scientific Agent Skills. Bring your own API keys, pick from 40+ models, and get a full research workspace with web search, file handling, 100+ scientific databases, and access to all 148 skills in this repo. Your data stays on your computer, and you can optionally scale to cloud compute via Modal for heavy workloads. Get started here. Stay up to date: Follow K Dense on X, LinkedIn, and YouTube for new skills, release announcements, walkthroughs, research workflow demos, and examples you can use with your own AI agent. A comprehensive collection of 148 ready to use scientific and research skills (covering cancer genomics, drug target binding, molecular dynamics, RNA velocity, geospatial science, time series forecasting, scientific ML resource discovery via Hugging Science, 78+ scientific databases, and more) for any AI agent that supports the open Agent Skills standard,…",
        "meta": "Python · ★ 31,118",
        "id": "s5"
      },
      {
        "kind": "repo",
        "origin": "GitHub",
        "title": "volcengine/OpenViking",
        "url": "https://github.com/volcengine/OpenViking",
        "snippet": "OpenViking: The Context Database for AI Agents English / 中文 / 日本語 Website · Live Demo · GitHub · Issues · Docs 👋 Join our Community 📱 Lark Group · WeChat · Discord · X ✨ May 2026 Update : Updated OpenViking benchmark results across User Memory, Agent Memory, and Knowledge Base QA scenarios. → See Evaluation Highlights. Overview Challenges in Agent Development In the AI era, data is abundant, but high quality context is hard to come by. When building AI Agents, developers often face these challenges: Fragmented Context : Memories are in code, resources are in vector databases, and skills are scattered, making them difficult to manage uniformly. Surging Context Demand : An Agent's long running tasks produce context at every execution. Simple truncation or compression leads to information loss. Poor Retrieval Effectiveness : Traditional RAG uses flat storage, lacking a global view and making it difficult to understand the full context of information. Unobservable Context : The implicit retrieval chain of traditional RAG is like a black box, making it hard to debug when errors occur. Limited Memory Iteration : Current memory is just a record of user interactions, lacking Agent relate…",
        "meta": "Python · ★ 26,900",
        "id": "s6"
      },
      {
        "kind": "repo",
        "origin": "GitHub",
        "title": "NAalytics/Assemblies-of-putative-SARS-CoV2-spike-encoding-mRNA-sequences-for-vaccines-BNT-162b2-and-mRNA-1273",
        "url": "https://github.com/NAalytics/Assemblies-of-putative-SARS-CoV2-spike-encoding-mRNA-sequences-for-vaccines-BNT-162b2-and-mRNA-1273",
        "snippet": "Assemblies of putative SARS CoV2 spike encoding mRNA sequences for vaccines BNT 162b2 and mRNA 1273 version 0.21Beta 04/14/21: (updates intended to (i) clarify the clinical and research importance of sequence information and strand topology measurements, and (ii) clarify that the mRNA sequence is not a recipe to produce vaccine) Dae Eun Jeong, Matthew McCoy, Karen Artiles, Orkan Ilbay, Andrew Fire , Kari Nadeau, Helen Park, Brooke Betts, Scott Boyd, Ramona Hoh, and Massa Shoura Departments of Pathology, Genetics, Pediatrics, and Medicine, Stanford University School of Medicine and Veterans Affairs Palo Alto Medical Center Correspondence: afire@stanford.edu and/or massa86@stanford.edu Abstract: RNA vaccines have become a key tool in moving forward through the challenges raised both in the current pandemic and in numerous other public health and medical challenges. With the rollout of vaccines for COVID 19, these synthetic mRNAs have become broadly distributed RNA species in numerous human populations. Despite their ubiquity, sequences are not always available for such RNAs. Standard methods facilitate such sequencing. In this note, we provide experimental sequence information for th…",
        "meta": "★ 3,353",
        "id": "s7"
      }
    ],
    "insights": [
      {
        "sourceId": "s1",
        "architecture": "Multi-agent deep reinforcement learning (MADRL) systems where agents coordinate through communication.",
        "algorithmOrMath": "Multi-agent deep reinforcement learning (MADRL) using message-passing between specific agents or groups.",
        "limitations": "Lack of a systematic and structural approach to classify existing communication-based MADRL approaches.",
        "metrics": "Overall learning performance and achievement of agent objectives.",
        "relevance": "Provides a foundation for coordinating distributed agents, essential for a multi-agent database system."
      },
      {
        "sourceId": "s2",
        "architecture": "IRM4MLS, a dynamic multi-level multi-agent meta-model.",
        "algorithmOrMath": "Mechanisms for agent activation/deactivation and aggregation/disaggregation across different scales and domains.",
        "limitations": "not stated",
        "metrics": "Computational resource usage and preservation of information density.",
        "relevance": "Offers a methodology for scaling agent populations dynamically to handle varying database workloads."
      },
      {
        "sourceId": "s3",
        "architecture": "Distributed master-worker architecture with $m$ worker machines.",
        "algorithmOrMath": "Proximal Gradient Descent (PGD), Coordinate Descent (CD), and data encoding/error correction over real numbers.",
        "limitations": "Assumes a designated master node to iteratively compute the model vector.",
        "metrics": "Resilience against $t$ corrupt Byzantine nodes.",
        "relevance": "Critical for ensuring data integrity and consistency in a distributed database subject to malicious nodes."
      },
      {
        "sourceId": "s4",
        "architecture": "Distributed master-worker architecture for stochastic gradient descent (SGD).",
        "algorithmOrMath": "Polynomial-time outlier-filtering procedure for robust mean estimation and a new matrix concentration result.",
        "limitations": "Assumes bounded variance on local stochastic gradients and specific deterministic conditions.",
        "metrics": "Convergence rates for smooth strongly-convex and non-convex objectives.",
        "relevance": "Enhances robustness of distributed learning tasks within an AI agent database framework."
      },
      {
        "sourceId": "s5",
        "architecture": "Desktop-based AI research workspace compatible with the open Agent Skills standard.",
        "algorithmOrMath": "Standardized skills for web search, file handling, and scientific database interfacing (148+ skills).",
        "limitations": "Requires user-provided API keys (BYOK) for LLM access.",
        "metrics": "Support for 40+ models and access to 100+ scientific databases.",
        "relevance": "Provides standardized 'skills' that agents can use to interact with external databases and datasets."
      },
      {
        "sourceId": "s6",
        "architecture": "OpenViking, described as 'The Context Database for AI Agents'.",
        "algorithmOrMath": "Global context management and structured memory iteration for agent-specific tasks.",
        "limitations": "Traditional RAG is cited as having limited memory iteration and fragmented context.",
        "metrics": "Benchmark results across User Memory, Agent Memory, and Knowledge Base QA scenarios.",
        "relevance": "Directly addresses the need for a specialized database to manage agent memories and contexts."
      },
      {
        "sourceId": "s7",
        "architecture": "not stated",
        "algorithmOrMath": "Experimental sequencing methods for synthetic mRNA species.",
        "limitations": "Sequences are provided as experimental information, not a manufacturing recipe.",
        "metrics": "Accuracy of strand topology measurements and sequence information.",
        "relevance": "Low; focuses on biological sequence data rather than distributed database or agent architecture."
      }
    ],
    "variants": [
      {
        "id": "v1",
        "name": "Master-Worker Skill Wrapper",
        "profile": "Fast MVP",
        "tagline": "Centralized agent orchestration with standardized database skills",
        "summary": "A pragmatic approach using a master-worker architecture to delegate database operations to agents equipped with standardized skill sets, utilizing a dedicated context database for memory management.",
        "mermaid": "flowchart TD\nK[\"User Query\"] --> A\nA[\"Master Node\"] --> B[\"Worker Agent\"]\nA --> C[\"Worker Agent\"]\nB --> D[\"Database Skill Set\"]\nC --> D[\"Database Skill Set\"]\nB --> E[\"Context Database\"]\nC --> E[\"Context Database\"]",
        "components": [
          {
            "name": "Master Node",
            "role": "Orchestrates task distribution and iterative computation of model vectors",
            "sourceIds": [
              "s3"
            ]
          },
          {
            "name": "Database Skill Set",
            "role": "Standardized interfaces for file handling and scientific database interaction",
            "sourceIds": [
              "s5"
            ]
          },
          {
            "name": "Context Database",
            "role": "Global context management and structured memory iteration for agents",
            "sourceIds": [
              "s6"
            ]
          }
        ],
        "risks": "The master node represents a single point of failure and a performance bottleneck for high-concurrency workloads.",
        "whenToChoose": "When you need to build a functional prototype quickly using existing LLM skill frameworks and centralized control."
      },
      {
        "id": "v2",
        "name": "Dynamic Multi-Level Cluster",
        "profile": "Scalable",
        "tagline": "Elastic agent population with Byzantine-resilient data encoding",
        "summary": "An elastic architecture that scales agent populations dynamically based on workload, using data encoding to ensure resilience against corrupt nodes in the distributed network.",
        "mermaid": "flowchart TD\nA[\"Workload Monitor\"] --> B[\"Scaling Controller\"]\nB --> C[\"Agent Aggregator\"]\nC --> D[\"Worker Cluster\"]\nD --> E[\"Data Encoding Layer\"]\nE --> F[\"Byzantine Resilient Storage\"]",
        "components": [
          {
            "name": "Scaling Controller",
            "role": "Manages agent activation and deactivation across different scales",
            "sourceIds": [
              "s2"
            ]
          },
          {
            "name": "Agent Aggregator",
            "role": "Handles aggregation and disaggregation of agent populations for resource efficiency",
            "sourceIds": [
              "s2"
            ]
          },
          {
            "name": "Data Encoding Layer",
            "role": "Applies error correction over real numbers to ensure resilience against corrupt nodes",
            "sourceIds": [
              "s3"
            ]
          }
        ],
        "risks": "Sources are silent on the specific overhead of dynamic agent re-aggregation in low-latency database scenarios.",
        "whenToChoose": "When the database must handle variable workloads and requires high resilience against node failures or corruption."
      },
      {
        "id": "v3",
        "name": "MADRL Byzantine Swarm",
        "profile": "Research-grade",
        "tagline": "Self-optimizing coordination with high-dimensional robust estimation",
        "summary": "A decentralized swarm using Multi-Agent Deep Reinforcement Learning for coordination, combined with robust mean estimation to handle heterogeneous data and Byzantine attacks in high dimensions.",
        "mermaid": "flowchart TD\nA[\"Communication Layer\"] --> B[\"MADRL Agent\"]\nB --> C[\"MADRL Agent\"]\nB --> D[\"Robust Mean Estimator\"]\nC --> D[\"Robust Mean Estimator\"]\nD --> E[\"Structured Memory Iteration\"]\nE --> F[\"Global Context DB\"]",
        "components": [
          {
            "name": "MADRL Communication Layer",
            "role": "Enables agent coordination via message-passing and deep reinforcement learning",
            "sourceIds": [
              "s1"
            ]
          },
          {
            "name": "Robust Mean Estimator",
            "role": "Polynomial-time outlier filtering for SGD on heterogeneous data",
            "sourceIds": [
              "s4"
            ]
          },
          {
            "name": "Structured Memory Iteration",
            "role": "Advanced context management to overcome limitations of traditional RAG",
            "sourceIds": [
              "s6"
            ]
          }
        ],
        "risks": "Complexity of high-dimensional robust estimation may significantly increase query latency; MADRL convergence is not guaranteed in all topologies.",
        "whenToChoose": "When building a state-of-the-art autonomous system that prioritizes data integrity and learning performance over simple throughput."
      }
    ],
    "comparison": [
      {
        "criterion": "Time to MVP",
        "values": [
          "2-4 weeks",
          "2-4 months",
          "6-12 months"
        ]
      },
      {
        "criterion": "Scaling Ceiling",
        "values": [
          "Moderate limited by master",
          "High via dynamic aggregation",
          "Very high via MADRL"
        ]
      },
      {
        "criterion": "Consistency/Quality",
        "values": [
          "High centralized control",
          "High via Byzantine resilience",
          "Adaptive via robust estimation"
        ]
      },
      {
        "criterion": "Cost per query",
        "values": [
          "Low agent overhead",
          "Medium encoding overhead",
          "High due to MADRL/filtering"
        ]
      },
      {
        "criterion": "Ops Complexity",
        "values": [
          "Low",
          "High dynamic management",
          "Very high research focus"
        ]
      },
      {
        "criterion": "Resiliency",
        "values": [
          "Low single master",
          "High Byzantine resilient",
          "Advanced high-dimensional robustness"
        ]
      }
    ]
  },
  {
    "topic": "AI code-review copilot for monorepos",
    "sources": [
      {
        "kind": "paper",
        "origin": "arXiv",
        "title": "YouZhi: Towards High-Concurrency Financial LLMs via Adaptive GQA-to-MLA Transition",
        "url": "https://arxiv.org/abs/2606.05868v1",
        "snippet": "Large language models (LLMs) drive significant financial innovations, yet their high-concurrency deployment is severely bottlenecked by KV cache memory overhead, which inflates infrastructure costs and throttles scalability. To address this, we propose YouZhi-LLM, a highly efficient financial LLM empowered by a comprehensive structural transition and training pipeline natively built on the Huawei Ascend ecosystem. At its algorithmic core, YouZhi-LLM features a layer-adaptive GQA-to-MLA transition framework that dynamically assigns per-layer FreqFold sizes, maximizing KV-cache compression while minimizing perplexity degradation. To recover representation capacity and inject domain expertise, the Ascend-based training pipeline seamlessly integrates generalized knowledge distillation with financial-specific supervised fine-tuning. Evaluations demonstrate the superiority of this systematic a…",
        "meta": "PSBC LLM Team, Huawei LLM Team, Ruihan Long et al. · 2026",
        "id": "s1"
      },
      {
        "kind": "paper",
        "origin": "arXiv",
        "title": "When AI Reviews Its Own Code: Recursive Self-Training Collapse in Code LLMs",
        "url": "https://arxiv.org/abs/2606.28438v1",
        "snippet": "Recursive self-training can degrade neural generative models when generated data is reused without fresh human data or external quality control. We study this risk in code LLMs, where AI-generated code can enter real repositories, later become training data, and create a repository-scale self-training loop. While software development traditionally interrupts this loop through pull-request review, tests, compilation, and human approval, AI coding tools now produce code faster than humans can review it, and code review itself is increasingly automated by AI systems. We therefore compare three recursive fine-tuning regimes: no review, Human-gate review using model-independent filters such as compilation and static quality checks, and AI-self-gate review using the code LLM's own signals such as perplexity and binary self-scoring. Across multiple code LLMs and benchmarks, no review collapses …",
        "meta": "Xinyuan Song, Zekun Cai, Liang Zhao · 2026",
        "id": "s2"
      },
      {
        "kind": "paper",
        "origin": "arXiv",
        "title": "Towards semi-classical analysis for sub-elliptic operators",
        "url": "https://arxiv.org/abs/2111.09854v1",
        "snippet": "We discuss the recent developments of semi-classical and micro-local analysis in the context of nilpotent Lie groups and for sub-elliptic operators. In particular, we give an overview of pseudo-differential calculi recently defined on nilpotent Lie groups as well as of the notion of quantum limits in the Euclidean and nilpotent cases.",
        "meta": "Veronique Fischer · 2021",
        "id": "s3"
      },
      {
        "kind": "paper",
        "origin": "arXiv",
        "title": "D0 Regional Analysis Center Concepts",
        "url": "https://arxiv.org/abs/cs/0306115v1",
        "snippet": "The D0 experiment is facing many exciting challenges providing a computing environment for its worldwide collaboration. Transparent access to data for processing and analysis has been enabled through deployment of its SAM system to collaborating sites and additional functionality will be provided soon with SAMGrid components. In order to maximize access to global storage, computational and intellectual resources, and to enable the system to scale to the large demands soon to be realized, several strategic sites have been identified as Regional Analysis Centers (RAC's). These sites play an expanded role within the system. The philosophy and function of these centers is discussed and details of their composition and operation are outlined. The plan for future additional centers is also addressed.",
        "meta": "L. Lueking, representing the D0 Remote Analysis Task Force · 2003",
        "id": "s4"
      },
      {
        "kind": "repo",
        "origin": "GitHub",
        "title": "villesau/ai-codereviewer",
        "url": "https://github.com/villesau/ai-codereviewer",
        "snippet": "AI Code Reviewer AI Code Reviewer is a GitHub Action that leverages OpenAI's GPT 4 API to provide intelligent feedback and suggestions on your pull requests. This powerful tool helps improve code quality and saves developers time by automating the code review process. Features Reviews pull requests using OpenAI's GPT 4 API. Provides intelligent comments and suggestions for improving your code. Filters out files that match specified exclude patterns. Easy to set up and integrate into your GitHub workflow. Setup 1. To use this GitHub Action, you need an OpenAI API key. If you don't have one, sign up for an API key at OpenAI. 2. Add the OpenAI API key as a GitHub Secret in your repository with the name OPENAI API KEY . You can find more information about GitHub Secrets here. 3. Create a .github/workflows/main.yml file in your repository and add the following content: 4. Replace your username with your GitHub username or organization name where the AI Code Reviewer repository is located. 5. Customize the exclude input if you want to ignore certain file patterns from being reviewed. 6. Commit the changes to your repository, and AI Code Reviewer will start working on your future pull req…",
        "meta": "TypeScript · ★ 1,031",
        "id": "s5"
      },
      {
        "kind": "repo",
        "origin": "GitHub",
        "title": "russelleNVy/three-man-team",
        "url": "https://github.com/russelleNVy/three-man-team",
        "snippet": "russellenvy.github.io/three man team By RUSSΞLL AARØN What's New — v1.3.0 New: manifest.md — Arch generates this at first time setup. Single source of truth for your install: team names, role filenames, handoff directory, repo, branch. Improved: version check now reads a version registry ( releases/latest.json ) instead of hitting the GitHub API. Critical updates are mandatory checkpoints; non critical ones are your choice. Improved: Arch reads your actual files before walking through any change — no more guessing at your setup. Removed: VERSION file retired. Version lives in manifest.md . See all releases → Three Man Team Pro Pre built teams for developers, marketers, content creators, and more — install in minutes, start working immediately. Join the waitlist → The Problem With AI Coding Tools AI coding tools are powerful but undisciplined. They read entire codebases when they need one function. They add features nobody asked for. They drift mid task. They burn tokens on every session doing work that didn't need to happen. The solution isn't a better prompt. It's a process. Three Man Team gives you three agents with distinct jobs, clear handoffs, and rules that prevent the most e…",
        "meta": "Shell · ★ 880",
        "id": "s6"
      },
      {
        "kind": "repo",
        "origin": "GitHub",
        "title": "NamesMT/starter-monorepo",
        "url": "https://github.com/NamesMT/starter-monorepo",
        "snippet": "Starter Monorepo Monorepo is amazing! starter monorepo starter monorepo Overview What's inside? Overview of the tech Highlight Features / Components AI / LLM Chat Apps and Libraries frontend : a Nuxt 4 app. backend : a Hono🔥 app. backend convex : a Convex app. Local packages Utilities Build Develop Wrangler / Cloudflare Workers (Local dev via workerd) API only setup workerd for Workers bindings: Full setup (everything behaves like workerd ) for 100% Cloudflare workerd runtime testing: IMPORTANT: Deploy Notes import ordering Dev with SSL Turborepo Remote Caching Useful Links Turborepo grammY Overview This is an opinionated, heavily tweaked monorepo starter template to kick start a project, whether its a fullstack project, monorepo of multiple libraries and applications, or even just one API server and its related infrastructure deployment and utilities. Out of the box with the included apps, we have a fullstack project: with a frontend Nuxt 4 app, a main backend using Hono, and a backend convex Convex app. General APIs, such as authentication, are handled by the main backend , which is designed to be serverless compatible and can be deployed anywhere, allowing for the best possible…",
        "meta": "Vue · ★ 192",
        "id": "s7"
      }
    ],
    "insights": [
      {
        "sourceId": "s1",
        "architecture": "YouZhi-LLM utilizes a layer-adaptive GQA-to-MLA transition framework natively built on the Huawei Ascend ecosystem.",
        "algorithmOrMath": "The framework dynamically assigns per-layer FreqFold sizes to maximize KV-cache compression while minimizing perplexity degradation.",
        "limitations": "Deployment of such models is typically bottlenecked by KV cache memory overhead and infrastructure costs.",
        "metrics": "Evaluations focus on KV-cache compression ratios and perplexity degradation.",
        "relevance": "Provides technical optimization for high-concurrency LLM deployments, which is relevant for scaling AI code-review systems in large monorepos."
      },
      {
        "sourceId": "s2",
        "architecture": "The study compares three recursive fine-tuning regimes: no review, Human-gate review (static filters), and AI-self-gate review.",
        "algorithmOrMath": "Evaluates self-training loops using model-independent filters like compilation and static quality checks versus model-driven signals like perplexity.",
        "limitations": "Recursive self-training can lead to model collapse if AI-generated code is reused without external quality control or human intervention.",
        "metrics": "Model performance is measured across multiple benchmarks and quality indicators such as compilation success and static checks.",
        "relevance": "Critically addresses the risk of using AI for automated code reviews, highlighting the need for quality gates to prevent model degradation."
      },
      {
        "sourceId": "s3",
        "architecture": "not stated",
        "algorithmOrMath": "Discusses pseudo-differential calculi on nilpotent Lie groups and semi-classical analysis for sub-elliptic operators.",
        "limitations": "not stated",
        "metrics": "not stated",
        "relevance": "Minimal; focuses on theoretical mathematical analysis rather than software engineering or AI code review."
      },
      {
        "sourceId": "s4",
        "architecture": "Regional Analysis Centers (RACs) utilizing SAM and SAMGrid components for distributed computing.",
        "algorithmOrMath": "not stated",
        "limitations": "Needs to scale to meet large demands from a worldwide collaboration.",
        "metrics": "Scale of data access and processing capacity.",
        "relevance": "Discusses distributed infrastructure and transparent data access, which parallels the infrastructure needs of a monorepo copilot."
      },
      {
        "sourceId": "s5",
        "architecture": "A GitHub Action that integrates with the OpenAI GPT-4 API.",
        "algorithmOrMath": "Uses GPT-4 API to generate comments and filter files based on exclude patterns.",
        "limitations": "Requires a manual setup of GitHub Secrets and an external OpenAI API key.",
        "metrics": "not stated",
        "relevance": "A direct implementation of an AI code-review copilot that can be integrated into repository workflows."
      },
      {
        "sourceId": "s6",
        "architecture": "A three-agent system with distinct roles, clear handoffs, and a manifest-based single source of truth.",
        "algorithmOrMath": "Uses a process-driven approach instead of a better prompt to prevent task drift and token wastage.",
        "limitations": "Traditional AI tools burn tokens on unnecessary work and read entire codebases when only specific functions are needed.",
        "metrics": "Token consumption and adherence to task scope.",
        "relevance": "Offers a multi-agent architectural pattern to improve the discipline and efficiency of AI coding tools."
      },
      {
        "sourceId": "s7",
        "architecture": "An opinionated monorepo using Turborepo, Nuxt 4 (frontend), Hono (backend), and Convex.",
        "algorithmOrMath": "not stated",
        "limitations": "Heavily tweaked and opinionated, which may not suit all project types.",
        "metrics": "not stated",
        "relevance": "Provides a reference structure for building and deploying monorepos, including remote caching and serverless compatibility."
      }
    ],
    "variants": [
      {
        "id": "v1",
        "name": "Action-Based Fast MVP",
        "profile": "Fast MVP",
        "tagline": "Simple GitHub Action integration with static quality gates.",
        "summary": "A lightweight implementation focused on immediate utility using a GitHub Action to trigger reviews. It incorporates static quality filters to prevent the model collapse risks associated with unverified AI outputs.",
        "mermaid": "flowchart TD\nAI[\"PR Trigger\"] --> BI[\"Static Quality Gate\"]\nBI --> CI[\"LLM API\"]\nCI --> DI[\"PR Comment Generator\"]\nEI[\"Monorepo Context\"] --> BI",
        "components": [
          {
            "name": "GitHub Action Integration",
            "role": "Orchestrates the workflow and triggers on pull requests.",
            "sourceIds": [
              "s5"
            ]
          },
          {
            "name": "Static Quality Gate",
            "role": "Uses compilation and static checks to filter poor code before AI review.",
            "sourceIds": [
              "s2"
            ]
          },
          {
            "name": "LLM API Service",
            "role": "Generates code review comments based on file changes.",
            "sourceIds": [
              "s5"
            ]
          }
        ],
        "risks": "Relies heavily on external API availability and manual secret management; lacks deep monorepo awareness beyond simple file filtering.",
        "whenToChoose": "When you need a working prototype integrated into GitHub within days."
      },
      {
        "id": "v2",
        "name": "Distributed Multi-Agent System",
        "profile": "Scalable",
        "tagline": "Agentic architecture with optimized distributed inference.",
        "summary": "Designed for massive monorepos, this variant uses a three-agent system to prevent token wastage and a distributed data access layer to handle high-concurrency requests across multiple analysis centers.",
        "mermaid": "flowchart TD\nA[\"PR Request\"] --> B[\"Three-Agent Team\"]\nB --> C[\"Manifest Truth Store\"]\nC --> D[\"Distributed Data Access\"]\nD --> E[\"High-Concurrency LLM Cluster\"]\nE --> F[\"Review Output\"]",
        "components": [
          {
            "name": "Three-Agent Team",
            "role": "Distinct roles and handoffs to prevent task drift and token wastage.",
            "sourceIds": [
              "s6"
            ]
          },
          {
            "name": "Distributed Data Access Layer",
            "role": "Transparent data access inspired by Regional Analysis Center concepts.",
            "sourceIds": [
              "s4"
            ]
          },
          {
            "name": "High-Concurrency LLM Cluster",
            "role": "Utilizes adaptive GQA-to-MLA for memory-efficient inference.",
            "sourceIds": [
              "s1"
            ]
          }
        ],
        "risks": "High architectural complexity; requires specialized infrastructure for optimized KV-cache compression.",
        "whenToChoose": "When scaling to enterprise-grade monorepos with hundreds of daily pull requests."
      },
      {
        "id": "v3",
        "name": "Verified Self-Training Loop",
        "profile": "Research-grade",
        "tagline": "Self-improving review system with human-in-the-loop gates.",
        "summary": "Focuses on preventing recursive model collapse by implementing a human-gated self-training regime. It monitors perplexity and uses per-layer optimization to maintain high-quality feedback loops.",
        "mermaid": "flowchart TD\nA[\"Code Change\"] --> B[\"Self-Gate Filter\"]\nB --> C[\"AI Reviewer\"]\nC --> D[\"Perplexity Monitor\"]\nD --> E[\"Human Gate Review\"]\nE --> F[\"Fine-Tuning Loop\"]\nF --> C",
        "components": [
          {
            "name": "Human-Gate Review",
            "role": "Static filters and human intervention to prevent model collapse.",
            "sourceIds": [
              "s2"
            ]
          },
          {
            "name": "Perplexity Monitor",
            "role": "Measures model performance degradation during self-training.",
            "sourceIds": [
              "s1",
              "s2"
            ]
          },
          {
            "name": "Adaptive Framework",
            "role": "Dynamic FreqFold sizes to maximize KV-cache efficiency.",
            "sourceIds": [
              "s1"
            ]
          }
        ],
        "risks": "Significant human overhead for the review gate; potential for training data contamination.",
        "whenToChoose": "When developing a proprietary code model that must improve over time without degrading."
      }
    ],
    "comparison": [
      {
        "criterion": "Time to MVP",
        "values": [
          "1-3 days",
          "3-5 weeks",
          "3-6 months"
        ]
      },
      {
        "criterion": "Scaling Ceiling",
        "values": [
          "Limited by API limits",
          "High concurrency via distributed nodes",
          "Limited by human gate throughput"
        ]
      },
      {
        "criterion": "Data Efficiency",
        "values": [
          "Reads entire changed files",
          "Task-specific context via manifests",
          "Continuous loop optimization"
        ]
      },
      {
        "criterion": "Model Reliability",
        "values": [
          "Variable API quality",
          "Strict process-driven adherence",
          "Verified via human-in-the-loop"
        ]
      },
      {
        "criterion": "Ops Complexity",
        "values": [
          "Low: GitHub Actions only",
          "High: Distributed cluster management",
          "Very High: Training and monitoring pipelines"
        ]
      }
    ]
  }
];
```

## 5. constants.ts

```ts
// Free tier: 'gemini-3-flash-preview' (~10 RPM / 1,500 RPD).
// Once billing is enabled on the deploy project, switch to 'gemini-3.5-flash'.
// Override with GEMINI_MODEL in Node/CI; the `typeof process` guard keeps the browser build safe.
export const MODEL = (typeof process !== 'undefined' && process.env?.GEMINI_MODEL) || 'gemini-3-flash-preview';

export const SOURCE_LIMITS = { arxiv: 4, github: 3, total: 7 };

export const SCOUT_SYSTEM = `You are Scout, a research-search strategist. Given a product idea, produce short, high-recall search queries. arXiv queries: 2-4 technical keywords each, no quotes, no boolean operators. GitHub queries: 2-3 keywords matching how real repos are named/described. Output JSON only.`;

export const ANALYST_SYSTEM = `You are Analyst, a technical reader. For each source you receive (paper abstract or repo README excerpt), extract only what is stated or strongly implied. Be concrete and terse (1-2 sentences per field). If a field is not covered by the text, write "not stated". Never invent numbers. Output JSON only.`;

export const ARCHITECT_SYSTEM = `You are Architect, a pragmatic systems designer. Using ONLY the provided source insights, design 2-3 architecture variants for the user's idea: one "Fast MVP", one "Scalable", and optionally one "Research-grade". Every component must cite at least one sourceId that justifies it. Where sources conflict or are silent, say so in risks.

Mermaid rules (strict): output "flowchart TD" only; node ids A, B, C...; every label in double quotes; no parentheses, brackets, semicolons or the word "end" inside labels; max 12 nodes; edges may have short labels. Example: A["User"] -->|"idea"| B["Scout agent"].

Also produce a comparison table: 5-6 criteria rows (e.g. time to MVP, scaling ceiling, consistency/quality, cost per query, ops complexity, defensibility), values aligned to the variants order, each value under 8 words. Output JSON only. When a component is an LLM, VLM, or embedding service, name it generically (e.g. "vision-language model API") or as Gemini; name a specific third-party model only if a cited source is specifically about that model. Prefer 3 variants when the sources support three distinct profiles.`;

// ---------------------------------------------------------------------------
// CACHED DEMO RUNS — real live pipeline runs captured by scripts/generate-examples.ts.
// Regenerate with `npm run examples`; do not hand-edit examples.generated.ts.
// ---------------------------------------------------------------------------

export { EXAMPLE_RUNS as CACHED_RUNS } from './examples.generated';
```

## 6. services/sources.ts

````ts
import { SOURCE_LIMITS } from '../constants';
import type { Source } from '../types';

const clean = (s: string) => s.replace(/\s+/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n) + '…' : s);

// ---------------- arXiv ----------------

export function parseArxivAtom(xml: string): Omit<Source, 'id'>[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  return entries.map((e) => {
    const pick = (tag: string) => {
      const m = e.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return m ? clean(m[1]) : '';
    };
    const authors = [...e.matchAll(/<name>([\s\S]*?)<\/name>/g)].map((m) => clean(m[1]));
    const year = (pick('published').match(/^(\d{4})/) ?? [])[1] ?? '';
    const absUrl = pick('id').replace('http://', 'https://');
    return {
      kind: 'paper' as const,
      origin: 'arXiv' as const,
      title: pick('title'),
      url: absUrl,
      snippet: cut(pick('summary'), 900),
      meta: [authors.slice(0, 3).join(', ') + (authors.length > 3 ? ' et al.' : ''), year].filter(Boolean).join(' · '),
    };
  }).filter((s) => s.title && s.url);
}

async function fetchText(url: string): Promise<string> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.text();
}

// Try direct first; on ANY failure (CORS, network, non-200) retry once through a
// public CORS proxy. `via` tells the caller which path actually produced the results.
export async function searchArxiv(query: string, max: number): Promise<{ items: Omit<Source, 'id'>[]; via: 'direct' | 'proxy' }> {
  const direct = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&max_results=${max}&sortBy=relevance`;
  try {
    return { items: parseArxivAtom(await fetchText(direct)), via: 'direct' };
  } catch {
    const proxied = `https://api.allorigins.win/raw?url=${encodeURIComponent(direct)}`;
    return { items: parseArxivAtom(await fetchText(proxied)), via: 'proxy' };
  }
}

// ---------------- GitHub ----------------

interface GhRepo { full_name: string; html_url: string; description: string | null; stargazers_count: number; language: string | null; }

export async function searchGithub(query: string, max: number): Promise<Omit<Source, 'id'>[]> {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=${max}&sort=stars`;
  const r = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!r.ok) throw new Error(`GitHub search HTTP ${r.status}`);
  const data = (await r.json()) as { items?: GhRepo[] };
  const repos = data.items ?? [];
  return Promise.all(
    repos.map(async (repo) => {
      let snippet = repo.description ?? '';
      try {
        snippet = cut(stripMarkdown(await fetchReadme(repo.full_name)), 1200) || snippet;
      } catch { /* description is enough */ }
      return {
        kind: 'repo' as const,
        origin: 'GitHub' as const,
        title: repo.full_name,
        url: repo.html_url,
        snippet: snippet || 'No description available.',
        meta: [repo.language ?? undefined, `★ ${repo.stargazers_count.toLocaleString()}`].filter(Boolean).join(' · '),
      };
    }),
  );
}

async function fetchReadme(fullName: string): Promise<string> {
  for (const ref of ['HEAD', 'main', 'master']) {
    try {
      return await fetchText(`https://raw.githubusercontent.com/${fullName}/${ref}/README.md`);
    } catch { /* try next ref */ }
  }
  throw new Error('README not found');
}

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------- Combined ----------------

export async function gatherSources(arxivQueries: string[], githubQueries: string[], log: (t: string) => void): Promise<Source[]> {
  const paperBatches = await Promise.allSettled(
    arxivQueries.slice(0, 2).map((q) => searchArxiv(q, Math.ceil(SOURCE_LIMITS.arxiv / Math.min(arxivQueries.length, 2)))),
  );
  const fulfilledPapers = paperBatches.flatMap((b) => (b.status === 'fulfilled' ? [b.value] : []));
  const papers = fulfilledPapers.flatMap((r) => r.items);
  const viaProxy = fulfilledPapers.some((r) => r.via === 'proxy');
  if (papers.length) log(`arXiv ${viaProxy ? 'via proxy' : 'direct'}: ${papers.length} papers found`);
  else log('arXiv unavailable — continuing with GitHub only');

  const repoBatches = await Promise.allSettled(
    githubQueries.slice(0, 2).map((q) => searchGithub(q, 2)),
  );
  const repos = repoBatches.flatMap((b) => (b.status === 'fulfilled' ? b.value : []));
  log(`GitHub: ${repos.length} repositories found`);

  const seen = new Set<string>();
  const merged = [...papers.slice(0, SOURCE_LIMITS.arxiv), ...repos.slice(0, SOURCE_LIMITS.github)]
    .filter((s) => (seen.has(s.url) ? false : (seen.add(s.url), true)))
    .slice(0, SOURCE_LIMITS.total);

  if (merged.length === 0) throw new Error('No sources found — try a broader topic.');
  return merged.map((s, i) => ({ ...s, id: `s${i + 1}` }));
}
````

## 7. services/gemini.ts

````ts
import { GoogleGenAI, Type } from '@google/genai';
import { ANALYST_SYSTEM, ARCHITECT_SYSTEM, MODEL, SCOUT_SYSTEM } from '../constants';
import type { ComparisonRow, Insight, Source, Variant } from '../types';

function getApiKey(): string {
  // Vite's define replaces the literal `process.env.API_KEY` at build time; the try/catch
  // guards Node (where process exists) and the browser (where it may not) alike.
  try { if (process.env.API_KEY) return process.env.API_KEY; } catch { /* browser */ }
  return (import.meta as any)?.env?.VITE_GEMINI_API_KEY || '';
}

let client: GoogleGenAI | null = null;
function ai(): GoogleGenAI {
  if (!client) client = new GoogleGenAI({ apiKey: getApiKey() });
  return client;
}

function parseJson<T>(raw: string | undefined, stage: string): T {
  const text = (raw ?? '').replace(/^```(?:json)?/m, '').replace(/```\s*$/m, '').trim();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`${stage}: model returned malformed JSON`);
  }
}

// Retry only transient capacity/availability errors. Backoff: 2s then 5s, each + 0–500ms jitter.
async function withRetry<T>(fn: () => Promise<T>, tries = 3): Promise<T> {
  const delays = [2000, 5000];
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const retryable = /429|RESOURCE_EXHAUSTED|503|UNAVAILABLE/i.test(msg);
      if (!retryable || attempt >= tries - 1) throw err;
      const wait = delays[Math.min(attempt, delays.length - 1)] + Math.floor(Math.random() * 500);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

// ---------------- 1 · Scout ----------------

export async function scoutQueries(topic: string): Promise<{ arxivQueries: string[]; githubQueries: string[] }> {
  const res = await withRetry(() => ai().models.generateContent({
    model: MODEL,
    contents: `Product idea: "${topic}". Produce search queries.`,
    config: {
      systemInstruction: SCOUT_SYSTEM,
      responseMimeType: 'application/json',
      thinkingConfig: { thinkingLevel: 'low' } as any, // low reasoning is enough for query generation; cuts latency
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          arxivQueries: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2 arXiv keyword queries' },
          githubQueries: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2 GitHub keyword queries' },
        },
        required: ['arxivQueries', 'githubQueries'],
      },
    },
  }));
  return parseJson(res.text, 'Scout');
}

// ---------------- 2 · Analyst (one batched call for all sources) ----------------

const insightSchema = {
  type: Type.OBJECT,
  properties: {
    insights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sourceId: { type: Type.STRING },
          architecture: { type: Type.STRING },
          algorithmOrMath: { type: Type.STRING },
          limitations: { type: Type.STRING },
          metrics: { type: Type.STRING },
          relevance: { type: Type.STRING },
        },
        required: ['sourceId', 'architecture', 'algorithmOrMath', 'limitations', 'metrics', 'relevance'],
      },
    },
  },
  required: ['insights'],
};

export async function analyzeSources(topic: string, sources: Source[]): Promise<Insight[]> {
  const corpus = sources
    .map((s) => `[${s.id}] (${s.origin}) ${s.title}\n${s.snippet}`)
    .join('\n\n---\n\n');
  const res = await withRetry(() => ai().models.generateContent({
    model: MODEL,
    contents: `User idea: "${topic}".\n\nExtract insights for EVERY source below (one entry per sourceId).\n\n${corpus}`,
    config: {
      systemInstruction: ANALYST_SYSTEM,
      responseMimeType: 'application/json',
      thinkingConfig: { thinkingLevel: 'low' } as any, // extraction is grounded in the corpus; low reasoning cuts latency
      responseSchema: insightSchema,
    },
  }));
  return parseJson<{ insights: Insight[] }>(res.text, 'Analyst').insights;
}

// ---------------- 3 · Architect ----------------

const architectSchema = {
  type: Type.OBJECT,
  properties: {
    variants: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          profile: { type: Type.STRING, description: 'Fast MVP | Scalable | Research-grade' },
          tagline: { type: Type.STRING },
          summary: { type: Type.STRING },
          mermaid: { type: Type.STRING, description: 'flowchart TD, quoted labels, max 12 nodes' },
          components: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING },
                sourceIds: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['name', 'role', 'sourceIds'],
            },
          },
          risks: { type: Type.STRING },
          whenToChoose: { type: Type.STRING },
        },
        required: ['id', 'name', 'profile', 'tagline', 'summary', 'mermaid', 'components', 'risks', 'whenToChoose'],
      },
    },
    comparison: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          criterion: { type: Type.STRING },
          values: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'aligned with variants order' },
        },
        required: ['criterion', 'values'],
      },
    },
  },
  required: ['variants', 'comparison'],
};

export async function synthesizeArchitectures(
  topic: string,
  sources: Source[],
  insights: Insight[],
): Promise<{ variants: Variant[]; comparison: ComparisonRow[] }> {
  const brief = insights
    .map((i) => {
      const s = sources.find((x) => x.id === i.sourceId);
      return `[${i.sourceId}] ${s?.title ?? ''}\narchitecture: ${i.architecture}\nalgorithm: ${i.algorithmOrMath}\nlimitations: ${i.limitations}\nmetrics: ${i.metrics}\nrelevance: ${i.relevance}`;
    })
    .join('\n\n');
  const res = await withRetry(() => ai().models.generateContent({
    model: MODEL,
    contents: `User idea: "${topic}".\n\nSource insights:\n\n${brief}\n\nDesign the architecture variants now.`,
    config: {
      systemInstruction: ARCHITECT_SYSTEM, // architect keeps default thinking — it does the hard synthesis
      responseMimeType: 'application/json',
      responseSchema: architectSchema,
    },
  }));
  return parseJson(res.text, 'Architect');
}
````

## 8. components/Results.tsx

```tsx
import mermaid from 'mermaid';
import { useEffect, useRef, useState } from 'react';
import type { RunResult, Source, Variant } from '../types';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    background: '#0E1D33',
    primaryColor: '#12253F',
    primaryBorderColor: '#5FD4F5',
    primaryTextColor: '#DCE9F7',
    lineColor: '#5FD4F5',
    secondaryColor: '#173052',
    tertiaryColor: '#0E1D33',
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '13px',
  },
});

let diagramSeq = 0;

function MermaidDiagram({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    setFailed(false);
    (async () => {
      try {
        const { svg } = await mermaid.render(`bp-diagram-${++diagramSeq}`, code.trim());
        if (alive && ref.current) ref.current.innerHTML = svg;
      } catch {
        if (alive) setFailed(true);
      }
    })();
    return () => { alive = false; };
  }, [code]);
  if (failed) return <pre className="diagram-fallback">{code.trim()}</pre>;
  return <div className="diagram" ref={ref} aria-label="Architecture diagram" />;
}

function SourceChip({ id, sources }: { id: string; sources: Source[] }) {
  const s = sources.find((x) => x.id === id);
  if (!s) return <span className="chip">{id}</span>;
  return (
    <a className="chip" href={s.url} target="_blank" rel="noreferrer" title={s.title}>
      {id} · {s.origin}
    </a>
  );
}

function VariantSheet({ v, index, total, sources }: { v: Variant; index: number; total: number; sources: Source[] }) {
  return (
    <article className="sheet stamp-in">
      <header className="title-block" aria-label="Sheet title block">
        <div className="tb-cell tb-name">
          <span className="tb-label">variant</span>
          <h3>{v.name}</h3>
        </div>
        <div className="tb-cell">
          <span className="tb-label">profile</span>
          <span className={`badge badge-${index}`}>{v.profile}</span>
        </div>
        <div className="tb-cell">
          <span className="tb-label">sheet</span>
          <span className="tb-mono">{index + 1} / {total}</span>
        </div>
        <div className="tb-cell">
          <span className="tb-label">drawn by</span>
          <span className="tb-mono">Scout · Analyst · Architect</span>
        </div>
      </header>

      <p className="tagline">{v.tagline}</p>
      <p className="summary">{v.summary}</p>

      <MermaidDiagram code={v.mermaid} />

      <h4 className="sec-label">Components — every block cites its source</h4>
      <ul className="components">
        {v.components.map((c) => (
          <li key={c.name}>
            <div>
              <strong>{c.name}</strong> — {c.role}
            </div>
            <div className="chip-row">
              {c.sourceIds.map((id) => <SourceChip key={id} id={id} sources={sources} />)}
            </div>
          </li>
        ))}
      </ul>

      <div className="risk-grid">
        <div>
          <h4 className="sec-label">Known risks</h4>
          <p>{v.risks}</p>
        </div>
        <div>
          <h4 className="sec-label">Choose this when</h4>
          <p>{v.whenToChoose}</p>
        </div>
      </div>
    </article>
  );
}

export default function Results({ result }: { result: RunResult }) {
  const tabs = [...result.variants.map((v) => v.name), 'Compare', 'Sources'];
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [result]);

  return (
    <section className="results" aria-live="polite">
      <div className="tabbar" role="tablist" aria-label="Architecture results">
        {tabs.map((t, i) => (
          <button
            key={t}
            role="tab"
            aria-selected={active === i}
            className={active === i ? 'tab tab-on' : 'tab'}
            onClick={() => setActive(i)}
          >
            {i < result.variants.length ? `${String(i + 1).padStart(2, '0')} ${t}` : t}
          </button>
        ))}
      </div>

      {active < result.variants.length && (
        <VariantSheet
          v={result.variants[active]}
          index={active}
          total={result.variants.length}
          sources={result.sources}
        />
      )}

      {active === result.variants.length && (
        <div className="sheet stamp-in">
          <h3 className="compare-title">Trade-offs — {result.variants.length} designs side by side</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Criterion</th>
                  {result.variants.map((v) => <th scope="col" key={v.id}>{v.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {result.comparison.map((row) => (
                  <tr key={row.criterion}>
                    <th scope="row">{row.criterion}</th>
                    {row.values.map((val, i) => <td key={i}>{val}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {active === tabs.length - 1 && (
        <div className="sheet stamp-in">
          <h3 className="compare-title">Sources — everything above links back here</h3>
          <ul className="source-list">
            {result.sources.map((s) => (
              <li key={s.id}>
                <span className="chip">{s.id}</span>
                <div>
                  <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
                  <span className="src-meta">{s.origin}{s.meta ? ` · ${s.meta}` : ''}</span>
                  <p>{s.snippet.length > 220 ? s.snippet.slice(0, 220) + '…' : s.snippet}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
```

## 9. App.tsx

```tsx
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

// Run history — last 5 successful live runs, newest first, persisted in localStorage.
const HISTORY_KEY = 'bp.history';
interface HistoryEntry { topic: string; savedAt: number; result: RunResult; }

function loadHistory(): HistoryEntry[] {
  try {
    const raw = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch { return []; }
}

function pushHistory(entry: HistoryEntry): HistoryEntry[] {
  const next = [entry, ...loadHistory().filter((h) => h.topic !== entry.topic)].slice(0, 5);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch { /* quota / SSR — non-fatal */ }
  return next;
}

export default function App() {
  const [topic, setTopic] = useState('');
  const [phase, setPhase] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());
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
      const run: RunResult = { topic: t, sources, insights, variants, comparison };
      setResult(run);
      setPhase('done');
      setHistory(pushHistory({ topic: t, savedAt: Date.now(), result: run }));
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
          <span className="demo-label">Example blueprints — saved live runs:</span>
          {CACHED_RUNS.map((r) => (
            <button key={r.topic} className="chip chip-btn" onClick={() => runCached(r)} disabled={phase === 'running'}>
              ⚡ {r.topic}
            </button>
          ))}
        </div>
        {history.length > 0 && (
          <div className="chip-row history-row">
            <span className="demo-label">Your recent runs:</span>
            {history.map((h) => (
              <button key={h.savedAt} className="chip chip-btn" onClick={() => runCached(h.result)} disabled={phase === 'running'}>
                ↻ {h.topic}
              </button>
            ))}
          </div>
        )}
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
```

## 10. index.tsx

```tsx
import { createRoot } from 'react-dom/client';
import App from './App';

const root = document.getElementById('root');
if (root) createRoot(root).render(<App />);
```
