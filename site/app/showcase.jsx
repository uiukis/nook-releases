'use client';

import { useEffect, useRef, useState } from 'react';
import { Settings2, Maximize2, Minimize2, RotateCcw, Volume2 } from 'lucide-react';
import { features, settingsSections } from './features';
import { Nib } from './nib';

export function Demo({ basePath = '' }) {
  const frame = useRef(null);
  const [ready, setReady] = useState(false);
  const [current, setCurrent] = useState({ screen: 'music', scenario: 'default', settings: false, closed: false, section: 'accounts' });
  const feature = features.find(item => item.id === current.screen) || features[0];

  useEffect(() => {
    const onMessage = event => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow || event.data?.type !== 'nook-demo-state') return;
      setReady(true);
      setCurrent(event.data);
    };
    window.addEventListener('message', onMessage);
    frame.current?.contentWindow?.postMessage({ type: 'nook-demo-command', command: 'state' }, location.origin);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  function send(command, screen) {
    frame.current?.contentWindow?.postMessage({ type: 'nook-demo-command', command, screen }, location.origin);
  }
  function keyboardTabs(event, index) {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % features.length;
    if (event.key === 'ArrowLeft') next = (index + features.length - 1) % features.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = features.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    send('screen', features[next].id);
    event.currentTarget.parentElement.children[next].focus();
  }

  return <section className="demo-section" id="demo" aria-label="Experimente as funcionalidades do Nook">
    <div className="desktop-theatre">
      <iframe ref={frame} className="product-demo" src={basePath + '/preview/?embed=1#music'} title="Nook interativo: nove abas com dados de exemplo" onLoad={() => send('state')} />
      {!ready && <div className="demo-loading" role="status"><Nib size={32} /> Preparando o Nook…</div>}
      <div className="theatre-tools" role="group" aria-label="Controles da prévia">
        <button type="button" className={current.settings ? 'is-active' : ''} onClick={() => send('settings')} disabled={!ready} aria-expanded={Boolean(current.settings)}><Settings2 size={15} /> Configurações</button>
        <button type="button" className="nib-tool" aria-label="Conhecer os humores do Nib" title="Conhecer o Nib" disabled={!ready} onClick={() => send('nib')} aria-expanded={Boolean(current.nibOpen)}><Nib size={22} /></button>
        <button type="button" onClick={() => send('toggle')} disabled={!ready}>{current.closed ? <Maximize2 size={15} /> : <Minimize2 size={15} />}{current.closed ? 'Abrir o notch' : 'Recolher o notch'}</button>
      </div>
    </div>
    <div className="feature-tabs" role="tablist" aria-label="Funcionalidades do Nook">
      {features.map((item, index) => <button key={item.id} id={'feature-' + item.id} role="tab" type="button" aria-selected={feature.id === item.id && !current.settings} aria-controls="feature-detail" tabIndex={feature.id === item.id ? 0 : -1} disabled={!ready} onClick={() => send('screen', item.id)} onKeyDown={event => keyboardTabs(event, index)}><item.icon size={17} aria-hidden="true" />{item.label}</button>)}
    </div>
    <p className="demo-disclaimer">Prévia interativa do macOS com dados de exemplo. Pode clicar e explorar.</p>
    <div className="feature-detail" id="feature-detail" role="tabpanel" aria-labelledby={current.settings ? undefined : 'feature-' + feature.id} aria-label={current.settings ? 'Configurações' : undefined}>
      <div className="feature-story"><p className="section-hint">{current.settings ? 'Do seu jeito' : feature.label}</p><h2>{current.settings ? 'Um cantinho que combina com o seu jeito de trabalhar.' : feature.title}</h2><p>{current.settings ? 'Escolha como abrir o notch, conecte as contas e ajuste o que aparece. Os controles aqui são uma demonstração; nada muda no seu computador.' : feature.description}</p></div>
      <div className="feature-actions">
        <span className="scenario-label">{current.settings ? 'Explore as configurações' : 'Experimente uma situação'}</span>
        <div className="scenario-buttons" role="group" aria-label={current.settings ? 'Seções de configurações' : 'Situações de ' + feature.label}>
          {(current.settings ? settingsSections : feature.states).map(([id, label]) => <button type="button" key={id} aria-pressed={(current.settings ? current.section : current.scenario) === id} disabled={!ready} onClick={() => send(current.settings ? 'section' : 'scenario', id)}>{label}</button>)}
        </div>
        {!current.settings && <><ul className="feature-includes">{feature.details.map(detail => <li key={detail}>{detail}</li>)}</ul><p className="windows-note"><span>No Windows</span>{feature.windows}</p></>}
        <button type="button" className="text-button reset-demo" onClick={() => send('screen', feature.id)} disabled={!ready}><RotateCcw size={14} /> Recomeçar esta prévia</button>
      </div>
    </div>
  </section>;
}

const moments = [
  { id: 'working', label: 'Trabalhando', title: 'Seu agente está cuidando disso.', detail: 'Codex está trabalhando', project: 'Seu próximo projeto', mood: 'working', mark: 'agent' },
  { id: 'music', label: 'Música', title: 'Uma música pra acompanhar.', detail: 'Luma · Entre janelas', project: 'Entre janelas', mood: 'dance', mark: 'music' },
  { id: 'focus', label: 'Foco', title: 'Só mais um pouquinho de foco.', detail: '18:42 restantes', project: 'Foco em andamento', mood: 'idle', mark: 'focus' },
  { id: 'approval', label: 'Permissão', title: 'Tem uma decisão esperando por você.', detail: 'Claude Code precisa de você', project: 'Pedido de permissão', mood: 'waiting', mark: 'agent' },
  { id: 'done', label: 'Concluído', title: 'Terminou. Pode voltar quando quiser.', detail: 'Codex concluiu a tarefa', project: 'Tudo pronto por aqui', mood: 'done', mark: 'done' },
  { id: 'quota', label: 'Cota', title: 'Bom saber antes de chegar no limite.', detail: 'Veja as janelas de uso', project: 'Cota perto do limite', mood: 'waiting', mark: 'quota' },
];

export function CompactCompanion() {
  const [selected, setSelected] = useState(moments[0]);
  return <section className="companion-section wrap" aria-labelledby="companion-title">
    <div className="companion-copy"><p className="section-hint">O Nib fica de olho</p><h2 id="companion-title">Às vezes, nem precisa abrir.</h2><p>O notch ocupa pouco espaço e muda com o seu dia. E esse carinha aqui dá o recado quando tem alguma coisa acontecendo.</p><div className="companion-options" role="group" aria-label="Estados do notch fechado">{moments.map(moment => <button key={moment.id} type="button" aria-pressed={selected.id === moment.id} onClick={() => setSelected(moment)}>{moment.label}</button>)}</div></div>
    <div className="companion-scene">
      <div className="compact-desktop" aria-label={selected.project + '. ' + selected.detail}>
        <div className="compact-notch"><span className="compact-symbol" aria-hidden="true">{selected.mark === 'music' ? <Volume2 size={18} /> : <Nib mood={selected.mood} size={23} />}</span><span className="compact-text"><strong>{selected.project}</strong><small>{selected.detail}</small></span><span className={'compact-signal signal-' + selected.id} aria-hidden="true"><i /><i /><i /></span><Nib mood={selected.mood} size={28} /></div>
      </div>
      <p className="companion-caption" role="status">{selected.title}</p>
    </div>
  </section>;
}
