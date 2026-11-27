'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, CircleAlert, Gauge, Play, RotateCcw, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Nib } from './nib';
import styles from './nib-agent.module.css';

const providers = { claude: 'Claude', codex: 'Codex' };
const stepDelay = 1050;
const cost = 26;

// Each task is a short scripted run. `ask` is the step that needs a human.
const tasks = [
  { id: 'ui', label: 'Ajustar a interface', steps: ['Lendo os componentes', 'Ajustando o espaçamento do cabeçalho', 'Revisando o contraste das cores'] },
  { id: 'tests', label: 'Rodar os testes', steps: ['Abrindo o projeto', 'Rodando 148 testes', 'Corrigindo 2 falhas'], ask: { at: 2, text: 'Editar src/player.ts', detail: 'O agente quer alterar 1 arquivo.' } },
  { id: 'deps', label: 'Atualizar dependências', steps: ['Conferindo versões', 'Instalando 6 pacotes', 'Atualizando o lockfile'], ask: { at: 1, text: 'Executar npm install', detail: 'O comando vai baixar 6 pacotes.' } },
];

const reactions = {
  idle: ['Pode deixar comigo.', 'idle'],
  working: ['Tô cuidando disso.', 'working'],
  waiting: ['Preciso de você aqui.', 'waiting'],
  done: ['Prontinho! Pode conferir.', 'done'],
  denied: ['Tudo bem, parei por aqui.', 'sleeping'],
  low: ['Opa, a cota tá no fim.', 'worried'],
};

export function NibAgent() {
  const [provider, setProvider] = useState('claude');
  const [task, setTask] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [step, setStep] = useState(0);
  const [remaining, setRemaining] = useState(72);
  const [kick, setKick] = useState(0);
  const [history, setHistory] = useState([]);
  const [asleep, setAsleep] = useState(false);
  const timer = useRef(0);
  const nap = useRef(0);
  const stage = useRef(null);

  // Nib dozes off after a quiet while and wakes when the pointer comes back.
  function stayAwake() {
    window.clearTimeout(nap.current);
    setAsleep(false);
    nap.current = window.setTimeout(() => setAsleep(true), 14000);
  }
  useEffect(() => {
    nap.current = window.setTimeout(() => setAsleep(true), 14000);
    return () => window.clearTimeout(nap.current);
  }, []);
  function look(event) {
    stayAwake();
    if (event.pointerType !== 'mouse') return;
    const box = stage.current.getBoundingClientRect();
    stage.current.style.setProperty('--look-x', ((event.clientX - box.left) / box.width - 0.5) * 1.3 + 'px');
    stage.current.style.setProperty('--look-y', ((event.clientY - box.top) / box.height - 0.5) * 0.9 + 'px');
  }
  function lookAway() {
    stage.current.style.removeProperty('--look-x');
    stage.current.style.removeProperty('--look-y');
  }

  const low = remaining <= 20;
  const askNow = phase === 'waiting' && task?.ask;

  // Advance the script one step at a time. Permission and completion pause it.
  useEffect(() => {
    if (phase !== 'working' || !task) return undefined;
    timer.current = window.setTimeout(() => {
      const next = step + 1;
      if (task.ask && next === task.ask.at && !task.asked) {
        task.asked = true;
        setStep(next);
        setPhase('waiting');
      } else if (next >= task.steps.length) {
        setStep(next);
        setRemaining(value => Math.max(0, value - cost));
        setHistory(list => [{ id: Date.now(), label: task.label, outcome: 'Concluída' }, ...list].slice(0, 3));
        setPhase('done');
      } else setStep(next);
    }, stepDelay);
    return () => window.clearTimeout(timer.current);
  }, [phase, step, task]);

  function start(choice) {
    if (phase === 'working' || phase === 'waiting' || remaining <= 0) return;
    stayAwake();
    setTask({ ...choice, asked: false });
    setStep(0);
    setPhase('working');
    setKick(value => value + 1);
  }
  function answer(allowed) {
    setKick(value => value + 1);
    if (allowed) setPhase('working');
    else {
      setHistory(list => [{ id: Date.now(), label: task.label, outcome: 'Negada' }, ...list].slice(0, 3));
      setPhase('denied');
    }
  }
  function reset() {
    stayAwake();
    window.clearTimeout(timer.current);
    setTask(null);
    setPhase('idle');
    setStep(0);
    setRemaining(72);
    setHistory([]);
    setKick(value => value + 1);
  }

  const key = phase === 'idle' && low ? 'low' : phase === 'done' && low ? 'low' : phase;
  const sleepy = asleep && phase === 'idle' && !low;
  const [speech, mood] = sleepy ? ['Zzz… me chama quando quiser.', 'sleeping'] : reactions[key];
  const busy = phase === 'working' || phase === 'waiting';
  const title = phase === 'idle' ? providers[provider] + ' em repouso'
    : phase === 'working' ? providers[provider] + ' trabalhando'
    : phase === 'waiting' ? 'Aprovação pendente'
    : phase === 'done' ? 'Tarefa concluída' : 'Tarefa interrompida';
  const detail = phase === 'idle' ? 'Peça uma tarefa abaixo'
    : phase === 'waiting' ? task.ask.text
    : phase === 'done' ? task.label
    : phase === 'denied' ? 'Você negou o pedido'
    : task.steps[Math.min(step, task.steps.length - 1)];
  const progress = !task ? 0 : phase === 'done' ? 100 : Math.round((step / task.steps.length) * 100);

  return <section className={'shell ' + styles.section} id="agente" aria-labelledby="agent-title">
    <div className={styles.copy}>
      <span className="chapter-label">Agentes de IA</span>
      <h2 id="agent-title">Você pede.<br />Ele avisa.</h2>
      <p>O Nook acompanha o Claude e o Codex enquanto você faz outra coisa. Quando o agente precisa de uma permissão, o Nib chama. Quando termina, ele comemora.</p>
      <div className={styles.providers} role="group" aria-label="Agente">
        {Object.entries(providers).map(([id, label]) => <button key={id} type="button" aria-pressed={provider === id} disabled={busy}
          onClick={() => setProvider(id)}>{label}</button>)}
      </div>
    </div>

    <div className={styles.stage} data-phase={phase} data-low={low} ref={stage} onPointerMove={look} onPointerLeave={lookAway}>
      <div className={styles.notch} role="status" aria-atomic="true">
        <span className={styles.signal} data-phase={phase}>
          {phase === 'done' ? <Check size={16} aria-hidden="true" /> : phase === 'waiting' ? <CircleAlert size={16} aria-hidden="true" /> : <Sparkles size={16} aria-hidden="true" />}
        </span>
        <span className={styles.notchCopy}><strong>{title}</strong><small>{detail}</small></span>
        <span className={styles.quota}><strong>{remaining}%</strong><small>livre</small></span>
        <span className={styles.bar} aria-hidden="true"><i style={{ width: progress + '%' }} /></span>
      </div>

      <ol className={styles.log} aria-label="Etapas da tarefa">
        {task ? task.steps.map((text, index) => {
          const state = index < step || phase === 'done' ? 'done' : index === step && phase === 'working' ? 'active' : index === step && phase === 'waiting' ? 'active' : 'todo';
          const stopped = phase === 'denied' && index >= step;
          return <li key={task.id + index} data-state={stopped ? 'todo' : state} style={{ '--i': index }}>
            <span aria-hidden="true">{state === 'done' && !stopped ? <Check size={12} /> : null}</span>{text}
          </li>;
        }) : <li data-state="todo" className={styles.empty}>Nenhuma tarefa ainda.</li>}
      </ol>

      {askNow ? <div className={styles.ask} role="alertdialog" aria-label="Pedido de permissão">
        <span className={styles.askIcon}><ShieldCheck size={18} aria-hidden="true" /></span>
        <div><strong>{task.ask.text}</strong><small>{task.ask.detail}</small></div>
        <button type="button" className={styles.deny} onClick={() => answer(false)}><X size={14} aria-hidden="true" />Negar</button>
        <button type="button" className={styles.allow} onClick={() => answer(true)} autoFocus><Check size={14} aria-hidden="true" />Permitir</button>
      </div> : null}

      {history.length ? <ul className={styles.history} aria-label="Tarefas recentes">
        {history.map(item => <li key={item.id} data-outcome={item.outcome}><span aria-hidden="true" />{item.label}<small>{item.outcome}</small></li>)}
      </ul> : null}

      <div className={styles.speech} aria-live="polite"><span key={kick + key}>{speech}</span></div>
      <div className={styles.nib} data-mood={mood} aria-hidden="true">
        <span className={styles.pose} key={kick + mood}><Nib mood={mood} size="100%" /></span>
      </div>
    </div>

    <div className={styles.controls}>
      <div className={styles.tasks} role="group" aria-label="Tarefas para pedir ao agente">
        {tasks.map(item => <button key={item.id} type="button" disabled={busy || remaining <= 0} onClick={() => start(item)}>
          <Play size={13} aria-hidden="true" />{item.label}
        </button>)}
      </div>
      <div className={styles.meta}>
        <span><Gauge size={14} aria-hidden="true" />{remaining <= 0 ? 'Cota esgotada' : low ? 'Cota baixa' : 'Cota da janela de 5 h'}</span>
        <button type="button" onClick={reset}><RotateCcw size={13} aria-hidden="true" />Reiniciar</button>
      </div>
    </div>
  </section>;
}
