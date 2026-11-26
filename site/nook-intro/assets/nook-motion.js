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

 function prepareAssembly(gsap,{header,copy,stage,home}){
  gsap.set(header,{opacity:0,y:-14});gsap.set(copy,{opacity:0,y:14});
  gsap.set(stage,{opacity:0,y:18,scale:.98});gsap.set(home,{opacity:0});
 }
 function assemble(gsap,els,{from,target,scale}){
  const tl=gsap.timeline({paused:true});
  tl.set(els.traveler,{x:from.x,y:from.y,scale:96*scale/80,rotation:0,opacity:1,transformOrigin:'0 0'},0);
  if(els.video)tl.to(els.video,{opacity:0,duration:.16,ease:'power1.out'},0);
  if(els.overlay)tl.to(els.overlay,{opacity:0,duration:.35,ease:'power2.out'},.04);
  tl.to(els.stage,{opacity:1,y:0,scale:1,duration:.48,ease:'power3.out'},.08);
  tl.to(els.copy,{opacity:1,y:0,duration:.45,ease:'power3.out'},.16);
  tl.to(els.header,{opacity:1,y:0,duration:.4,ease:'power2.out'},.27);
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
 function bezier(x1,y1,x2,y2){
  const value=(t,a,b)=>3*(1-t)*(1-t)*t*a+3*(1-t)*t*t*b+t*t*t;
  return progress=>{let t=progress;for(let i=0;i<7;i++){const d=3*(1-t)*(1-t)*x1+6*(1-t)*t*(x2-x1)+3*t*t*(1-x2);if(Math.abs(d)<.00001)break;t=Math.max(0,Math.min(1,t-(value(t,x1,x2)-progress)/d));}return value(t,y1,y2);};
 }
 function spring(response=.38,damping=.82){
  const omega=2*Math.PI/response,beta=Math.sqrt(1-damping*damping);
  const sample=t=>1-Math.exp(-damping*omega*t)*(Math.cos(omega*beta*t)+damping/beta*Math.sin(omega*beta*t));
  const end=sample(response);return p=>p===1?1:sample(p*response)/end;
 }
 const native={open:.32,close:.24,tab:.38,travel:18,blur:6,closedWidth:360,closedHeight:36,openEase:bezier(.22,.8,.22,1),closeEase:bezier(.4,0,.3,1),tabEase:spring(),pressEase:spring(.3,.6)};
 function outline(canvasWidth,boxWidth,height,radius,flare=0){
  const x=(canvasWidth-boxWidth)/2,f=Math.min(flare,boxWidth/4,height/2),r=Math.min(radius,height/2,(boxWidth-2*f)/2),l=x+f,right=x+boxWidth-f;
  return `M${x},0 L${x+boxWidth},0 Q${right},0 ${right},${f} L${right},${height-r} Q${right},${height} ${right-r},${height} L${l+r},${height} Q${l},${height} ${l},${height-r} L${l},${f} Q${l},0 ${x},0 Z`;
 }
 function surface(gsap,{path,frame,face,width,height},open){
  const tl=gsap.timeline({paused:true}),duration=open?native.open:native.close;
  const d=open?outline(width,width,height,29*Math.min(1,width/740)):outline(width,Math.min(width,native.closedWidth),native.closedHeight,12,6);
  tl.to(path,{attr:{d},duration,ease:open?native.openEase:native.closeEase},0);
  tl.to(frame,{opacity:open?1:0,duration:open?.18:.12,ease:'power1.out'},open?.1:0);
  tl.to(face,{opacity:open?0:1,duration:open?.12:.13,ease:'power1.out'},open?0:.08);
  return tl;
 }
 function arrival(gsap,target,show){
  return gsap.timeline({paused:true}).to(target,{y:show?0:-42,opacity:show?1:0,duration:show?.32:.24,ease:show?native.openEase:native.closeEase});
 }
 function tab(gsap,outgoing,incoming,direction=1,kind='tab'){
  const tl=gsap.timeline({paused:true}),distance=kind==='tab'?native.travel:6,blur=kind==='tab'?native.blur:3,duration=kind==='tab'?native.tab:.24;
  if(outgoing)tl.to(outgoing,{x:-direction*distance,opacity:0,filter:`blur(${blur}px)`,duration:Math.min(duration,.2),ease:'power2.out'},0);
  tl.fromTo(incoming,{x:direction*distance,opacity:0,filter:`blur(${blur}px)`},{x:0,opacity:1,filter:'blur(0px)',duration,ease:kind==='tab'?native.tabEase:'power2.out',immediateRender:false},0);
  return tl;
 }
 const panel=(gsap,target,open)=>gsap.timeline({paused:true}).to(target,{opacity:open?1:0,y:open?0:8,scale:open?1:.97,filter:open?'blur(0px)':'blur(3px)',duration:open?.28:.18,ease:open?native.tabEase:native.closeEase});
 const press=(gsap,target,down)=>gsap.timeline({paused:true}).to(target,{scale:down?.9:1,duration:down?.08:.3,ease:down?'power2.out':native.pressEase});
 const select=(gsap,target,from,to)=>gsap.timeline({paused:true}).fromTo(target,{x:from},{x:to,duration:.25,ease:native.tabEase});
 const fill=(gsap,target)=>gsap.timeline({paused:true}).fromTo(target,{scaleX:.15,transformOrigin:'0 50%'},{scaleX:1,duration:.38,ease:'power2.out'});
 const spin=(gsap,target)=>gsap.timeline({paused:true}).fromTo(target,{rotation:0},{rotation:360,duration:1.7,ease:'none'});
 const toggle=(gsap,target,from,to)=>gsap.timeline({paused:true}).fromTo(target,{'--nook-switch':`${from}px`},{'--nook-switch':`${to}px`,duration:.25,ease:native.tabEase});
 const travel=(gsap,target,to)=>gsap.timeline({paused:true}).to(target,{x:to.x,y:to.y,duration:.55,ease:'power3.inOut'});
 window.NookMotion={flight,reveal,intro,brandIntro,prepareAssembly,assemble,fold,fade,hover,mood,native,outline,surface,arrival,tab,panel,press,select,fill,spin,toggle,travel};
