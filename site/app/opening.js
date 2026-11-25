// HyperFrames renders the logo/jump to MP4; this joins its last frame to the live page.
export function runIntro({gsap, home, traveler, reduced, onDone}) {
  const overlay=document.querySelector('.intro-overlay');
  const video=overlay.querySelector('video');
  const skip=overlay.querySelector('.skip-intro');
  const content=document.querySelector('.site-content');
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const previousOverflow=document.body.style.overflow;
  let finished=false,disposed=false,timer=null,assembly=null;
  const targets=['.site-header','.hero-copy','.hero-nib-scene','.scroll-notch'];
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
    const scale=Math.min(innerWidth/1920,innerHeight/1080);
    const from={x:(innerWidth-1920*scale)/2+1280*scale,y:(innerHeight-1080*scale)/2+615*scale};
    context.add(()=>{
      assembly=gsap.timeline({onComplete:complete});
      assembly.set(traveler,{x:from.x,y:from.y,scale:96*scale/80,rotation:0,opacity:1,transformOrigin:'0 0'},0);
      assembly.to(video,{opacity:0,duration:.16,ease:'power1.out'},0);
      assembly.to(overlay,{opacity:0,duration:.35,ease:'power2.out'},.04);
      assembly.to('.hero-nib-scene',{opacity:1,clipPath:'inset(0% 0% 0% 0% round 29px)',duration:.7,ease:'power3.inOut'},.08);
      assembly.to('.hero-copy',{opacity:1,clipPath:'inset(0% 0% 0% 0%)',duration:.55,ease:'power3.out'},.2);
      assembly.to('.site-header',{opacity:1,y:0,duration:.4,ease:'power2.out'},.27);
      assembly.to('.scroll-notch',{opacity:1,duration:.3},.4);
      assembly.to(traveler,{motionPath:{path:[from,{x:from.x+35,y:from.y-70},{x:target.left-35,y:target.top-50},{x:target.left,y:target.top}],curviness:1.05},scale:target.width/80,duration:.9,ease:'power2.inOut'},.02);
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
      gsap.set('.site-header',{opacity:0,y:-14});
      gsap.set('.hero-copy',{opacity:0,clipPath:'inset(0% 100% 0% 0%)'});
      gsap.set('.hero-nib-scene',{opacity:0,clipPath:'inset(74% 10% 0% 70% round 29px)'});
      gsap.set('.scroll-notch',{opacity:0});gsap.set(home,{opacity:0});
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
