import {NookMotion} from './nook-motion';

// Scroll is the single clock. Every hop can be sought in either direction,
// including after a fast scroll, without queued callbacks or stale view coordinates.
export function createNibJourney({gsap,root,home,traveler,reduced,onScreen,onVisibility}) {
 const frame=root.querySelector('iframe'),path=root.querySelector('.notch-outline'),arrival=root.querySelector('.notch-arrival');
 const face=root.querySelector('.closed-face'),resident=root.querySelector('.notch-resident'),closedNib=root.querySelector('.closed-nib');
 const cargo=traveler.querySelector('.nib-cargo');
 const landAt=.64,openAt=.82;
 const companion=document.querySelector('.big-nib'),companionHome=document.querySelector('.companion-home');
 const docks=new Map([...document.querySelectorAll('[data-dock]')].map(node=>[node.dataset.dock,node]));
 let occupied=null,route=null,routeKey=null,signature=null,surfaceSeek=null,interaction=null,manualClosed=null,width=740,height=320,fit=1,flying=false,place='home',disposed=false;
 const box=node=>{const b=node.getBoundingClientRect();return {left:b.left+scrollX,top:b.top+scrollY,width:b.width,height:b.height};};
 const opacity=(node,value)=>gsap.set(node,{opacity:value});
 const model=()=>({path,frame,face,width,height});
 function geometry(id){const d=box(docks.get(id));return {left:d.left+(d.width-width)/2,top:d.top+Number(getComputedStyle(docks.get(id)).getPropertyValue('--dock-offset'))};}
 function landing(id,open=false){
  if(id==='home')return box(home);if(id==='companion')return box(companionHome);
  const p=geometry(id),compact=Math.min(width,360);
  return open?{left:p.left+width-Math.max(66,74*fit)-14*fit,top:p.top+7.5*fit,width:28*fit}:{left:p.left+(width-compact)/2+compact-39,top:p.top+5.5,width:25};
 }
 function actors(){
  const open=root.dataset.mode==='open',preview=root.dataset.phase==='preview';opacity(home,place==='home'&&!flying?1:0);home.disabled=place!=='home'||flying;home.setAttribute('aria-hidden',String(home.disabled));
  document.querySelector('.home-speech').style.opacity=place==='home'&&!flying?'':'0';
  opacity(resident,place==='notch'&&!flying&&open?1:0);opacity(closedNib,place==='notch'&&(!flying||preview)&&!open?1:0);
  opacity(companion,place==='companion'&&!flying?1:0);opacity(traveler,flying&&!preview?1:0);
  const location=flying&&!preview?'travel':place,changed=document.body.dataset.nibLocation!==location;
  document.body.dataset.nibLocation=location;document.body.classList.toggle('flight-active',flying);root.dataset.docked=String(place==='notch'&&(!flying||preview));
  if(changed)document.dispatchEvent(new CustomEvent('nook-nib-location',{detail:location}));
 }
 function mode(open){root.dataset.mode=open?'open':'closed';face.inert=open;face.setAttribute('aria-expanded',String(open));frame.inert=!open;frame.setAttribute('aria-hidden',String(!open));resident.tabIndex=open?0:-1;root.querySelectorAll('.notch-tools button').forEach(button=>button.tabIndex=open?0:-1);}
 function hidden(){root.dataset.presence='hidden';root.inert=true;root.setAttribute('aria-hidden','true');onVisibility(false);docks.forEach(node=>{node.dataset.live='false';node.querySelector('.dock-notch').inert=false;});}
 function overlayGeometry(){const b=root.getBoundingClientRect();root.style.setProperty('--overlay-left',-b.left+'px');root.style.setProperty('--overlay-top',-b.top+'px');root.style.setProperty('--overlay-width',document.documentElement.clientWidth+'px');root.style.setProperty('--overlay-height',innerHeight+'px');}
 function surfaceAt(id,progress){
  if(occupied!==id||!surfaceSeek){
   surfaceSeek?.kill();occupied=id;const p=geometry(id);gsap.set(root,{x:p.left,y:p.top});root.dataset.at=id;root.dataset.moving='false';
   docks.forEach((node,key)=>{node.dataset.live=String(key===id);node.querySelector('.dock-notch').inert=key===id;});
   NookMotion.surface(gsap,model(),false).progress(1);surfaceSeek=NookMotion.surface(gsap,model(),true);onScreen(id);
  }else docks.get(id).dataset.live='true';
  root.dataset.presence='visible';gsap.set(arrival,{opacity:1,y:0});surfaceSeek.progress(progress,true);mode(progress>0);
  const inTransit=flying&&root.dataset.phase!=='preview';
  root.inert=inTransit;root.setAttribute('aria-hidden',String(inTransit));onVisibility(progress===1&&!flying);overlayGeometry();
 }
 function endpoint(id){
  flying=false;opacity(cargo,0);root.dataset.phase='idle';root.dataset.animating='false';
  if(id==='home'||id==='companion'){place=id;hidden();}
  else{place='notch';if(manualClosed&&manualClosed!==id)manualClosed=null;surfaceAt(id,manualClosed===id?0:1);}
  actors();
 }
 function seek(from,to,progress,heading){
  if(disposed)return;let p=Math.max(0,Math.min(1,progress));if(reduced())p=p<.5?0:1;
  const key=from+':'+to+(heading?':heading':''),next=key+':'+p;
  if(signature===next)return;signature=next;
  if(routeKey!==key){
   route?.kill();routeKey=key;
   const land=landing(to),end=landing(to,true);
   let start=landing(from,manualClosed!==from),over,hops;
   if(heading){
    const title=box(heading),words=[...heading.querySelectorAll('.motion-word')].map(box);
    const right=land.left>title.left+title.width/2,firstLine=words.filter(word=>Math.abs(word.top-words[0].top)<8);
    if(!right)firstLine.reverse();
    // Land on up to three words of the first line, resting on top of the letters.
    const picks=firstLine.length>3?[firstLine[0],firstLine[Math.floor(firstLine.length/2)],firstLine.at(-1)]:firstLine;
    hops=picks.map(word=>({left:word.left+word.width/2-24,top:word.top-40,width:48}));
    const first=hops[0]||{left:title.left,top:title.top-40};
    start={left:Math.max(8,Math.min(innerWidth-56,first.left+(right?-110:110))),top:first.top-30,width:24};
   }
   route=NookMotion.handoff(gsap,traveler,start,land,end,to==='companion'?undefined:{landAt,openAt,over,hops});
   if(to==='files'){
    route.set(cargo,{x:68,y:42,rotation:18,scale:.85,opacity:0},0)
      .to(cargo,{x:1,y:4,rotation:-12,scale:1,opacity:1,duration:.24,ease:'power2.out'},.16)
      .to(cargo,{x:-12,y:54,rotation:5,scale:.25,opacity:0,duration:.12,ease:'power2.in'},landAt-.12);
   }else opacity(cargo,0);
  }
  if(p===0||p===1){route.progress(p,true);endpoint(p===0?from:to);return;}
  interaction?.kill();interaction=null;flying=true;place='notch';root.dataset.animating='true';
  if(p<.18&&from!=='home'&&!heading){root.dataset.phase='closing';surfaceAt(from,manualClosed===from?0:1-p/.18);}
  else if(p>=landAt&&to!=='companion'){
   const opening=p>openAt;
   root.dataset.phase=opening?'opening':'preview';
   surfaceAt(to,opening?(p-openAt)/(1-openAt):0);
  }
  else{root.dataset.phase='jumping';hidden();surfaceSeek?.kill();surfaceSeek=null;}
  route.progress(p,true);actors();
 }
 function measure(){
  width=Math.min(740,docks.values().next().value.getBoundingClientRect().width-40);fit=Math.min(1,width/740);height=320*fit;
  root.style.width=width+'px';root.style.setProperty('--native-fit',fit);root.style.setProperty('--open-height',height+'px');document.body.style.setProperty('--demo-height',height+'px');
  docks.forEach(node=>{const w=Math.min(360,node.getBoundingClientRect().width-40),svg=node.querySelector('.dock-outline');svg.setAttribute('viewBox',`0 0 ${w} 36`);svg.querySelector('path').setAttribute('d',NookMotion.outline(w,w,36,12,6));});
  route?.kill();route=null;routeKey=null;signature=null;surfaceSeek?.kill();surfaceSeek=null;interaction?.kill();interaction=null;overlayGeometry();
 }
 function stops(){
  const chapters=[...docks.keys()].map(id=>({id,y:geometry(id).top-innerHeight*.34}));
  // Let visitors operate the hero demo while it is still on screen.
  const departure=Math.max(0,Math.min(box(home).top-innerHeight*.18,chapters[0].y-1));
  return [{id:'home',y:departure},...chapters,{id:'companion',y:box(companionHome).top-innerHeight*.38}];
 }
 function go(id){signature=null;manualClosed=null;interaction?.kill();endpoint(id);}
 function park(){if(place==='companion')return;go('companion');}
 function open(){if(flying&&root.dataset.phase==='preview'){flying=false;root.dataset.phase='idle';}if(!occupied||flying)return;manualClosed=null;routeKey=null;signature=null;surfaceSeek?.kill();surfaceSeek=null;interaction?.kill();mode(true);root.inert=false;root.dataset.animating='true';interaction=NookMotion.surface(gsap,model(),true).eventCallback('onComplete',()=>{root.dataset.animating='false';actors();});if(reduced())interaction.progress(1);else interaction.play(0);actors();}
 function close(){if(!occupied||flying)return;manualClosed=occupied;routeKey=null;signature=null;surfaceSeek?.kill();surfaceSeek=null;interaction?.kill();mode(false);root.dataset.animating='true';interaction=NookMotion.surface(gsap,model(),false).eventCallback('onComplete',()=>root.dataset.animating='false');if(reduced())interaction.progress(1);else interaction.play(0);actors();}
 function resize(){measure();}
 function dispose(){disposed=true;route?.kill();surfaceSeek?.kill();interaction?.kill();hidden();gsap.set([traveler,resident,closedNib,companion],{opacity:0});gsap.set(home,{opacity:1});}
 measure();return {seek,stops,go,home:()=>endpoint('home'),park,open,close,resize,overlayGeometry,dispose};
}
