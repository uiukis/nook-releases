import {NookMotion} from './nook-motion';
// The same seekable timelines are authored and reviewed in HyperFrames.
export function runIntro({gsap, home, traveler, reduced, onDone}) {
  const overlay=document.querySelector('.intro-overlay');
  const video=overlay.querySelector('video');
  const skip=overlay.querySelector('.skip-intro');
  const content=document.querySelector('.site-content');
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const previousOverflow=document.body.style.overflow;
  let finished=false,disposed=false,timer=null,assembly=null;
  const elements={header:'.site-header',copy:'.hero-copy',stage:'.hero-nib-scene',notch:'.scroll-notch',home,traveler,video,overlay};
  const context=gsap.context(()=>{});

  const release=()=>{content.inert=false;document.body.style.overflow=previousOverflow;};
  function complete(){
    if(disposed)return;
    document.body.dataset.intro='done';
    gsap.set(home,{opacity:1});gsap.set(traveler,{opacity:0});
    home.disabled=false;home.setAttribute('aria-hidden','false');
    overlay.hidden=true;release();onDone();
  }
  function finish(animate=true){
    if(finished||disposed)return;finished=true;clearTimeout(timer);
    video.pause();
    if(!animate||reduced()){
      context.revert();complete();return;
    }
    document.body.dataset.intro='assembling';
    const target=home.getBoundingClientRect();
    // Intrinsic coordinates are shared with nook-intro/compositions/brand.html.
    const {width,height,landing}=NookMotion.intro;
    const scale=Math.min(innerWidth/width,innerHeight/height);
    const from={x:(innerWidth-width*scale)/2+landing.x*scale,y:(innerHeight-height*scale)/2+landing.y*scale};
    context.add(()=>{
      assembly=NookMotion.assemble(gsap,elements,{from,target,scale});assembly.timeScale(1.3).eventCallback('onComplete',complete).play(0);
    });
  }
  const skipIntro=()=>finish(false);
  const ended=()=>finish(true);
  const key=event=>{if(!finished&&event.key==='Escape'){event.preventDefault();skipIntro();}};
  const preference=()=>{if(media.matches)skipIntro();};
  const resize=()=>{if(!finished)skipIntro();else if(document.body.dataset.intro==='assembling'){assembly?.kill();context.revert();complete();}};
  skip.addEventListener('click',skipIntro);
  video.addEventListener('ended',ended);video.addEventListener('error',skipIntro);
  window.addEventListener('keydown',key);window.addEventListener('resize',resize);
  media.addEventListener('change',preference);
  const bypass=reduced()||navigator.connection?.saveData||(location.hash&&location.hash!=='#top')||scrollY>32;
  if(bypass){finish(false);}
  else{
    overlay.hidden=false;content.inert=true;document.body.style.overflow='hidden';
    document.body.dataset.intro='playing';overlay.dataset.introState='playing';
    context.add(()=>{
      NookMotion.prepareAssembly(gsap,elements);
    });
    video.src=video.dataset.src;video.load();
    timer=setTimeout(skipIntro,7000);
    video.play()?.catch(skipIntro);
  }
  return ()=>{
    disposed=true;clearTimeout(timer);assembly?.kill();context.revert();video.pause();
    video.removeAttribute('src');video.load();
    skip.removeEventListener('click',skipIntro);video.removeEventListener('ended',ended);video.removeEventListener('error',skipIntro);
    window.removeEventListener('keydown',key);window.removeEventListener('resize',resize);media.removeEventListener('change',preference);
    gsap.set(traveler,{opacity:0});overlay.hidden=true;release();
  };
}
