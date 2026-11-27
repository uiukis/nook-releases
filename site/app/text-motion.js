import {NookMotion} from './nook-motion';

export function installTextMotion({gsap,reduced}) {
 const items=[],motions=new Set(),scrubbed=[];let disposed=false,frame=0;
 const ease=gsap.parseEase('power3.out'),clamp=value=>Math.max(0,Math.min(1,value));
 function draw(force=false){
  frame=0;if(disposed)return;
  const reach=Math.min(150,innerWidth*.22),spread=.7;
  for(const item of scrubbed){
   const {letters,heading,side}=item,box=heading.getBoundingClientRect();
   const p=reduced()?1:clamp((innerHeight*.98-box.top)/(innerHeight*.46));
   if(!force&&Math.abs(p-item.p)<.002)continue;
   item.p=p;
   letters.forEach((letter,i)=>{
    const shown=ease(clamp(p*(1+spread)-i/letters.length*spread));
    letter.style.transform=shown===1?'':`translate3d(${(side*reach*(1-shown)).toFixed(1)}px,0,0)`;
    letter.style.opacity=shown===1?'':shown.toFixed(3);
   });
  }
 }
 const schedule=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(()=>draw());};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});
 const hero=document.querySelector('.hero-copy h1');
 document.querySelectorAll('main h1,main h2').forEach(heading=>{
  const words=[...heading.querySelectorAll('.motion-word')];
  if(!words.length)return;
  const chapter=heading.closest('[data-chapter]');
  const letters=[...heading.querySelectorAll('.motion-letter')];
  if(chapter&&letters.length){
   // Scroll is the clock: the glyphs slide in from the side as the title rises.
   scrubbed.push({heading,letters,side:chapter.matches(':nth-child(even)')?1:-1,p:-1});
   return;
  }
  const side=chapter?(chapter.matches(':nth-child(even)')?30:-30):0;
  gsap.set(words,{opacity:reduced()?1:0,x:reduced()?0:side,y:reduced()||side?0:14});
  items.push({heading,words,side,done:reduced()});
 });
 const reveal=item=>{
  if(!item||item.done||disposed)return;item.done=true;item.heading.classList.add('text-animating');
  const motion=NookMotion.text(gsap,item.words,item.side);motions.add(motion);
  motion.eventCallback('onComplete',()=>{item.heading.classList.remove('text-animating');motions.delete(motion);});
  if(reduced())motion.progress(1);else motion.play(0);
 };
 const observer=new IntersectionObserver(entries=>{if(document.body.dataset.intro!=='done')return;entries.forEach(entry=>{if(entry.isIntersecting){reveal(items.find(item=>item.heading===entry.target));observer.unobserve(entry.target);}});},{threshold:.18,rootMargin:'0px 0px -6% 0px'});
 items.filter(item=>item.heading!==hero).forEach(item=>observer.observe(item.heading));
 const refresh=()=>items.filter(item=>item.heading!==hero).forEach(item=>{const b=item.heading.getBoundingClientRect();if(reduced()||(b.top<innerHeight*.94&&b.bottom>0))reveal(item);});
 const showHero=()=>{const item=items.find(item=>item.heading===hero);if(item){item.done=true;gsap.set(item.words,{opacity:1,y:0});}};
 draw(true);
 const dispose=()=>{disposed=true;cancelAnimationFrame(frame);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);scrubbed.forEach(({letters})=>letters.forEach(letter=>{letter.style.removeProperty('transform');letter.style.removeProperty('opacity');}));observer.disconnect();motions.forEach(motion=>motion.kill());items.forEach(({heading,words})=>{heading.classList.remove('text-animating');gsap.set(words,{clearProps:'opacity,transform'});});};
 return {heroWords:items.find(item=>item.heading===hero)?.words,showHero,refresh,dispose};
}
