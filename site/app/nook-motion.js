/* Nook shared motion. Adapted from HyperFrames registry arc-motion-path,
   using a paused GSAP timeline that the website and HyperFrames can both seek. */


 function flight(gsap,actor,from,to,options={}){
  const returning=options.returning===true;
  const exitX=options.exitX??Math.max(16,from.left-180);
  const path=returning?[
   {x:from.left,y:from.top},
   {x:Math.max(16,from.left-105),y:from.top+58},
   {x:Math.max(16,to.left-120),y:to.top-18},
   {x:to.left,y:to.top}
  ]:[
   {x:from.left,y:from.top},
   {x:exitX,y:from.top-18},
   {x:Math.max(16,to.left-92),y:to.top+28},
   {x:to.left,y:to.top}
  ];
  const tl=gsap.timeline({paused:true});
  tl.fromTo(actor,{x:from.left,y:from.top,scale:from.width/80,rotation:0,opacity:1,transformOrigin:'0 0'},
   {motionPath:{path,curviness:1.15,autoRotate:false},scale:to.width/80,duration:options.duration??1.05,ease:'power2.inOut',immediateRender:false},0);
  tl.fromTo(actor,{rotation:0},{rotation:returning?12:-12,duration:.22,ease:'power1.inOut',immediateRender:false},0);
  tl.to(actor,{rotation:0,duration:.3,ease:'power2.out'},.7);
  return tl;
 }
 function reveal(gsap,surface,face,width,height){
  const side=Math.max(0,(width-142)/2);
  const closed=`inset(0px ${side}px ${Math.max(0,height-42)}px ${side}px round 0px 0px 18px 18px)`;
  const open='inset(0px 0px 0px 0px round 0px 0px 28px 28px)';
  const tl=gsap.timeline({paused:true});
  tl.fromTo(surface,{clipPath:closed},{clipPath:open,duration:.54,ease:'power3.inOut',immediateRender:true},0);
  tl.fromTo(face,{opacity:1},{opacity:0,duration:.16,ease:'power1.out',immediateRender:true},.08);
  return tl;
 }
 const intro={width:1920,height:1080,duration:1.6,landing:{x:1000,y:374,size:96}};

 function brandIntro(gsap){
  const tl=gsap.timeline({paused:true});
  tl.fromTo('#brand-logo',{opacity:0,scale:.82,rotation:-7},{opacity:1,scale:1,rotation:0,duration:.2,ease:'power3.out'},0);
  tl.fromTo('#brand-logo',{x:0},{x:-196,duration:.3,ease:'power3.inOut',immediateRender:false},.14);
  tl.fromTo('#brand-tile',{opacity:1},{opacity:0,duration:.2,ease:'power2.inOut',immediateRender:true},.18);
  tl.fromTo('#brand-name-mask',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.22,ease:'power3.out',immediateRender:true},.22);
  tl.fromTo('#brand-name',{x:-90},{x:0,duration:.22,ease:'power3.out',immediateRender:true},.22);
  tl.set('#brand-inset-nib',{opacity:0},.12);
  tl.fromTo('#brand-nib',{x:963.7,y:544.97,scale:.402,opacity:0,transformOrigin:'0 0'},{opacity:1,duration:.001,immediateRender:true},.12);
  tl.fromTo('#brand-nib',{x:963.7,y:544.97,scale:.402},{motionPath:{path:[{x:963.7,y:544.97},{x:1000,y:340},{x:840,y:270},{x:738,y:381}],curviness:1.05},scale:1,duration:.38,ease:'power1.inOut',immediateRender:false},.12);
  const land=(at,letter)=>{
   tl.fromTo('#brand-nib-body',{scaleX:1,scaleY:1,rotation:0},{scaleX:1.1,scaleY:.84,duration:.05,ease:'power2.out',immediateRender:false},at);
   tl.to('#brand-nib-body',{scaleX:1,scaleY:1,duration:.08,ease:'power2.out'},at+.05);
   tl.fromTo(letter,{scaleY:1},{scaleY:.94,transformOrigin:'50% 0%',duration:.05,ease:'power2.out',immediateRender:false},at);
   tl.to(letter,{scaleY:1,duration:.08,ease:'power2.out'},at+.05);
  };
  land(.5,'#brand-logo');
  tl.fromTo('#brand-wave-hand',{x:0,y:0},{x:.5,y:-2.5,duration:.07,ease:'power2.out',immediateRender:true},.56);
  tl.to('#brand-wave-hand',{x:.9,y:-2.2,duration:.06,ease:'power1.inOut'},.63);
  tl.to('#brand-wave-hand',{x:.1,y:-2.8,duration:.07,ease:'power1.inOut'},.69);
  tl.to('#brand-wave-hand',{x:.8,y:-2.3,duration:.06,ease:'power1.inOut'},.76);
  tl.to('#brand-wave-hand',{x:0,y:0,duration:.08,ease:'power2.inOut'},.82);
  tl.fromTo('#brand-nib-body',{scaleX:1,scaleY:1},{scaleX:1.08,scaleY:.88,duration:.06,ease:'power2.in',immediateRender:false},.9);
  tl.to('#brand-nib-body',{scaleX:1,scaleY:1,rotation:-5,duration:.1,ease:'power2.out'},.96);
  tl.fromTo('#brand-nib',{x:738,y:381,scale:1},{motionPath:{path:[{x:738,y:381},{x:865,y:235},{x:intro.landing.x,y:intro.landing.y}],curviness:1.1},duration:.31,ease:'power1.inOut',immediateRender:false},.96);
  tl.to('#brand-nib-body',{rotation:0,duration:.08,ease:'power2.out'},1.19);
  land(1.27,'#brand-k');
  return tl;
 }

 function prepareAssembly(gsap,{header,copy,stage,notch,home}){
  gsap.set(header,{opacity:0,y:-14});gsap.set(copy,{opacity:0,clipPath:'inset(0% 100% 0% 0%)'});
  gsap.set(stage,{opacity:0,clipPath:'inset(74% 10% 0% 70% round 29px)'});gsap.set(notch,{opacity:0});gsap.set(home,{opacity:0});
 }
 function assemble(gsap,els,{from,target,scale}){
  const tl=gsap.timeline({paused:true});
  tl.set(els.traveler,{x:from.x,y:from.y,scale:96*scale/80,rotation:0,opacity:1,transformOrigin:'0 0'},0);
  if(els.video)tl.to(els.video,{opacity:0,duration:.16,ease:'power1.out'},0);
  if(els.overlay)tl.to(els.overlay,{opacity:0,duration:.35,ease:'power2.out'},.04);
  tl.to(els.stage,{opacity:1,clipPath:'inset(0% 0% 0% 0% round 29px)',duration:.7,ease:'power3.inOut'},.08);
  tl.to(els.copy,{opacity:1,clipPath:'inset(0% 0% 0% 0%)',duration:.55,ease:'power3.out'},.2);
  tl.to(els.header,{opacity:1,y:0,duration:.4,ease:'power2.out'},.27);
  tl.to(els.notch,{opacity:1,duration:.3},.4);
  tl.to(els.traveler,{motionPath:{path:[from,{x:from.x+35,y:from.y-70},{x:target.left-35,y:target.top-50},{x:target.left,y:target.top}],curviness:1.05},scale:target.width/80,duration:.9,ease:'power2.inOut'},.02);
  return tl;
 }
 const fold=(gsap,timeline)=>gsap.timeline({paused:true}).to(timeline,{progress:0,duration:.18,ease:'power2.in'});
 const fade=(gsap,target,from,to,duration=.2)=>gsap.timeline({paused:true}).fromTo(target,{opacity:from},{opacity:to,duration,ease:'power2.out'});
 const hover=(gsap,target)=>gsap.timeline({paused:true}).fromTo(target,{y:0},{y:-2,duration:.18,ease:'power2.out'});
 function mood(gsap,target,name){
  const tl=gsap.timeline({paused:true});
  tl.to(target,{scaleX:1.06,scaleY:.92,duration:.09,ease:'power2.in'});
  tl.to(target,{scaleX:1,scaleY:1,rotation:name==='working'?-7:name==='done'?7:0,y:name==='done'?-10:0,duration:.22,ease:'power2.out'});
  return tl;
 }
 export const NookMotion={flight,reveal,intro,brandIntro,prepareAssembly,assemble,fold,fade,hover,mood};
