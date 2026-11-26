import {gsap} from 'gsap';
import {MotionPathPlugin} from 'gsap/dist/MotionPathPlugin';
import {NookMotion} from './nook-motion';
import {runIntro} from './opening';
import {createNibJourney} from './nib-journey';
import {installTextMotion} from './text-motion';
import {installProductMotion,installInteractionMotion,bindDialogMotion} from './product-motion';
export function mountStory(){
 const cleanup=[];
 const listen=(target,event,handler,options)=>{target.addEventListener(event,handler,options);cleanup.push(()=>target.removeEventListener(event,handler,options));};
 const features=JSON.parse(document.querySelector('#feature-data').textContent);
 const byId=new Map(features.map((feature,index)=>[feature.id,{...feature,index}]));
 const frame=document.querySelector('.demo-frame'),shell=document.querySelector('.scroll-notch');
 const home=document.querySelector('.nib-home'),traveler=document.querySelector('.nib-traveler');
 const chapters=[...document.querySelectorAll('[data-chapter]')],links=[...document.querySelectorAll('[data-chapter-link]')];
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 const forcedReduced=new URLSearchParams(location.search).has('reduce-motion');
 const reduced=()=>forcedReduced||media.matches;
 const targetOrigin=location.origin;
 const send=(command,screen)=>frame.contentWindow?.postMessage({type:'nook-demo-command',command,screen},targetOrigin);
 gsap.registerPlugin(MotionPathPlugin);
 let active=null,currentScreen='music',productMotion=null,overlayOverflow=null,introActive=true,disposed=false,raf=0,navMotion=null,moodMotion=null;
 const hoverMotions=[],scenarios=new Map();
 const showScreen=id=>{
  currentScreen=id;const f=byId.get(id);
  document.querySelector('.notch-context').textContent=f.label;document.querySelector('.notch-count').textContent=`${f.index+1} / ${features.length}`;
  document.querySelector('.closed-context').textContent=f.label;send('screen',id);
  if(scenarios.has(id))send('scenario',scenarios.get(id));
 };
 const journey=createNibJourney({gsap,root:shell,home,traveler,reduced,onScreen:showScreen,onVisibility:visible=>productMotion?.setVisible(visible)});
 const textMotion=installTextMotion({gsap,reduced});
 function activate(id){
  if(active===id)return;
  const hadActive=Boolean(active);active=id;document.body.dataset.activeChapter=id||'';
  document.body.classList.toggle('in-chapters',Boolean(id));
  if(hadActive!==Boolean(id)){navMotion?.kill();navMotion=NookMotion.fade(gsap,document.querySelector('.chapter-nav'),hadActive?1:0,id?1:0);if(reduced())navMotion.progress(1);else navMotion.play(0);}
  links.forEach(link=>{if(link.dataset.chapterLink===id)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});
  if(!id)return;

 }
 function readScroll(){
  raf=0;if(disposed||introActive||shell.dataset.overlay==='true')return;
  const stops=journey.stops(),position=scrollY;
  let index=stops.findIndex((stop,i)=>i>0&&position<=stop.y);if(index<0)index=stops.length-1;
  const from=stops[index-1],to=stops[index],raw=(position-from.y)/Math.max(1,to.y-from.y);
  const progress=Math.max(0,Math.min(1,(raw-.16)/.68));
  journey.seek(from.id,to.id,progress);
  const shown=progress<.5?from.id:to.id;activate(byId.has(shown)?shown:null);
 }
 function schedule(){if(!raf&&!disposed)raf=requestAnimationFrame(readScroll);}
 listen(window,'scroll',schedule,{passive:true});
 listen(window,'resize',()=>{journey.resize();schedule();},{passive:true});
 listen(media,'change',()=>{journey.resize();textMotion.refresh();if(reduced())textMotion.showHero();schedule();});
 const connectProduct=()=>{
  productMotion?.();productMotion=null;
  const doc=frame.contentDocument;
  if(doc?.body&&doc.querySelector('#appContent')&&doc.querySelector('#appTabs')){
   productMotion=installProductMotion({gsap,doc,reduced,onCollapse:()=>journey.close()});
   productMotion.setVisible(shell.dataset.presence==='visible'&&shell.dataset.mode==='open');
  }
  showScreen(active||currentScreen);send('state');
 };
 listen(frame,'load',connectProduct);
 if(frame.contentDocument?.readyState==='complete'&&frame.contentDocument.querySelector('#appContent'))connectProduct();
 listen(home,'click',()=>document.querySelector('#chapter-music').scrollIntoView({behavior:reduced()?'instant':'smooth'}));
 document.querySelectorAll('[data-activate]').forEach(button=>listen(button,'click',()=>{document.querySelector('#chapter-'+button.dataset.activate).scrollIntoView({behavior:reduced()?'instant':'smooth'});if(active===button.dataset.activate)journey.open();}));
 const face=shell.querySelector('.closed-face');
 listen(face,'click',()=>journey.open());
 listen(face,'pointerenter',()=>{if(active&&shell.dataset.phase==='idle')journey.open();});
 listen(window,'keydown',event=>{if(event.key==='Escape'&&shell.dataset.mode==='open'&&!document.querySelector('dialog[open]'))journey.close();});
 document.querySelectorAll('[data-command]').forEach(button=>listen(button,'click',()=>{const command=button.dataset.command;if(command==='toggle'){journey.close();return;}send(command);}));
 document.querySelectorAll('.scenario-buttons').forEach(group=>listen(group,'click',event=>{const button=event.target.closest('[data-scenario]');if(!button)return;const id=button.dataset.for;scenarios.set(id,button.dataset.scenario);activate(id);journey.go(id);showScreen(id);group.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));}));
 listen(window,'message',event=>{
  if(event.origin!==location.origin||event.source!==frame.contentWindow||event.data?.type!=='nook-demo-state')return;
  const data=event.data;
  if(byId.has(data.screen)){
   currentScreen=data.screen;const feature=byId.get(data.screen);
   document.querySelector('.notch-context').textContent=feature.label;document.querySelector('.notch-count').textContent=`${feature.index+1} / ${features.length}`;
   document.querySelectorAll(`#chapter-${data.screen} [data-scenario]`).forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.scenario===data.scenario)));
  }
  const overlay=Boolean(data.settings||data.nibOpen);journey.overlayGeometry();shell.dataset.overlay=String(overlay);
  shell.querySelector('.notch-tools').inert=overlay;shell.querySelector('.notch-resident').inert=overlay;
  if(overlay&&overlayOverflow===null){overlayOverflow=document.body.style.overflow;document.body.style.overflow='hidden';}
  else if(!overlay&&overlayOverflow!==null){document.body.style.overflow=overlayOverflow;overlayOverflow=null;schedule();}
  const settings=shell.querySelector('[data-command=settings]');settings.setAttribute('aria-expanded',String(Boolean(data.settings)));settings.setAttribute('aria-label',data.settings?'Fechar configurações':'Abrir configurações');
 });
const download=document.querySelector('#download-dialog');
const stopInteractions=installInteractionMotion({gsap,doc:document,reduced});
const stopDownloadMotion=bindDialogMotion({gsap,dialog:download,reduced});
document.querySelectorAll('[data-download]').forEach(button=>listen(button,'click',()=>download.showModal()));
listen(document.querySelector('.close-dialog'),'click',()=>download.close());
listen(download,'click',event=>{if(event.target!==download)return;const box=download.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)download.close();});
const originalNib=document.querySelector('.big-nib').innerHTML;
const messages={idle:'Pode deixar comigo.',working:'Tô cuidando disso.',waiting:'Preciso de você aqui.',done:'Prontinho!',sleeping:'Um respiro também faz bem.'};
const playMood=button=>{
 const mood=button.dataset.mood;const character=document.querySelector('.big-nib');character.dataset.mood=mood;character.innerHTML=originalNib;
 const svg=character.querySelector('svg'),eyes=svg.querySelector('g');
 if(mood==='done'||mood==='sleeping'){eyes.replaceChildren();const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',mood==='done'?'M3.75 6.5q.75-1.2 1.5 0m2.5 0q.75-1.2 1.5 0':'M3.8 6.4h1.4m2.6 0h1.4');path.setAttribute('fill','none');path.setAttribute('stroke','#272130');path.setAttribute('stroke-width','.45');path.setAttribute('stroke-linecap','round');eyes.append(path);}
 if(mood==='waiting'){const mouth=document.createElementNS('http://www.w3.org/2000/svg','ellipse');[['cx','6.5'],['cy','8'],['rx','.45'],['ry','.55'],['fill','#272130']].forEach(([key,value])=>mouth.setAttribute(key,value));svg.lastElementChild.replaceWith(mouth);}
 document.querySelector('.nib-bubble').textContent=messages[mood];document.querySelectorAll('[data-mood]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
 moodMotion?.kill();moodMotion=NookMotion.companion(gsap,{character,shadow:document.querySelector('.nib-shadow'),particles:[...document.querySelectorAll('.companion-effects i')],bar:document.querySelector('.task-progress i')},mood);if(reduced())moodMotion.progress(1);else moodMotion.play(0);
};
const moodTasks={idle:['Tudo tranquilo','Um respiro entre uma tarefa e outra.'],working:['Trabalhando','Ajustando a interface do seu projeto.'],waiting:['Precisa de você','Uma permissão esperando sua resposta.'],done:['Tudo pronto','A tarefa terminou. Pode conferir.'],sleeping:['Descansando','Tudo em dia. Hora de um respiro.']};
document.querySelectorAll('[data-mood]').forEach(button=>listen(button,'click',()=>{playMood(button);const mood=button.dataset.mood;document.querySelector('.nib-room').dataset.mood=mood;document.querySelector('.task-status').textContent=moodTasks[mood][0];document.querySelector('.task-line').textContent=moodTasks[mood][1];}));
listen(document,'nook-nib-location',event=>{if(event.detail==='companion')playMood(document.querySelector('[data-mood][aria-pressed=true]'));else{moodMotion?.kill();gsap.set('.big-nib',{clearProps:'transform'});gsap.set('.companion-effects i',{opacity:0});}});
document.querySelectorAll('.button').forEach(button=>{
 const motion=NookMotion.hover(gsap,button);hoverMotions.push(motion);
 const enter=()=>{if(!reduced())motion.play();};const leave=()=>reduced()?motion.progress(0).pause():motion.reverse();
 listen(button,'pointerenter',enter);listen(button,'pointerleave',leave);listen(button,'focus',enter);listen(button,'blur',leave);
});
listen(media,'change',()=>{if(reduced()){hoverMotions.forEach(motion=>motion.progress(0).pause());moodMotion?.progress(1).pause();navMotion?.progress(1).pause();}});

 document.fonts.ready.then(()=>{if(!disposed)journey.resize();schedule();});
 const stopIntro=runIntro({gsap,home,traveler,reduced,textMotion,onDone:()=>{introActive=false;schedule();}});
 return ()=>{
  disposed=true;stopIntro();journey.dispose();textMotion.dispose();if(overlayOverflow!==null)document.body.style.overflow=overlayOverflow;
  productMotion?.();stopInteractions();stopDownloadMotion();cleanup.forEach(fn=>fn());if(raf)cancelAnimationFrame(raf);
  navMotion?.kill();moodMotion?.kill();hoverMotions.forEach(motion=>motion.revert());gsap.set('.chapter-nav',{clearProps:'opacity'});gsap.set('.big-nib',{clearProps:'transform'});
  document.body.classList.remove('in-chapters','flight-active');
 };
}
