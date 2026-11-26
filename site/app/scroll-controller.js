import {gsap} from 'gsap';
import {MotionPathPlugin} from 'gsap/dist/MotionPathPlugin';
import {NookMotion} from './nook-motion';
import {runIntro} from './opening';
import {installProductMotion,installInteractionMotion,bindDialogMotion} from './product-motion';
export function mountStory(){
const cleanup=[];
const listen=(target,event,handler,options)=>{target.addEventListener(event,handler,options);cleanup.push(()=>target.removeEventListener(event,handler,options));};
const features=JSON.parse(document.querySelector('#feature-data').textContent);
const byId=new Map(features.map((feature,index)=>[feature.id,{...feature,index}]));
const frame=document.querySelector('.demo-frame');
const shell=document.querySelector('.scroll-notch');
const surface=document.querySelector('.notch-surface');
const arrival=document.querySelector('.notch-arrival');
const outline=document.querySelector('.notch-outline');
const closedFace=document.querySelector('.closed-face');
const resident=document.querySelector('.notch-resident');
const home=document.querySelector('.nib-home');
const traveler=document.querySelector('.nib-traveler');
const homeScene=document.querySelector('.hero-nib-scene');
const chapters=[...document.querySelectorAll('[data-chapter]')];
const links=[...document.querySelectorAll('[data-chapter-link]')];
const media=matchMedia('(prefers-reduced-motion: reduce)');
const forcedReduced=new URLSearchParams(location.search).has('reduce-motion');
const targetOrigin=location.protocol==='file:'?'*':location.origin;
const animated=true;
if(animated)gsap.registerPlugin(MotionPathPlugin);
let reveal=null,flight=null,opening=null,swap=null,navMotion=null,moodMotion=null,presenceMotion=null,productMotion=null,swapEpoch=0,flightEpoch=0;
let active=null,currentScreen='music',docked=false,flightTarget=null,manualClosed=false;
const hoverMotions=[];
let raf=0,openHeight=320,disposed=false,introActive=true,shown=false;
let travelMotion=null,placed=null,overlayOverflow=null;
const reduced=()=>forcedReduced||media.matches||!animated;
const rect=element=>{const box=element.getBoundingClientRect();return {left:box.left,top:box.top,width:box.width,height:box.height}};
const send=(command,screen)=>frame.contentWindow?.postMessage({type:'nook-demo-command',command,screen},targetOrigin);
function setOpacity(element,value){if(animated)gsap.set(element,{opacity:value});else element.style.opacity=String(value)}
function hideHome(value){setOpacity(home,value?0:1);home.disabled=value;home.setAttribute('aria-hidden',String(value));document.querySelector('.home-speech').style.opacity=value?'0':''}
function setPresence(show,instant=false){
 if(shown===show&&!instant)return;
 const wasHidden=shell.dataset.presence==='hidden';shown=show;presenceMotion?.kill();
 shell.inert=!show;shell.setAttribute('aria-hidden',String(!show));shell.dataset.presence=show?'entering':'leaving';
 if(show&&wasHidden)gsap.set(arrival,{y:-42,opacity:0});
 presenceMotion=NookMotion.arrival(gsap,arrival,show);
 presenceMotion.eventCallback('onComplete',()=>shell.dataset.presence=show?'visible':'hidden');
 if(instant||reduced())presenceMotion.progress(1);else presenceMotion.play(0);
}
function setOpen(value,instant=false){
 const open=Boolean(value&&!manualClosed);
 const unchanged=(shell.dataset.mode==='open')===open;
 shell.dataset.mode=open?'open':'closed';closedFace.setAttribute('aria-expanded',String(open));closedFace.inert=open;
 frame.inert=!open;frame.setAttribute('aria-hidden',String(!open));resident.tabIndex=open?0:-1;
 productMotion?.setVisible(open&&shown);
 document.querySelectorAll('.notch-tools button').forEach(button=>button.tabIndex=open?0:-1);
 setOpacity(resident,open&&docked?1:0);
 if(unchanged&&shell.dataset.animating==='false'&&!instant)return;
 reveal?.kill();reveal=NookMotion.surface(gsap,{path:outline,frame,face:closedFace,width:shell.getBoundingClientRect().width,height:openHeight},open);
 shell.dataset.animating='true';reveal.eventCallback('onComplete',()=>shell.dataset.animating='false');
 if(instant||reduced())reveal.progress(1);else reveal.play(0);
}
function overlayGeometry(){
 const box=shell.getBoundingClientRect();
 shell.style.setProperty('--overlay-left',-box.left+'px');shell.style.setProperty('--overlay-top',-box.top+'px');
 shell.style.setProperty('--overlay-width',document.documentElement.clientWidth+'px');shell.style.setProperty('--overlay-height',innerHeight+'px');
}
function placeNotch(id,instant=false){
 const dock=document.querySelector(`[data-dock="${id}"]`);if(!dock)return;
 const box=dock.getBoundingClientRect(),width=shell.getBoundingClientRect().width;
 const to={x:box.left+(box.width-width)/2+scrollX,y:box.top+scrollY+Number(getComputedStyle(dock).getPropertyValue('--dock-offset'))};
 travelMotion?.kill();shell.dataset.moving='true';shell.dataset.at=id;
 travelMotion=NookMotion.travel(gsap,shell,to);
 travelMotion.eventCallback('onUpdate',overlayGeometry).eventCallback('onComplete',()=>{shell.dataset.moving='false';overlayGeometry();});
 if(instant||!placed||reduced())travelMotion.progress(1);else travelMotion.play(0);
 placed=id;
}
function layout(){
 const dock=document.querySelector(`[data-dock="${placed||'music'}"]`);
 if(dock)shell.style.width=Math.min(740,dock.getBoundingClientRect().width-40)+'px';
 const width=shell.getBoundingClientRect().width;
 shell.style.setProperty('--native-fit',String(Math.min(1,width/740)));
 overlayGeometry();
 openHeight=320*Math.min(1,width/740);
 shell.style.setProperty('--open-height',openHeight+'px');document.body.style.setProperty('--notch-clearance',openHeight+'px');
 document.body.style.setProperty('--demo-height',openHeight+'px');
 const wasOpen=shell.dataset.mode==='open';
 if(!outline.getAttribute('d'))outline.setAttribute('d',NookMotion.outline(width,Math.min(width,360),36,12,6));
 setOpen(wasOpen,true);if(placed)placeNotch(placed,true);schedule();
}
function finishDock(){
 flightEpoch++;flight?.kill();flight=null;opening?.kill();opening=null;flightTarget=null;docked=true;
 shell.dataset.docked='true';document.body.dataset.nibLocation='notch';document.body.classList.remove('flight-active');
 setOpacity(traveler,0);hideHome(true);setOpacity(resident,shell.dataset.mode==='open'?1:0);
}
function flyToNotch(){
 if(docked||flightTarget==='notch')return;
 const start=flightTarget?rect(traveler):rect(home);const destination=rect(resident.firstElementChild);destination.top-=Number(gsap.getProperty(arrival,'y'))||0;
 setPresence(true);
 const sequence=++flightEpoch;flight?.kill();opening?.kill();flightTarget='notch';
 hideHome(true);setOpacity(resident,0);document.body.dataset.nibLocation='travel';document.body.classList.add('flight-active');
 if(reduced()||start.top+start.height<0||start.top>innerHeight){finishDock();setOpen(Boolean(active),true);return;}
 flight=NookMotion.flight(gsap,traveler,start,destination,{exitX:Math.max(20,rect(homeScene).left-82),duration:1.05});
 opening=gsap.delayedCall(.2,()=>{if(sequence===flightEpoch)setOpen(Boolean(active));});
 flight.eventCallback('onComplete',()=>{if(sequence!==flightEpoch)return;finishDock();setOpen(Boolean(active),true);});flight.play(0);
}
function returnHome(){
 if((!docked&&!flightTarget)||flightTarget==='home'){setPresence(false);return;}
 const source=flightTarget?rect(traveler):shell.dataset.mode==='open'?rect(resident.firstElementChild):rect(document.querySelector('.closed-nib'));
 const destination=rect(home);const sequence=++flightEpoch;flight?.kill();opening?.kill();flightTarget='home';
 setPresence(false);
 docked=false;shell.dataset.docked='false';setOpacity(resident,0);setOpen(false);document.body.dataset.nibLocation='travel';
 const finish=()=>{if(sequence!==flightEpoch)return;flight=null;flightTarget=null;setOpacity(traveler,0);hideHome(false);document.body.dataset.nibLocation='home';document.body.classList.remove('flight-active');};
 if(reduced()||destination.top+destination.height<0||destination.top>innerHeight){finish();return;}
 flight=NookMotion.flight(gsap,traveler,source,destination,{returning:true,duration:1.05});flight.eventCallback('onComplete',finish);flight.play(0);
}
function showScreen(id){
 swapEpoch++;swap?.kill();swap=null;currentScreen=id;send('screen',id);
 const f=byId.get(id);document.querySelector('.notch-context').textContent=f.label;document.querySelector('.notch-count').textContent=`${f.index+1} / ${features.length}`;
 document.querySelector('.closed-context').textContent=f.label;
 if(docked||flightTarget==='notch')setOpen(true);
}
function activate(id){
 if(active===id)return;
 const hadActive=Boolean(active);
 active=id;manualClosed=false;document.body.dataset.activeChapter=id||'';
 document.body.classList.toggle('in-chapters',Boolean(id));
 if(hadActive!==Boolean(id)){navMotion?.kill();navMotion=NookMotion.fade(gsap,document.querySelector('.chapter-nav'),hadActive?1:0,id?1:0);if(reduced())navMotion.progress(1);else navMotion.play(0);}
 links.forEach(link=>{if(link.dataset.chapterLink===id)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current')});
 if(!id){swapEpoch++;swap?.kill();setOpen(false);return;}
 const feature=byId.get(id);const next=features[Math.min(features.length-1,feature.index+1)];
 placeNotch(id,!shown);
 const nextLink=document.querySelector('.mobile-chapter-next');nextLink.href=feature.index===features.length-1?'#nib':'#chapter-'+next.id;
 nextLink.setAttribute('aria-label',feature.index===features.length-1?'Conhecer o Nib':'Próximo recurso: '+next.label);
 document.querySelector('.mobile-chapter-label').textContent=feature.label;document.querySelector('.mobile-chapter-count').textContent=`${feature.index+1} / ${features.length}`;
 showScreen(id);flyToNotch();
}
function readScroll(){
 raf=0;if(disposed||introActive)return;
 if(shell.dataset.overlay==='true')return;
 const line=innerHeight*.65;
 const boxes=chapters.map(chapter=>({chapter,box:chapter.getBoundingClientRect()}));
 if(boxes[0].box.top>innerHeight*.66){activate(null);returnHome();return;}
 if(boxes[boxes.length-1].box.bottom<line){activate(null);returnHome();return;}
 const match=boxes.reduce((closest,item)=>{const dock=item.chapter.querySelector('.chapter-dock').getBoundingClientRect();const distance=Math.abs(dock.top+dock.height/2-innerHeight/2);return !closest||distance<closest.distance?{...item,distance}:closest;},null);
 activate(match.chapter.dataset.chapter);
}
function schedule(){if(!raf&&!disposed)raf=requestAnimationFrame(readScroll)}
listen(window,'scroll',schedule,{passive:true});listen(window,'resize',layout,{passive:true});
listen(media,'change',()=>{if(reduced()){if(flightTarget==='notch')finishDock();else if(flightTarget==='home'){flightEpoch++;flight?.kill();flightTarget=null;setOpacity(traveler,0);hideHome(false);document.body.dataset.nibLocation='home';}setOpen(Boolean(active),true)}});
const collapse=()=>{manualClosed=true;setOpen(false);};
const connectProduct=()=>{productMotion?.();if(frame.contentDocument?.querySelector('#appContent')){productMotion=installProductMotion({gsap,doc:frame.contentDocument,reduced,onCollapse:collapse});productMotion.setVisible(shown&&shell.dataset.mode==='open');}send('screen',active||currentScreen);send('state');};
listen(frame,'load',connectProduct);if(frame.contentDocument?.readyState==='complete'&&frame.contentDocument.querySelector('#appContent'))connectProduct();
listen(home,'click',()=>document.querySelector('#chapter-music').scrollIntoView({behavior:reduced()?'instant':'smooth'}));
listen(closedFace,'click',()=>{if(!active){document.querySelector('#chapter-music').scrollIntoView({behavior:reduced()?'instant':'smooth'});return;}manualClosed=false;setOpen(true);});
listen(closedFace,'pointerenter',()=>{if(shown&&docked){manualClosed=false;setOpen(true);}});
listen(shell,'pointerleave',()=>{if(!active)setOpen(false);});
listen(window,'keydown',event=>{if(event.key==='Escape'&&shown&&shell.dataset.mode==='open'&&!document.querySelector('dialog[open]'))collapse();});
document.querySelectorAll('[data-command]').forEach(button=>listen(button,'click',()=>{const command=button.dataset.command;if(command==='toggle'){manualClosed=shell.dataset.mode==='open';setOpen(!manualClosed);return;}send(command)}));
document.querySelectorAll('.scenario-buttons').forEach(group=>listen(group,'click',event=>{const button=event.target.closest('[data-scenario]');if(!button)return;const id=button.dataset.for;activate(id);swapEpoch++;swap?.kill();currentScreen=id;send('screen',id);send('scenario',button.dataset.scenario);group.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));setOpen(true);}));
listen(window,'message',event=>{
 if(event.origin!==location.origin||event.source!==frame.contentWindow||event.data?.type!=='nook-demo-state')return;
 const data=event.data;if(byId.has(data.screen)){currentScreen=data.screen;const feature=byId.get(data.screen);document.querySelector('.notch-context').textContent=feature.label;document.querySelector('.notch-count').textContent=`${feature.index+1} / ${features.length}`;document.querySelectorAll(`#chapter-${data.screen} [data-scenario]`).forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.scenario===data.scenario)));}
 const overlay=Boolean(data.settings||data.nibOpen);overlayGeometry();shell.dataset.overlay=String(overlay);document.querySelector('.notch-tools').inert=overlay;resident.inert=overlay;
 if(overlay&&overlayOverflow===null){overlayOverflow=document.body.style.overflow;document.body.style.overflow='hidden';}
 else if(!overlay&&overlayOverflow!==null){document.body.style.overflow=overlayOverflow;overlayOverflow=null;schedule();}
 const settings=document.querySelector('[data-command=settings]');settings.setAttribute('aria-expanded',String(Boolean(data.settings)));settings.setAttribute('aria-label',data.settings?'Fechar configurações':'Abrir configurações');
});
const download=document.querySelector('#download-dialog');
const stopInteractions=installInteractionMotion({gsap,doc:document,reduced});
const stopDownloadMotion=bindDialogMotion({gsap,dialog:download,reduced});
document.querySelectorAll('[data-download]').forEach(button=>listen(button,'click',()=>download.showModal()));
listen(document.querySelector('.close-dialog'),'click',()=>download.close());
listen(download,'click',event=>{if(event.target!==download)return;const box=download.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)download.close();});
const originalNib=document.querySelector('.big-nib').innerHTML;
const messages={idle:'Pode deixar comigo.',working:'Tô cuidando disso.',waiting:'Preciso de você aqui.',done:'Prontinho!',sleeping:'Um respiro também faz bem.'};
document.querySelectorAll('[data-mood]').forEach(button=>listen(button,'click',()=>{
 const mood=button.dataset.mood;const character=document.querySelector('.big-nib');character.dataset.mood=mood;character.innerHTML=originalNib;
 const svg=character.querySelector('svg'),eyes=svg.querySelector('g');
 if(mood==='done'||mood==='sleeping'){eyes.replaceChildren();const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',mood==='done'?'M3.75 6.5q.75-1.2 1.5 0m2.5 0q.75-1.2 1.5 0':'M3.8 6.4h1.4m2.6 0h1.4');path.setAttribute('fill','none');path.setAttribute('stroke','#272130');path.setAttribute('stroke-width','.45');path.setAttribute('stroke-linecap','round');eyes.append(path);}
 if(mood==='waiting'){const mouth=document.createElementNS('http://www.w3.org/2000/svg','ellipse');[['cx','6.5'],['cy','8'],['rx','.45'],['ry','.55'],['fill','#272130']].forEach(([key,value])=>mouth.setAttribute(key,value));svg.lastElementChild.replaceWith(mouth);}
 document.querySelector('.nib-bubble').textContent=messages[mood];document.querySelectorAll('[data-mood]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
 moodMotion?.kill();moodMotion=NookMotion.mood(gsap,character,mood);if(reduced())moodMotion.progress(1);else moodMotion.play(0);
}));
document.querySelectorAll('.button').forEach(button=>{
 const motion=NookMotion.hover(gsap,button);hoverMotions.push(motion);
 const enter=()=>{if(!reduced())motion.play();};const leave=()=>reduced()?motion.progress(0).pause():motion.reverse();
 listen(button,'pointerenter',enter);listen(button,'pointerleave',leave);listen(button,'focus',enter);listen(button,'blur',leave);
});
listen(media,'change',()=>{if(reduced()){hoverMotions.forEach(motion=>motion.progress(0).pause());moodMotion?.progress(1).pause();navMotion?.progress(1).pause();}});
document.body.dataset.nibLocation='home';layout();
document.fonts.ready.then(()=>{if(!disposed)layout();});
const stopIntro=runIntro({gsap,home,traveler,reduced,onDone:()=>{introActive=false;schedule();}});
return ()=>{stopIntro();if(overlayOverflow!==null)document.body.style.overflow=overlayOverflow;travelMotion?.kill();productMotion?.();stopInteractions();stopDownloadMotion();disposed=true;cleanup.forEach(fn=>fn());if(raf)cancelAnimationFrame(raf);flight?.kill();opening?.kill();swap?.kill();presenceMotion?.kill();navMotion?.kill();moodMotion?.kill();hoverMotions.forEach(motion=>motion.revert());reveal?.kill();gsap.killTweensOf([home,resident,traveler]);gsap.set('.chapter-nav',{clearProps:'opacity'});gsap.set('.big-nib',{clearProps:'transform'});document.body.classList.remove('in-chapters','flight-active');};
}
