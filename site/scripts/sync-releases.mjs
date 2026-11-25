import { readFile, writeFile } from 'node:fs/promises';
import { selectDownloads } from './release-data.mjs';

const file = new URL('../data/releases.json', import.meta.url);
const previous = JSON.parse(await readFile(file, 'utf8'));
const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'Nook-site-release-sync' };
if (process.env.GH_TOKEN) headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;
const response = await fetch('https://api.github.com/repos/uiukis/nook-releases/releases?per_page=30', { headers, signal: AbortSignal.timeout(15000) });
if (!response.ok) throw new Error(`Release metadata request failed: HTTP ${response.status}`);
const next = selectDownloads(await response.json(), previous);
await writeFile(file, JSON.stringify(next, null, 2) + '\n');
console.log(`Downloads synchronized: Windows ${next.windows.version}; macOS ${next.macos.version}; ${next.tag}`);
