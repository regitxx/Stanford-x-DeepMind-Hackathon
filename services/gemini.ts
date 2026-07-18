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

// ---------------- 1 · Scout ----------------

export async function scoutQueries(topic: string): Promise<{ arxivQueries: string[]; githubQueries: string[] }> {
  const res = await ai().models.generateContent({
    model: MODEL,
    contents: `Product idea: "${topic}". Produce search queries.`,
    config: {
      systemInstruction: SCOUT_SYSTEM,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          arxivQueries: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2 arXiv keyword queries' },
          githubQueries: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2 GitHub keyword queries' },
        },
        required: ['arxivQueries', 'githubQueries'],
      },
    },
  });
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
  const res = await ai().models.generateContent({
    model: MODEL,
    contents: `User idea: "${topic}".\n\nExtract insights for EVERY source below (one entry per sourceId).\n\n${corpus}`,
    config: {
      systemInstruction: ANALYST_SYSTEM,
      responseMimeType: 'application/json',
      responseSchema: insightSchema,
    },
  });
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
  const res = await ai().models.generateContent({
    model: MODEL,
    contents: `User idea: "${topic}".\n\nSource insights:\n\n${brief}\n\nDesign the architecture variants now.`,
    config: {
      systemInstruction: ARCHITECT_SYSTEM,
      responseMimeType: 'application/json',
      responseSchema: architectSchema,
    },
  });
  return parseJson(res.text, 'Architect');
}
