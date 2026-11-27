import {NookMotion} from './nook-motion';
// Live vectors share the exact brand timeline with the editable HyperFrames film.
export function runIntro({gsap,home,traveler,reduced,onDone,textMotion}) {
  const overlay=document.querySelector('.intro-overlay'),canvas=overlay.querySelector('.intro-canvas');
  // Fast Refresh can remount this controller after the previous handoff faded
  // these elements. A new opening must start from the CSS state again.
  gsap.set([overlay,canvas],{clearProps:'opacity'});
  const skip=overlay.querySelector('.skip-intro'),content=document.querySelector('.site-content');
  const media=matchMedia('(prefers-reduced-motion: reduce)'),previousOverflow=document.body.style.overflow;
  let finished=false,disposed=false,timer=null,assembly=null,brand=null,homeTarget=null;
  const started=performance.now();
  const elements={header:'.site-header',copy:'.hero-copy',stage:'.hero-nib-scene',home,traveler,video:canvas,overlay,words:textMotion?.heroWords};
  const context=gsap.context(()=>{});
  const viewportScale=()=>Math.min(innerWidth/(innerWidth<=760?900:1920),innerHeight/1080);
  const release=()=>{content.inert=false;document.body.style.overflow=previousOverflow;};
  function complete(){
    if(disposed)return;
    clearTimeout(timer);document.body.dataset.intro='done';document.body.dataset.introElapsedMs=String(Math.round(performance.now()-started));gsap.set(home,{opacity:1});gsap.set(traveler,{opacity:0});textMotion?.showHero();textMotion?.refresh();
    home.disabled=false;home.setAttribute('aria-hidden','false');overlay.hidden=true;release();onDone();
  }
  function finish(animate=true){
    if(finished||disposed)return;finished=true;brand?.pause();
    if(!animate||reduced()){context.revert();complete();return;}
    document.body.dataset.intro='assembling';
    const target=homeTarget||home.getBoundingClientRect(),{width,height,landing}=NookMotion.intro;
    const scale=viewportScale();
    const from={x:(innerWidth-width*scale)/2+landing.x*scale,y:(innerHeight-height*scale)/2+landing.y*scale};
    assembly=NookMotion.assemble(gsap,elements,{from,target,scale});
    assembly.timeScale(.9).eventCallback('onComplete',complete).play(0);
  }
  const skipIntro=()=>{assembly?.kill();finish(false);if(document.body.dataset.intro==='assembling'){gsap.set(['.site-header','.hero-copy','.hero-nib-scene'],{clearProps:'opacity,transform,clipPath'});complete();}};
  const key=event=>{if(event.key==='Escape'&&document.body.dataset.intro!=='done'){event.preventDefault();skipIntro();}};
  const preference=()=>{if(media.matches)skipIntro();};
  const resize=()=>{if(document.body.dataset.intro!=='done')skipIntro();};
  skip.addEventListener('click',skipIntro);window.addEventListener('keydown',key);window.addEventListener('resize',resize);media.addEventListener('change',preference);
  const bypass=reduced()||navigator.connection?.saveData||(location.hash&&location.hash!=='#top')||scrollY>32;
  if(bypass)finish(false);
  else{
    overlay.hidden=false;content.inert=true;document.body.style.overflow='hidden';
    document.body.dataset.intro='preparing';overlay.dataset.introState='preparing';
    canvas.style.setProperty('--intro-scale',viewportScale());
    context.add(()=>{NookMotion.prepareAssembly(gsap,elements);brand=NookMotion.brandIntro(gsap);brand.call(()=>finish(true),null,NookMotion.intro.duration);});
    timer=setTimeout(skipIntro,5200);
    document.fonts.ready.then(()=>{if(!disposed&&!finished){gsap.set('.hero-nib-scene',{y:0,scale:1});homeTarget=home.getBoundingClientRect();gsap.set('.hero-nib-scene',{y:18,scale:.98});document.body.dataset.intro='playing';overlay.dataset.introState='playing';brand.timeScale(.72).play(0);}});
  }
  return ()=>{
    disposed=true;clearTimeout(timer);assembly?.kill();brand?.kill();context.revert();
    gsap.set([overlay,canvas],{clearProps:'opacity'});
    gsap.set(['.site-header','.hero-copy','.hero-nib-scene'],{clearProps:'opacity,transform,clipPath'});
    skip.removeEventListener('click',skipIntro);window.removeEventListener('keydown',key);window.removeEventListener('resize',resize);media.removeEventListener('change',preference);
    gsap.set(traveler,{opacity:0});overlay.hidden=true;release();
  };
}
