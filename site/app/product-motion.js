import {NookMotion} from './nook-motion';

// Finite, seekable HyperFrames/GSAP timelines; live DOM events only drive them.
export function bindDialogMotion({gsap,dialog,reduced}) {
  const show=dialog.showModal.bind(dialog),close=dialog.close.bind(dialog);
  let motion=null,closing=false,disposed=false;
  const settle=timeline=>reduced()?timeline.progress(1):timeline.play(0);
  dialog.showModal=function(){
    if(disposed)return;
    const wasOpen=dialog.open;motion?.kill();closing=false;
    if(!wasOpen){show();gsap.set(dialog,{opacity:0,y:8,scale:.97,filter:'blur(3px)','--nook-backdrop':0});}
    dialog.ownerDocument.documentElement.dataset.nookModal='true';
    motion=NookMotion.panel(gsap,dialog,true);motion.to(dialog,{'--nook-backdrop':.55,duration:.28},0);settle(motion);
  };
  dialog.close=function(value){
    if(!dialog.open||closing||disposed)return;closing=true;motion?.kill();
    motion=NookMotion.panel(gsap,dialog,false);motion.to(dialog,{'--nook-backdrop':0,duration:.18},0);
    motion.eventCallback('onComplete',()=>{closing=false;close(value);dialog.ownerDocument.documentElement.dataset.nookModal=String(Boolean(dialog.ownerDocument.querySelector('dialog[open]')));});settle(motion);
  };
  const cancel=event=>{event.preventDefault();dialog.close();};
  dialog.addEventListener('cancel',cancel);
  return ()=>{disposed=true;motion?.kill();dialog.removeEventListener('cancel',cancel);delete dialog.showModal;delete dialog.close;gsap.set(dialog,{clearProps:'opacity,transform,filter,--nook-backdrop'});};
}

export function installInteractionMotion({gsap,doc,reduced,hover=false}) {
  const active=new Set(),pressed=new WeakMap(),hovered=new WeakMap(),switches=new Map(),spinners=new Map(),listeners=[];
  let enabled=true;
  const on=(type,fn)=>{doc.addEventListener(type,fn);listeners.push(()=>doc.removeEventListener(type,fn));};
  const kill=motion=>{if(motion){motion.kill();active.delete(motion);}};
  const play=motion=>{active.add(motion);motion.eventCallback('onComplete',()=>active.delete(motion));if(reduced())motion.progress(1);else motion.play(0);};
  const button=event=>event.target?.closest?.('button,a:not(.skip),summary');
  const within=(target,other)=>Boolean(other?.nodeType&&target.contains(other));
  const release=target=>{if(!target)return;kill(pressed.get(target));const motion=NookMotion.press(gsap,target,false);pressed.set(target,motion);play(motion);};
  on('pointerdown',event=>{const target=button(event);if(!target||target.disabled)return;kill(pressed.get(target));const motion=NookMotion.press(gsap,target,true);pressed.set(target,motion);play(motion);});
  on('pointerup',event=>release(button(event)));on('pointercancel',event=>release(button(event)));
  on('keydown',event=>{if(![' ','Enter'].includes(event.key))return;const target=button(event);if(!target)return;kill(pressed.get(target));const motion=NookMotion.press(gsap,target,true);pressed.set(target,motion);play(motion);});
  on('keyup',event=>{if([' ','Enter'].includes(event.key))release(button(event));});
  on('pointerout',event=>{const target=button(event);if(target&&!within(target,event.relatedTarget)){release(target);if(hover){kill(hovered.get(target));const motion=gsap.timeline({paused:true}).to(target,{y:0,duration:.18});hovered.set(target,motion);play(motion);}}});
  if(hover)on('pointerover',event=>{const target=button(event);if(!target||within(target,event.relatedTarget)||reduced())return;kill(hovered.get(target));const motion=NookMotion.hover(gsap,target);hovered.set(target,motion);play(motion);});
  const update=()=>{
    doc.querySelectorAll('.switch[aria-checked]').forEach(node=>{
      const key=node.dataset.pref||node.getAttribute('aria-label'),checked=node.getAttribute('aria-checked')==='true',previous=switches.get(key);
      if(!previous||previous.node!==node||previous.checked!==checked){
        kill(previous?.motion);const from=previous?(previous.checked?10:0):(checked?10:0),to=checked?10:0;
        const motion=NookMotion.toggle(gsap,node,from,to);switches.set(key,{node,checked,motion});if(previous&&from!==to)play(motion);else motion.progress(1);
      }
    });
    spinners.forEach((motion,node)=>{if(!node.isConnected||!enabled||reduced()){motion.kill();spinners.delete(node);}});
    if(enabled&&!reduced())doc.querySelectorAll('.compact-spinner').forEach(node=>{
      if(!spinners.has(node)&&node.getClientRects().length&&doc.defaultView.getComputedStyle(node).visibility!=='hidden')spinners.set(node,NookMotion.spin(gsap,node).repeat(-1).play(0));
    });
  };
  const observer=new doc.defaultView.MutationObserver(records=>{if(records.some(record=>record.type==='attributes'||[...record.addedNodes].some(node=>node.nodeType===1)))update();});
  observer.observe(doc.body,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-checked']});update();
  const dispose=()=>{listeners.forEach(off=>off());observer.disconnect();active.forEach(motion=>motion.kill());switches.forEach(item=>item.motion?.kill());spinners.forEach(motion=>motion.kill());};
  dispose.setVisible=value=>{enabled=value;update();};return dispose;
}

const tabOrder=['music','files','usage','agents','clipboard','tools','system','mole','approvals'];
const fixtureStyles=`
*,*::before,*::after{transition:none!important}.compact-spinner{animation:none!important}
.embed .desktop-scene{background:transparent!important}.embed .notch{border:0!important;border-radius:0!important;box-shadow:none!important}
html.embed,html.embed body,.embed .viewport{background:transparent!important}.embed[data-nook-modal=true] .notch{border-radius:0 0 29px 29px!important}
.embed .app-footer>span:last-child{margin-right:28px}.app-content{overflow:hidden!important;gap:0!important}
.nook-tab-page{display:flex;flex-direction:column;gap:11px;flex:1;min-height:0;width:100%;position:relative}
.nook-tab-leaving{position:absolute!important;inset:13px 18px 12px;display:flex;flex-direction:column;gap:11px;pointer-events:none;z-index:2}
.nook-settings-page{min-height:100%}#settingsBody{position:relative;overflow-x:hidden}#settingsBody>.nook-tab-leaving{inset:0}
.app-tabs{position:relative;isolation:isolate}.app-tabs button{position:relative;z-index:1}.app-tabs [aria-selected=true]{background:transparent!important;border-color:transparent!important}
.nook-tab-indicator{position:absolute;top:3px;left:3px;width:30px;height:26px;border:1px solid #c7b8ed24;border-radius:8px;background:#c7b8ed17;pointer-events:none;z-index:0}
.switch::after{transform:translateX(var(--nook-switch,0px))!important}
dialog::backdrop{background:rgb(22 20 30 / var(--nook-backdrop,.5));backdrop-filter:blur(5px)}
.toast,.toast.show{transform:none}
`;

export function installProductMotion({gsap,doc,reduced,onCollapse}) {
  const win=doc.defaultView,style=doc.createElement('style');style.id='nook-native-motion';style.textContent=fixtureStyles;doc.head.append(style);
  const effects=new Set(),observers=[],disposers=[];let stopped=false,screen=doc.querySelector('#appContent').getAttribute('aria-labelledby')?.replace('app-tab-','')||'music',selectedX=tabOrder.indexOf(screen)*32;
  const stop=motion=>{motion?.kill();effects.delete(motion);};
  const run=(motion,done)=>{effects.add(motion);motion.eventCallback('onComplete',()=>{effects.delete(motion);done?.();});if(reduced())motion.progress(1);else motion.play(0);return motion;};
  const interactions=installInteractionMotion({gsap,doc,reduced,hover:true});disposers.push(interactions);
  doc.querySelectorAll('dialog').forEach(dialog=>disposers.push(bindDialogMotion({gsap,dialog,reduced})));
  const fit=()=>{const width=doc.querySelector('#desktopScene')?.clientWidth;if(width)doc.querySelector('#notch').style.setProperty('--fit',Math.min(1,width/740));};
  const resize=new win.ResizeObserver(fit);resize.observe(doc.querySelector('#desktopScene'));disposers.push(()=>resize.disconnect());fit();
  const focusAttributes=['id','data-action','data-pref','data-pref-select','data-provider','data-mood','data-settings','data-screen'];let focusKey=null;
  const remember=event=>{const node=event.target;focusKey=null;for(const attribute of focusAttributes){const value=node.getAttribute?.(attribute);if(value){focusKey={attribute,value,tag:node.tagName,region:node.closest('#settingsBody')?'settingsBody':node.closest('#settingsNav')?'settingsNav':node.closest('#nibMoods')?'nibMoods':node.closest('#appTabs')?'appTabs':'appContent',selection:node.selectionStart};break;}}};
  doc.addEventListener('focusin',remember);doc.addEventListener('input',remember,true);doc.addEventListener('change',remember,true);disposers.push(()=>{doc.removeEventListener('focusin',remember);doc.removeEventListener('input',remember,true);doc.removeEventListener('change',remember,true);});
  const restore=()=>{
    if(!focusKey||doc.activeElement!==doc.body)return;
    const key=focusKey,region=doc.getElementById(key.region),node=region?.querySelector(`[${key.attribute}="${win.CSS.escape(key.value)}"]`);
    if(node){node.focus({preventScroll:true});if(typeof key.selection==='number'&&node.setSelectionRange)try{node.setSelectionRange(key.selection,key.selection);}catch{}}
  };
  const mountPane=(container,settings=false)=>{
    let motion=null,version=0,lastSection=doc.querySelector('#settingsNav [aria-current=page]')?.dataset.settings;
    const observer=new win.MutationObserver(records=>{
      if(stopped)return;const removed=records.find(record=>[...record.removedNodes].some(node=>node.nodeType===1&&!node.classList.contains('nook-tab-leaving')))?.removedNodes;
      if(!removed)return;observer.disconnect();stop(motion);const sequence=++version;
      const to=doc.querySelector('#appContent').getAttribute('aria-labelledby')?.replace('app-tab-','')||screen;
      const section=doc.querySelector('#settingsNav [aria-current=page]')?.dataset.settings;
      const tabChanged=!settings&&to!==screen,sectionChanged=settings&&section!==lastSection;
      const direction=tabChanged?(tabOrder.indexOf(to)>tabOrder.indexOf(screen)?1:-1):1;
      const incoming=doc.createElement('div');incoming.className=settings?'nook-settings-page':'nook-tab-page';
      incoming.append(...container.childNodes);container.append(incoming);
      let outgoing=null;
      const focusedInput=!tabChanged&&!sectionChanged&&doc.hasFocus()&&['INPUT','TEXTAREA','SELECT'].includes(focusKey?.tag||doc.activeElement?.tagName);
      if(focusedInput&&focusKey?.region===container.id){
        const selector=`[${focusKey.attribute}="${win.CSS.escape(focusKey.value)}"]`;
        const retained=[...removed].filter(node=>node.nodeType===1).map(node=>node.matches(selector)?node:node.querySelector(selector)).find(Boolean);
        const replacement=incoming.querySelector(selector);
        if(retained&&replacement){
          const start=retained.selectionStart,end=retained.selectionEnd;replacement.replaceWith(retained);retained.focus({preventScroll:true});
          if(typeof start==='number'&&retained.setSelectionRange)try{retained.setSelectionRange(start,end);}catch{}
        }
      }
      if(!reduced()&&(!settings||sectionChanged)&&!focusedInput){
        outgoing=doc.createElement('div');outgoing.className='nook-tab-leaving';outgoing.setAttribute('aria-hidden','true');outgoing.inert=true;
        [...removed].forEach(node=>{if(node.nodeType===1){if(node.classList.contains('nook-tab-leaving'))node.style.inset='0';node.removeAttribute('id');node.querySelectorAll('[id]').forEach(child=>child.removeAttribute('id'));outgoing.append(node);}});
        [...outgoing.querySelectorAll('.nook-tab-leaving')].slice(1).forEach(node=>node.remove());container.append(outgoing);
      }
      container.dataset.motionState='running';container.dataset.motionDirection=String(direction);container.dataset.motionFrom=screen;container.dataset.motionTo=to;
      const done=()=>{if(sequence!==version)return;outgoing?.remove();gsap.set(incoming,{clearProps:'transform,opacity,filter'});container.dataset.motionState='idle';};
      if(outgoing)motion=run(NookMotion.tab(gsap,outgoing,incoming,direction,tabChanged?'tab':'state'),done);else done();
      if(!settings){screen=to;incoming.querySelectorAll('.meter i').forEach(node=>run(NookMotion.fill(gsap,node)));fit();}
      lastSection=section;observer.observe(container,{childList:true});restore();
    });
    observer.observe(container,{childList:true});observers.push(observer);
    disposers.push(()=>{stop(motion);container.querySelectorAll('.nook-tab-leaving').forEach(node=>node.remove());const page=container.querySelector(':scope>.nook-tab-page,:scope>.nook-settings-page');if(page)page.replaceWith(...page.childNodes);});
  };
  mountPane(doc.querySelector('#appContent'));if(doc.querySelector('#settingsBody'))mountPane(doc.querySelector('#settingsBody'),true);
  const tabs=doc.querySelector('#appTabs');let selection=null;
  const indicator=()=>{
    const selected=tabs.querySelector('[aria-selected=true]');if(!selected)return;
    let mark=tabs.querySelector('.nook-tab-indicator');if(!mark){mark=doc.createElement('i');mark.className='nook-tab-indicator';mark.setAttribute('aria-hidden','true');tabs.append(mark);}
    const x=selected.offsetLeft-3;stop(selection);selection=run(NookMotion.select(gsap,mark,selectedX,x));selectedX=x;
  };
  const tabsObserver=new win.MutationObserver(records=>{if(records.some(record=>[...record.addedNodes].some(node=>node.nodeType===1&&node.tagName==='BUTTON'))){indicator();restore();}});tabsObserver.observe(tabs,{childList:true});observers.push(tabsObserver);indicator();
  const nib=doc.querySelector('#nibLarge');if(nib){let nibMotion=null;const observer=new win.MutationObserver(()=>{stop(nibMotion);const mood=doc.querySelector('#nibMoods [aria-pressed=true]')?.dataset.mood||'idle';nibMotion=run(NookMotion.mood(gsap,nib,mood));restore();});observer.observe(nib,{childList:true});observers.push(observer);}
  const toast=doc.querySelector('#toast');if(toast){let toastMotion=null,showing=false;gsap.set(toast,{xPercent:-50,opacity:0,y:8});const observer=new win.MutationObserver(()=>{stop(toastMotion);const open=toast.classList.contains('show');if(open&&!showing)gsap.set(toast,{opacity:0,y:8,scale:.97});showing=open;toastMotion=run(NookMotion.panel(gsap,toast,open));});observer.observe(toast,{attributes:true,attributeFilter:['class']});observers.push(observer);}
  const escape=event=>{if(event.key==='Escape'&&!doc.querySelector('dialog[open]')){event.preventDefault();onCollapse();}};doc.addEventListener('keydown',escape);disposers.push(()=>doc.removeEventListener('keydown',escape));
  const dispose=()=>{stopped=true;observers.forEach(observer=>observer.disconnect());effects.forEach(motion=>motion.kill());disposers.forEach(off=>off());style.remove();tabs.querySelector('.nook-tab-indicator')?.remove();};
  dispose.setVisible=value=>interactions.setVisible(value);return dispose;
}
