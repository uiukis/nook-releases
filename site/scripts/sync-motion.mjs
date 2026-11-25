import {readFile,writeFile} from 'node:fs/promises';
const source=await readFile(new URL('../app/nook-motion.js',import.meta.url),'utf8');
if(!source.includes('export const NookMotion='))throw Error('Missing shared motion export.');
await writeFile(new URL('../nook-intro/assets/nook-motion.js',import.meta.url),source.replace('export const NookMotion=','window.NookMotion='));
