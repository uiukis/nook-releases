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
 export const NookMotion={flight,reveal};
