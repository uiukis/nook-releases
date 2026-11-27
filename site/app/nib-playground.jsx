'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, AudioLines, Check, Gauge } from 'lucide-react';
import { Nib } from './nib';
import styles from './nib-playground.module.css';

const scenes = [
  { id: 'working', label: 'Em atividade', icon: AudioLines, title: 'Codex trabalhando', detail: 'Atualizando a interface', used: 36, mood: 'working', reply: 'Tô acompanhando por aqui.' },
  { id: 'quota', label: 'Cota baixa', icon: Gauge, title: 'Codex trabalhando', detail: 'Janela de 5 horas', used: 95, mood: 'worried', reply: 'Opa, só restam 5%.' },
  { id: 'done', label: 'Concluído', icon: Check, title: 'Tarefa concluída', detail: 'Codex terminou a atualização', used: 95, mood: 'done', reply: 'Prontinho! Pode conferir.' },
];

export function NibPlayground() {
  const [selection, setSelection] = useState({ id: 'working', revision: 0 });
  const [excited, setExcited] = useState(false);
  const picked = scenes.find(({ id }) => id === selection.id);
  // Hovering or focusing any download button makes Nib cheer, wherever the button is.
  const scene = excited ? { ...picked, mood: 'dance', reply: 'Bora baixar?' } : picked;
  const Signal = scene.icon;

  useEffect(() => {
    const over = event => setExcited(Boolean(event.target.closest?.('[data-download]')));
    document.addEventListener('pointerover', over);
    document.addEventListener('focusin', over);
    const out = () => setExcited(false);
    document.addEventListener('focusout', out);
    return () => {
      document.removeEventListener('pointerover', over);
      document.removeEventListener('focusin', over);
      document.removeEventListener('focusout', out);
    };
  }, []);

  function followPointer(event) {
    if (event.pointerType !== 'mouse') return;
    const stage = event.currentTarget;
    const box = stage.getBoundingClientRect();
    stage.style.setProperty('--look-x', ((event.clientX - box.left) / box.width - 0.5) + 'px');
    stage.style.setProperty('--look-y', ((event.clientY - box.top) / box.height - 0.5) + 'px');
  }

  function resetPointer(event) {
    event.currentTarget.style.removeProperty('--look-x');
    event.currentTarget.style.removeProperty('--look-y');
  }

  return <div id="playground" className={'hero-nib-scene playground ' + styles.scene} data-scene={scene.id}
    onPointerMove={followPointer} onPointerLeave={resetPointer}>
    <div className={styles.heading}>
      <h2>Esse é o Nib.</h2>
      <p>Veja como ele reage ao seu dia.</p>
    </div>
    <div className={styles.stage}>
      <div className={styles.notch} role="status" aria-atomic="true">
        <span className={styles.signal}><Signal size={17} aria-hidden="true" /></span>
        <span className={styles.notchCopy}><strong>{scene.title}</strong><small>{scene.detail}</small></span>
        <span className={styles.quota}><strong>{100 - scene.used}%</strong><small>livre</small></span>
      </div>
      <div className={styles.track} aria-hidden="true" />
      <div className={'home-speech ' + styles.speech} aria-live="polite"><span key={selection.revision}>{scene.reply}</span></div>
      <button type="button" className={'nib-home ' + styles.nibHome} aria-label="Seguir o Nib até a demonstração">
        <span className={styles.pose} key={selection.revision} data-animated={selection.revision > 0}>
          <Nib mood={scene.mood} size="100%" />
        </span>
      </button>
    </div>
    <div className={styles.controls} role="group" aria-label="Situações para testar com o Nib">
      {scenes.map(({ id, label, icon: Icon }) => <button key={id} type="button" aria-pressed={scene.id === id}
        onClick={() => setSelection(({ revision }) => ({ id, revision: revision + 1 }))}>
        <Icon size={15} aria-hidden="true" />{label}
      </button>)}
    </div>
    <a className={styles.next} href="#chapter-music">Explorar com o Nib <ArrowDown size={16} aria-hidden="true" /></a>
  </div>;
}
