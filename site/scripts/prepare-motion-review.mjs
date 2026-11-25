import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
const source=new URL('../nook-intro/',import.meta.url),dest=new URL('../../.local/nook-motion-review/',import.meta.url);
await mkdir(dest,{recursive:true});
for(const name of ['assets','compositions'])await cp(new URL(name,source),new URL(name,dest),{recursive:true});
await writeFile(new URL('index.html',dest),await readFile(new URL('templates/motion-lab.html',source)));
await writeFile(new URL('meta.json',dest),JSON.stringify({id:'nook-motion-review',name:'Nook — movimentos do site'}));
await writeFile(new URL('hyperframes.json',dest),await readFile(new URL('hyperframes.json',source)));
console.log('Prepared shared timelines for HyperFrames in .local/nook-motion-review.');
