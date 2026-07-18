import type { RunResult } from './types';

// Free tier: 'gemini-3-flash-preview' (~10 RPM / 1,500 RPD).
// Once billing is enabled on the deploy project, switch to 'gemini-3.5-flash'.
export const MODEL = 'gemini-3-flash-preview';

export const SOURCE_LIMITS = { arxiv: 4, github: 3, total: 7 };

// If direct browser calls to export.arxiv.org fail with CORS on Saturday's test,
// flip this to true to route through a public CORS proxy (last resort).
export const USE_ARXIV_PROXY = false;

export const SCOUT_SYSTEM = `You are Scout, a research-search strategist. Given a product idea, produce short, high-recall search queries. arXiv queries: 2-4 technical keywords each, no quotes, no boolean operators. GitHub queries: 2-3 keywords matching how real repos are named/described. Output JSON only.`;

export const ANALYST_SYSTEM = `You are Analyst, a technical reader. For each source you receive (paper abstract or repo README excerpt), extract only what is stated or strongly implied. Be concrete and terse (1-2 sentences per field). If a field is not covered by the text, write "not stated". Never invent numbers. Output JSON only.`;

export const ARCHITECT_SYSTEM = `You are Architect, a pragmatic systems designer. Using ONLY the provided source insights, design 2-3 architecture variants for the user's idea: one "Fast MVP", one "Scalable", and optionally one "Research-grade". Every component must cite at least one sourceId that justifies it. Where sources conflict or are silent, say so in risks.

Mermaid rules (strict): output "flowchart TD" only; node ids A, B, C...; every label in double quotes; no parentheses, brackets, semicolons or the word "end" inside labels; max 12 nodes; edges may have short labels. Example: A["User"] -->|"idea"| B["Scout agent"].

Also produce a comparison table: 5-6 criteria rows (e.g. time to MVP, scaling ceiling, consistency/quality, cost per query, ops complexity, defensibility), values aligned to the variants order, each value under 8 words. Output JSON only.`;

// ---------------------------------------------------------------------------
// CACHED DEMO RUNS — pre-verified real sources. The playcast is recorded on
// these so live API limits can never break the demo. Refresh by running live
// once and pasting the JSON from the "Copy run JSON" button over these.
// ---------------------------------------------------------------------------

const CACHE_DB_AGENTS: RunResult = {
  topic: 'Distributed database built on AI agents',
  sources: [
    { id: 's1', kind: 'paper', title: 'Conflict-free Replicated Data Types: An Overview', url: 'https://arxiv.org/abs/1805.06358', origin: 'arXiv', meta: 'Preguiça · 2018', snippet: 'Surveys CRDTs: replicated data types that guarantee convergence without coordination, covering state-based and operation-based designs and their trade-offs.' },
    { id: 's2', kind: 'paper', title: 'AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation', url: 'https://arxiv.org/abs/2308.08155', origin: 'arXiv', meta: 'Wu et al. · 2023', snippet: 'Framework where multiple conversable LLM agents coordinate via structured conversations; agents mix LLM calls, tools and human input to solve tasks.' },
    { id: 's3', kind: 'paper', title: 'MemGPT: Towards LLMs as Operating Systems', url: 'https://arxiv.org/abs/2310.08560', origin: 'arXiv', meta: 'Packer et al. · 2023', snippet: 'Virtual-context management: an LLM pages information between a small working context and external storage, enabling long-horizon memory beyond the context window.' },
    { id: 's4', kind: 'repo', title: 'cockroachdb/cockroach', url: 'https://github.com/cockroachdb/cockroach', origin: 'GitHub', meta: 'Go · distributed SQL', snippet: 'Distributed SQL database: data split into ranges, each replicated with Raft consensus; serializable transactions over a replicated key-value core.' },
    { id: 's5', kind: 'repo', title: 'microsoft/autogen', url: 'https://github.com/microsoft/autogen', origin: 'GitHub', meta: 'Python · agent framework', snippet: 'Programming framework for agentic AI: role-specialized agents, group-chat orchestration, tool execution sandboxes and human-in-the-loop patterns.' },
    { id: 's6', kind: 'repo', title: 'tikv/tikv', url: 'https://github.com/tikv/tikv', origin: 'GitHub', meta: 'Rust · distributed KV', snippet: 'Distributed transactional key-value store: Raft-replicated regions, MVCC timestamps and Percolator-style transactions, designed as a storage layer for SQL engines.' },
  ],
  insights: [
    { sourceId: 's1', architecture: 'Replicas apply updates locally; CRDT merge functions guarantee convergence.', algorithmOrMath: 'Join-semilattice merge; commutative op-based updates.', limitations: 'Only eventual consistency; data types must fit CRDT semantics.', metrics: 'not stated', relevance: 'Lets agent nodes accept writes without global coordination.' },
    { sourceId: 's2', architecture: 'Conversable agents with roles coordinate via structured message passing.', algorithmOrMath: 'Conversation programming over LLM calls + tools.', limitations: 'Token cost grows with conversation length; needs guardrails.', metrics: 'Improves task success vs single-agent baselines on benchmarks.', relevance: 'Blueprint for planner/executor roles inside each DB node.' },
    { sourceId: 's3', architecture: 'Two-tier memory: in-context working set + external archival store with paging.', algorithmOrMath: 'Interrupt-driven paging policy decided by the LLM.', limitations: 'Paging adds latency; retrieval quality bounds recall.', metrics: 'Higher QA accuracy on long-document tasks vs fixed context.', relevance: 'Pattern for agent-managed hot/cold data placement.' },
    { sourceId: 's4', architecture: 'Ranges replicated via Raft; SQL layer over transactional KV.', algorithmOrMath: 'Raft consensus; hybrid logical clocks; serializable txns.', limitations: 'Consensus adds write latency; rebalancing is complex.', metrics: 'not stated', relevance: 'Proven template for the strongly-consistent tier.' },
    { sourceId: 's5', architecture: 'Group-chat orchestrator routes work among specialist agents.', algorithmOrMath: 'Speaker-selection policy; tool-call loops.', limitations: 'Non-determinism; debugging multi-agent traces is hard.', metrics: 'not stated', relevance: 'Concrete runtime for shard-planner and repair agents.' },
    { sourceId: 's6', architecture: 'Region-per-shard replication with MVCC transactions.', algorithmOrMath: 'Raft + Percolator 2PC over timestamps.', limitations: 'Cross-region txns pay coordination cost.', metrics: 'not stated', relevance: 'Storage-layer reference for the Scalable variant.' },
  ],
  variants: [
    {
      id: 'v1', name: 'Coordinator + CRDT nodes', profile: 'Fast MVP',
      tagline: 'One planner agent, conflict-free storage, zero consensus code.',
      summary: 'A single Gemini planner agent translates natural-language requests into reads/writes against per-node embedded stores. Nodes sync lazily; CRDT merge (s1) resolves conflicts, so the MVP ships without consensus or failover logic.',
      mermaid: 'flowchart TD\nA["User query"] --> B["Planner agent - Gemini"]\nB -->|"read or write plan"| C["Node 1 embedded store"]\nB --> D["Node 2 embedded store"]\nC <-->|"CRDT merge sync"| D\nB --> E["Answer with data provenance"]',
      components: [
        { name: 'Planner agent', role: 'Parses intent, emits a typed read/write plan.', sourceIds: ['s2', 's5'] },
        { name: 'CRDT store per node', role: 'Local-first writes; background merge guarantees convergence.', sourceIds: ['s1'] },
        { name: 'Provenance layer', role: 'Every answer cites the node + version it came from.', sourceIds: ['s3'] },
      ],
      risks: 'Eventual consistency only (s1); planner mistakes need a dry-run mode.',
      whenToChoose: 'Demo in hours, single-region workloads, tolerance for stale reads.',
    },
    {
      id: 'v2', name: 'Raft shards + agent control plane', profile: 'Scalable',
      tagline: 'Boring, proven storage; agents only in the control plane.',
      summary: 'Data lives in Raft-replicated shards as in CockroachDB/TiKV (s4, s6). Agents never touch the write path: a planner agent handles query routing and an operator agent handles rebalancing and repair proposals, keeping correctness in consensus code.',
      mermaid: 'flowchart TD\nA["Client"] --> B["Query planner agent"]\nB --> C["Shard 1 - Raft group"]\nB --> D["Shard 2 - Raft group"]\nB --> E["Shard 3 - Raft group"]\nF["Operator agent"] -->|"rebalance plan"| G["Placement driver"]\nG --> C\nG --> D\nG --> E',
      components: [
        { name: 'Raft shard groups', role: 'Strongly-consistent replicated storage.', sourceIds: ['s4', 's6'] },
        { name: 'Query planner agent', role: 'NL to plan; routes to shards; explains cost.', sourceIds: ['s2'] },
        { name: 'Operator agent', role: 'Watches metrics; proposes rebalance/repair, human-approved.', sourceIds: ['s5'] },
      ],
      risks: 'Consensus write latency (s4); agent proposals must be gated to avoid bad ops actions.',
      whenToChoose: 'Real multi-node deployments where correctness beats novelty.',
    },
    {
      id: 'v3', name: 'Agent-negotiated data mesh', profile: 'Research-grade',
      tagline: 'Nodes are agents that negotiate placement and remember like MemGPT.',
      summary: 'Each node is an agent owning a CRDT partition (s1) plus a MemGPT-style hot/cold memory hierarchy (s3). Nodes negotiate data placement and replication factors via AutoGen-style conversations (s2, s5) — a database that reorganizes itself.',
      mermaid: 'flowchart TD\nA["Workload stream"] --> B["Node agent 1"]\nA --> C["Node agent 2"]\nA --> D["Node agent 3"]\nB <-->|"placement negotiation"| C\nC <-->|"placement negotiation"| D\nB --> E["Hot context store"]\nB --> F["Cold archival store"]\nE <-->|"paging policy"| F',
      components: [
        { name: 'Node agents', role: 'Own partitions; negotiate placement via structured chat.', sourceIds: ['s2', 's5'] },
        { name: 'Memory hierarchy', role: 'Agent-decided paging between hot and archival tiers.', sourceIds: ['s3'] },
        { name: 'CRDT substrate', role: 'Convergence guarantee under concurrent negotiation.', sourceIds: ['s1'] },
      ],
      risks: 'Emergent behavior is hard to bound; LLM cost per operation; no strong txns.',
      whenToChoose: 'Research demos, adaptive edge/IoT data, grant-worthy novelty.',
    },
  ],
  comparison: [
    { criterion: 'Time to working MVP', values: ['Hours', 'Weeks', 'Months'] },
    { criterion: 'Consistency', values: ['Eventual - CRDT', 'Serializable - Raft', 'Eventual + negotiated'] },
    { criterion: 'Scaling ceiling', values: ['Few nodes', 'Hundreds of nodes', 'Unknown - research'] },
    { criterion: 'LLM cost per op', values: ['1 call', '~0 on hot path', 'Many calls'] },
    { criterion: 'Ops complexity', values: ['Low', 'Medium - proven tooling', 'High'] },
    { criterion: 'Defensibility', values: ['Low', 'Medium', 'High - novel'] },
  ],
};

const CACHE_CODE_REVIEW: RunResult = {
  topic: 'AI code-review copilot for monorepos',
  sources: [
    { id: 's1', kind: 'paper', title: 'CodeBERT: A Pre-Trained Model for Programming and Natural Languages', url: 'https://arxiv.org/abs/2002.08155', origin: 'arXiv', meta: 'Feng et al. · 2020', snippet: 'Bimodal pre-trained model for code and natural language supporting code search and documentation tasks.' },
    { id: 's2', kind: 'paper', title: 'Lost in the Middle: How Language Models Use Long Contexts', url: 'https://arxiv.org/abs/2307.03172', origin: 'arXiv', meta: 'Liu et al. · 2023', snippet: 'Shows LLM accuracy degrades when relevant information sits in the middle of long contexts — placement of retrieved context matters.' },
    { id: 's3', kind: 'paper', title: 'SWE-bench: Can Language Models Resolve Real-World GitHub Issues?', url: 'https://arxiv.org/abs/2310.06770', origin: 'arXiv', meta: 'Jimenez et al. · 2023', snippet: 'Benchmark of real GitHub issues + repos; evaluates model-generated patches with the project test suites.' },
    { id: 's4', kind: 'repo', title: 'qodo-ai/pr-agent', url: 'https://github.com/qodo-ai/pr-agent', origin: 'GitHub', meta: 'Python · PR review agent', snippet: 'Open-source PR agent: describes, reviews and suggests improvements on pull requests via configurable LLM commands in CI.' },
    { id: 's5', kind: 'repo', title: 'reviewdog/reviewdog', url: 'https://github.com/reviewdog/reviewdog', origin: 'GitHub', meta: 'Go · CI review comments', snippet: 'Posts linter/tool findings as inline review comments across CI providers with diff filtering.' },
    { id: 's6', kind: 'repo', title: 'danger/danger-js', url: 'https://github.com/danger/danger-js', origin: 'GitHub', meta: 'TypeScript · CI code review rules', snippet: 'Runs team-defined rules during CI and comments on PRs, codifying review conventions.' },
  ],
  insights: [
    { sourceId: 's1', architecture: 'Encoder embeddings bridge code and NL.', algorithmOrMath: 'Masked LM + replaced-token detection pretraining.', limitations: 'Encoder-only; not generative review.', metrics: 'SOTA-at-publication code search MRR.', relevance: 'Basis for semantic retrieval of related code.' },
    { sourceId: 's2', architecture: 'not stated', algorithmOrMath: 'Position-sensitivity analysis of long-context QA.', limitations: 'Middle-of-context info is often missed.', metrics: 'U-shaped accuracy curve vs position.', relevance: 'Rank and place retrieved files at context edges.' },
    { sourceId: 's3', architecture: 'Repo-level task harness with test-based scoring.', algorithmOrMath: 'Pass/fail via project test suites.', limitations: 'Long-horizon repo edits remain hard.', metrics: 'Low resolve rates for baselines at publication.', relevance: 'Ready-made eval harness for review quality.' },
    { sourceId: 's4', architecture: 'Command-based PR agent in CI with diff compression.', algorithmOrMath: 'Prompt pipelines per command.', limitations: 'Quality bounded by diff-only context.', metrics: 'not stated', relevance: 'Closest existing product; our gap is monorepo graph context.' },
    { sourceId: 's5', architecture: 'Tool-output router to inline PR comments.', algorithmOrMath: 'Diff filtering of findings.', limitations: 'No semantic understanding by itself.', metrics: 'not stated', relevance: 'Delivery rail for our findings into any CI.' },
    { sourceId: 's6', architecture: 'Rule engine over PR metadata in CI.', algorithmOrMath: 'not stated', limitations: 'Rules are hand-written.', metrics: 'not stated', relevance: 'Pattern for team-policy checks alongside LLM review.' },
  ],
  variants: [
    {
      id: 'v1', name: 'Diff-scoped Gemini reviewer', profile: 'Fast MVP',
      tagline: 'Webhook + structured findings on the diff, shipped in a day.',
      summary: 'A CI webhook sends the PR diff to Gemini with a strict findings schema; results post as inline comments via a reviewdog-style rail (s5). pr-agent (s4) proves the demand — the MVP wins on structured, deduplicated findings.',
      mermaid: 'flowchart TD\nA["PR opened"] --> B["CI webhook"]\nB --> C["Diff extractor"]\nC --> D["Gemini reviewer - JSON findings"]\nD --> E["Dedupe and severity filter"]\nE --> F["Inline PR comments"]',
      components: [
        { name: 'Diff extractor', role: 'Chunks changed hunks with minimal surrounding code.', sourceIds: ['s4'] },
        { name: 'Gemini reviewer', role: 'Structured-output findings: severity, rationale, fix.', sourceIds: ['s4'] },
        { name: 'Comment rail', role: 'Posts findings inline across CI providers.', sourceIds: ['s5', 's6'] },
      ],
      risks: 'Diff-only context misses cross-package breakage (s4).',
      whenToChoose: 'Ship this week; validate signal-to-noise with a real team.',
    },
    {
      id: 'v2', name: 'Repo-graph retrieval reviewer', profile: 'Scalable',
      tagline: 'Monorepo dependency graph + embeddings feed the right context.',
      summary: 'An incremental indexer keeps embeddings (s1) and a package dependency graph for the monorepo. For each PR, impacted modules are retrieved and placed at context edges per Lost-in-the-Middle (s2), so review quality holds as the repo grows.',
      mermaid: 'flowchart TD\nA["PR opened"] --> B["Impact analyzer - dep graph"]\nB --> C["Retriever - code embeddings"]\nC --> D["Context packer - edge placement"]\nD --> E["Gemini reviewer"]\nE --> F["Inline comments and PR summary"]\nG["Incremental indexer"] --> B\nG --> C',
      components: [
        { name: 'Incremental indexer', role: 'Embeds changed files; updates dep graph per merge.', sourceIds: ['s1'] },
        { name: 'Context packer', role: 'Orders retrieved code to dodge middle-of-context loss.', sourceIds: ['s2'] },
        { name: 'Reviewer + summarizer', role: 'Findings plus cross-package impact summary.', sourceIds: ['s4'] },
      ],
      risks: 'Index freshness and cost; retrieval misses are silent quality loss.',
      whenToChoose: 'Monorepos with heavy cross-package coupling; seed-stage product.',
    },
    {
      id: 'v3', name: 'Agentic multi-pass review bench', profile: 'Research-grade',
      tagline: 'Planner routes specialist reviewers; SWE-bench-style harness scores them.',
      summary: 'A planner agent decomposes each PR into concerns (security, API stability, perf) and routes them to specialist reviewer agents; a synthesizer merges verdicts. Quality is measured continuously on a SWE-bench-style harness (s3) built from the team repo history.',
      mermaid: 'flowchart TD\nA["PR opened"] --> B["Planner agent"]\nB --> C["Security reviewer"]\nB --> D["API stability reviewer"]\nB --> E["Perf reviewer"]\nC --> F["Synthesizer agent"]\nD --> F\nE --> F\nF --> G["Verdict and patch suggestions"]\nH["Eval harness - repo history"] --> B',
      components: [
        { name: 'Planner + specialists', role: 'Concern-routed multi-agent review passes.', sourceIds: ['s4'] },
        { name: 'Synthesizer', role: 'Merges findings; resolves conflicts between reviewers.', sourceIds: ['s4'] },
        { name: 'Eval harness', role: 'Replays historical PRs; scores against merged outcomes.', sourceIds: ['s3'] },
      ],
      risks: 'Multi-agent cost and latency; harness construction effort is high.',
      whenToChoose: 'Differentiation via measurable review quality; enterprise pilots.',
    },
  ],
  comparison: [
    { criterion: 'Time to working MVP', values: ['1-2 days', '2-4 weeks', '1-2 months'] },
    { criterion: 'Context quality', values: ['Diff only', 'Graph + retrieval', 'Concern-routed'] },
    { criterion: 'Monorepo fit', values: ['Weak', 'Strong', 'Strong'] },
    { criterion: 'Cost per PR', values: ['1 call', '2-3 calls', '5-8 calls'] },
    { criterion: 'Measurable quality', values: ['No', 'Partial', 'Yes - harness'] },
    { criterion: 'Defensibility', values: ['Low', 'Medium - index moat', 'High - eval moat'] },
  ],
};

export const CACHED_RUNS: RunResult[] = [CACHE_DB_AGENTS, CACHE_CODE_REVIEW];
