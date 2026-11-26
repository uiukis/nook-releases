import {readFile,writeFile} from 'node:fs/promises';
const source=await readFile(new URL('../app/nook-motion.js',import.meta.url),'utf8');
if(!source.includes('export const NookMotion='))throw Error('Missing shared motion export.');
await writeFile(new URL('../nook-intro/assets/nook-motion.js',import.meta.url),source.replace('export const NookMotion=','window.NookMotion='));
// Reuse editable HyperFrames vectors without an opaque video handoff layer.
const brand=await readFile(new URL('../nook-intro/compositions/brand.html',import.meta.url),'utf8');
const css=brand.match(/<style>([\s\S]*?)<\/style>/)?.[1].replace(/@font-face\{[^}]+\}/g,'').replaceAll('#root','#intro-brand').replace('.clip{','#intro-brand .clip{');
const html=brand.slice(brand.indexOf('<div id="root"'),brand.indexOf('<script>')).replace('id="root"','id="intro-brand"');
if(!css||!html.startsWith('<div'))throw Error('Missing HyperFrames brand composition.');
await writeFile(new URL('../app/intro-brand.json',import.meta.url),JSON.stringify({css,html})+'\n');
