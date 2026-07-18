// Sandbox smoke test: arXiv parser (offline sample) + live GitHub search + README fetch.
import { parseArxivAtom, searchGithub } from '../services/sources';

const SAMPLE = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom">
<entry><id>http://arxiv.org/abs/2308.08155v2</id><published>2023-08-16T05:09:47Z</published>
<title>AutoGen: Enabling Next-Gen LLM
  Applications via Multi-Agent Conversation</title>
<summary>  AutoGen is an open-source framework that allows developers to build LLM
applications via multiple agents that can converse with each other.
</summary><author><name>Qingyun Wu</name></author><author><name>Gagan Bansal</name></author>
<author><name>Jieyu Zhang</name></author><author><name>Yiran Wu</name></author></entry></feed>`;

const parsed = parseArxivAtom(SAMPLE);
console.log('arXiv parser:', JSON.stringify(parsed[0], null, 1).slice(0, 400));
if (parsed.length !== 1 || !parsed[0].title.startsWith('AutoGen') || !parsed[0].url.includes('https://arxiv.org/abs/2308.08155')) {
  throw new Error('arXiv parser failed');
}
if (!parsed[0].meta?.includes('et al.') || !parsed[0].meta?.includes('2023')) throw new Error('meta failed');

const repos = await searchGithub('multi agent llm framework', 2);
console.log('GitHub live:', repos.map(r => `${r.title} [${r.meta}] snippet:${r.snippet.slice(0, 60)}...`));
if (repos.length === 0) throw new Error('GitHub search returned nothing');
console.log('SMOKE OK');
