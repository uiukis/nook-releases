import {NookMotion} from './nook-motion';

export function installTextMotion({gsap,reduced}) {
 const items=[],motions=new Set();let disposed=false;
 const hero=document.querySelector('.hero-copy h1');
 document.querySelectorAll('main h1,main h2').forEach(heading=>{
  const words=[...heading.querySelectorAll('.motion-word')];
  if(!words.length)return;gsap.set(words,{opacity:reduced()?1:0,y:reduced()?0:14});items.push({heading,words,done:reduced()});
 });
 const reveal=item=>{
  if(!item||item.done||disposed)return;item.done=true;item.heading.classList.add('text-animating');
  const motion=NookMotion.text(gsap,item.words);motions.add(motion);
  motion.eventCallback('onComplete',()=>{item.heading.classList.remove('text-animating');motions.delete(motion);});
  if(reduced())motion.progress(1);else motion.play(0);
 };
 const observer=new IntersectionObserver(entries=>{if(document.body.dataset.intro!=='done')return;entries.forEach(entry=>{if(entry.isIntersecting){reveal(items.find(item=>item.heading===entry.target));observer.unobserve(entry.target);}});},{threshold:.18,rootMargin:'0px 0px -6% 0px'});
 items.filter(item=>item.heading!==hero).forEach(item=>observer.observe(item.heading));
 const refresh=()=>items.filter(item=>item.heading!==hero).forEach(item=>{const b=item.heading.getBoundingClientRect();if(reduced()||(b.top<innerHeight*.94&&b.bottom>0))reveal(item);});
 const showHero=()=>{const item=items.find(item=>item.heading===hero);if(item){item.done=true;gsap.set(item.words,{opacity:1,y:0});}};
 const dispose=()=>{disposed=true;observer.disconnect();motions.forEach(motion=>motion.kill());items.forEach(({heading,words})=>{heading.classList.remove('text-animating');gsap.set(words,{clearProps:'opacity,transform'});});};
 return {heroWords:items.find(item=>item.heading===hero)?.words,showHero,refresh,dispose};
}
