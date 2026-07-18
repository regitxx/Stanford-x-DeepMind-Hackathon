# Blueprint — idea → cited architecture in a minute

Type a product idea. Three agents do the research sprint for you:
**Scout** queries arXiv + GitHub · **Analyst** extracts what actually works (Gemini structured output) · **Architect** drafts 2–3 variants — Mermaid diagrams, per-component citations, trade-off table.

Built for the Stanford x DeepMind "Build with Google Gemini" hackathon (GDG Stanford, Jul 19 2026). Google AI Studio track: Gemini + Cloud Run.

## Run locally
```
npm i
GEMINI_API_KEY=your_key npm run dev     # http://localhost:5173
npm run typecheck && npm run smoke      # sanity checks
```
In Google AI Studio no key setup is needed — `process.env.API_KEY` is injected (server-side after deploy).

## Files
- `App.tsx` — UI shell, pipeline orchestration, agent console, cached-demo playback, Copy-run-JSON
- `components/Results.tsx` — variant sheets (title-block design), Mermaid render + fallback, compare, sources
- `services/gemini.ts` — Scout/Analyst/Architect calls, strict responseSchema
- `services/sources.ts` — arXiv Atom parser, GitHub search + README enrichment, CORS fallback flag
- `constants.ts` — model + prompts + cached demo runs (the demo insurance)
- `RUNBOOK.md` — deploy steps, Sunday timeline for 2 people, contingencies
- `AISTUDIO_PROMPT.md` — bootstrap prompt to recreate the skeleton in Build mode

## Why judges should care
Answers are built only from verifiable sources — every block links out. Not one answer but a compared set: Fast MVP / Scalable / Research-grade, like a panel of architects.
