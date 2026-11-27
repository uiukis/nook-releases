'use client';

import { Children, cloneElement, isValidElement, useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, Apple, Check, ChevronUp, Download, FileImage, Monitor, Music2, Settings, X } from 'lucide-react';
import features from './story-features.json';
import { mountStory } from './scroll-controller';
import { NibGlyph } from './nib';
import { NibPlayground } from './nib-playground';
import { NibAgent } from './nib-agent';
import introBrand from './intro-brand.json';

const repo = 'https://github.com/uiukis/nook-releases';
const moods = [['idle', 'De boa'], ['working', 'Trabalhando'], ['waiting', 'Precisa de você'], ['done', 'Tudo pronto'], ['sleeping', 'Descansando']];
const chapterHints = [
  ['Dá o play no Nook.', 'Pode pausar, trocar de faixa e testar a letra.'],
  ['Solta no notch.', 'Veja a Estante com arquivos, uma captura nova ou vazia.'],
  ['Uma olhada antes de continuar.', 'Teste como fica quando uma conta chega perto do limite.'],
  ['Tem alguém trabalhando.', 'Experimente quando o agente precisa de você.'],
  ['Aquele texto ainda tá aqui.', 'Explore a busca, a prévia e o histórico.'],
  ['Um tempo pra você.', 'Comece pelo foco ou dê uma olhada na agenda.'],
  ['Como anda o seu computador?', 'Compare os estados e veja o que está consumindo memória.'],
  ['Um pouco mais de espaço.', 'Conheça o Mole e as ferramentas de armazenamento.'],
  ['A última palavra é sua.', 'Abra um pedido e confira o contexto antes de decidir.'],
];

function Words({children,letters}) {
  return Children.map(children,(child,index)=>{
    if(typeof child==='string')return child.split(/(\s+)/).map((part,i)=>part.trim()?<span className="motion-word" key={index+'-'+i}>{letters?Array.from(part).map((letter,k)=><span className="motion-letter" aria-hidden="true" key={k}>{letter}</span>):part}</span>:part);
    if(isValidElement(child)&&child.props.children!==undefined)return cloneElement(child,{},<Words letters={letters}>{child.props.children}</Words>);
    return child;
  });
}
// With `letters`, each glyph is its own span so scroll can slide the title in from the side.
function AnimatedHeading({as:Tag='h2',children,letters=false,...props}) {return <Tag {...props} aria-label={letters&&typeof children==='string'?children:undefined}><Words letters={letters}>{children}</Words></Tag>;}

function DownloadButton({children = 'Baixar a beta', className = 'button'}) {
  return <button type="button" className={className} data-download=""><Download size={19} aria-hidden="true" />{children}</button>;
}

function IntroCanvas() {
  const canvas=useRef(null);
  // The editable SVG subtree is owned by the motion runtime after hydration.
  // Browser theme extensions cannot change a server/client HTML comparison.
  useLayoutEffect(()=>{const node=canvas.current;node.innerHTML=introBrand.html;return ()=>node.replaceChildren();},[]);
  return <div ref={canvas} className="intro-canvas" aria-hidden="true" />;
}

function TravelingNotch({basePath}) {
  return <aside className="scroll-notch" aria-label="Demonstração do Nook" data-mode="closed" data-docked="false" data-presence="hidden" aria-hidden="true" inert><div className="notch-arrival">
    <svg className="notch-mask-defs" aria-hidden="true"><defs><clipPath id="nook-surface-clip" clipPathUnits="userSpaceOnUse"><path className="notch-outline" /></clipPath></defs></svg>
    <div className="notch-surface">
    <iframe className="demo-frame" src={basePath + '/preview/?embed=1#music'} title="Prévia interativa do recurso atual do Nook" inert aria-hidden="true" />
    <div className="notch-tools" role="group" aria-label="Controles do notch"><span className="notch-context" aria-live="polite">Música</span><span className="notch-count">1 / 9</span>
      <button type="button" data-command="settings" aria-label="Abrir configurações" tabIndex={-1}><Settings size={17} aria-hidden="true" /></button>
      <button type="button" data-command="toggle" aria-label="Recolher o notch" tabIndex={-1}><ChevronUp size={17} aria-hidden="true" /></button>
    </div>
    <button className="notch-resident" type="button" data-command="nib" aria-label="Conhecer o Nib" tabIndex={-1}><span><NibGlyph /></span></button>
    <button className="closed-face" type="button" aria-label="Explorar o Nook no notch" aria-expanded="false"><span className="closed-label">
      <span className="closed-mark" aria-hidden="true"><span className="closed-brand">N</span><Music2 size={14} className="closed-music" /><FileImage size={14} className="closed-files" /></span>
      <span className="closed-copy"><strong className="closed-context">Nook</strong><small className="closed-detail">Seu dia, por perto.</small></span>
    </span><span className="closed-levels" aria-hidden="true"><i /><i /><i /></span><span className="closed-nib"><NibGlyph /></span></button>
    </div>
  </div></aside>;
}

function FeatureChapters() {
  return <section className="scroll-features" id="features" aria-label="Conheça os nove recursos do Nook">{features.map((feature, index) => <article className="feature-chapter" id={'chapter-' + feature.id} data-chapter={feature.id} aria-labelledby={'chapter-' + feature.id + '-title'} key={feature.id}>
    <div className="chapter-body shell"><div className="chapter-copy"><span className="chapter-label">{feature.label}</span><AnimatedHeading letters id={'chapter-' + feature.id + '-title'}>{feature.title}</AnimatedHeading><p>{feature.text}</p></div>
      <div className="chapter-dock" data-dock={feature.id} data-live="false"><span className="dock-caption">{feature.label}, no seu ritmo.</span><button className="dock-notch" type="button" data-activate={feature.id} aria-label={'Abrir demonstração de '+feature.label}><svg className="dock-outline" viewBox="0 0 360 36" preserveAspectRatio="none" aria-hidden="true"><path d="M0,0 L360,0 Q354,0 354,6 L354,24 Q354,36 342,36 L18,36 Q6,36 6,24 L6,6 Q6,0 0,0 Z" /></svg><strong>Nook</strong><span>{feature.label}</span></button>{feature.id === 'files'
        ? <span className="dock-note shelf-arrival"><span>O Nib traz uma captura para a Estante.</span><strong><Check size={14} aria-hidden="true" /> Captura guardada na Estante</strong></span>
        : <span className="dock-note">O Nib abre este notch quando chega.</span>}</div>
      <div className="chapter-details"><span className="chapter-step">{index + 1} de {features.length}</span><p className="chapter-invitation">{chapterHints[index][0]}</p><p className="chapter-hint">{chapterHints[index][1]}</p>
        <div className="scenario-buttons" role="group" aria-label={'Situações de ' + feature.label}>{feature.states.map(([id, label]) => <button key={id} type="button" data-scenario={id} data-for={feature.id} aria-pressed={id === 'default'}>{label}</button>)}</div>
        <ul>{feature.details.map(detail => <li key={detail}>{detail}</li>)}</ul><p className="platform-note">{feature.win}</p>
      </div>
    </div>
  </article>)}</section>;
}

function Downloads({releases}) {
  const packages = [[Apple, 'macOS', 'Apple Silicon e Intel · ' + releases.macos.version, releases.macos.download], [Monitor, 'Windows · Intel/AMD', 'Instalador x64 · ' + releases.windows.version, releases.windows.x64], [Monitor, 'Windows · ARM64', 'Para PCs com processador ARM · ' + releases.windows.version, releases.windows.arm64]];
  return <dialog className="download-dialog" id="download-dialog" aria-labelledby="download-heading">
    <button className="close-dialog" type="button" aria-label="Fechar downloads"><X size={20} aria-hidden="true" /></button>
    <span className="dialog-nib"><NibGlyph /></span><AnimatedHeading id="download-heading">Vem pro seu notch.</AnimatedHeading><p>Escolha o pacote para o seu computador.</p>
    {packages.map(([Icon, title, detail, href]) => <a key={title} href={href}><Icon size={23} aria-hidden="true" /><span><strong>{title}</strong><small>{detail}</small></span><Download size={19} aria-hidden="true" /></a>)}
    <small className="dialog-foot">A beta ainda não tem assinatura de distribuição. <a href={repo + '#baixar-a-beta'}>Como instalar</a></small>
    <div className="download-meta"><a href={releases.releaseUrl}>Notas da versão</a><a href={releases.checksums}>Verificar arquivos</a></div>
  </dialog>;
}

export function Landing({releases, basePath}) {
  useEffect(() => mountStory(), []);
  return <>
    <div className="intro-overlay" aria-label="Abertura do Nook" data-intro-state="pending">
      <style dangerouslySetInnerHTML={{__html:introBrand.css}} />
      <IntroCanvas />
      <button className="skip-intro" type="button">Pular abertura <ArrowRight size={16} aria-hidden="true" /></button>
    </div>
    <noscript><style>{'.intro-overlay{display:none!important}'}</style></noscript>
    <div className="nib-traveler" aria-hidden="true"><NibGlyph /><span className="nib-cargo"><FileImage size={24} /></span></div>
    <div className="site-content"><a className="skip" href="#features">Pular para os recursos</a><TravelingNotch basePath={basePath} /><div id="top" />
      <header className="site-header shell"><a className="wordmark" href="#top" aria-label="Nook, início">Nook</a><nav aria-label="Navegação principal"><a href="#features">Recursos</a><a href="#platforms">Mac e Windows</a></nav><DownloadButton>Baixar beta</DownloadButton></header>
      <main>
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy"><AnimatedHeading as="h1" id="hero-title">Seu dia.<br />{' '}No seu<br /><span className="notch-word">notch.<i aria-hidden="true" /></span></AnimatedHeading><p>Música, arquivos e agentes de IA. Tudo perto, sem sair do que você está fazendo.</p>
            <div className="hero-actions"><DownloadButton /><a className="button button-outline" href="#features">Explorar recursos</a></div><div className="hero-compatibility"><span><Apple size={14} aria-hidden="true" />macOS</span><span><Monitor size={14} aria-hidden="true" />Windows</span></div>
          </div>
          <NibPlayground />
        </section>
        <FeatureChapters />
        <NibAgent />
        <section className="nib-section shell" id="nib" aria-labelledby="nib-title">
          <div className="nib-room" data-mood="idle">
            <div className="companion-task"><div className="companion-task-heading"><span className="task-light" /><strong>nook</strong><span className="task-status">Tudo tranquilo</span></div><p className="task-line">Um respiro entre uma tarefa e outra.</p><div className="task-progress"><i /></div></div>
            <div className="companion-home"><div className="big-nib"><NibGlyph /></div></div>
            <div className="companion-effects" aria-hidden="true">{Array.from({length:8},(_,i)=><i key={i} />)}</div><div className="nib-shadow" /><div className="nib-bubble" role="status">Pode deixar comigo.</div>
          </div>
          <div className="nib-copy"><span className="chapter-label">Conheça o Nib</span><AnimatedHeading id="nib-title">Seu dia tem<br />companhia.</AnimatedHeading><p>Enquanto os agentes trabalham, ele acompanha. Precisou de você? Ele chama. Terminou? Dá pra ver na carinha dele.</p><div className="mood-buttons" role="group" aria-label="Humores do Nib">{moods.map(([id,label])=><button key={id} type="button" data-mood={id} aria-pressed={id==='idle'}>{label}</button>)}</div><p className="companion-invitation">Escolha um momento. Ele tem um jeito pra cada um.</p></div>
        </section>
        <section className="platforms shell" id="platforms" aria-labelledby="platform-title"><div className="platforms-heading"><AnimatedHeading id="platform-title">Mac ou Windows.<br />Tem um lugar pra ele.</AnimatedHeading><p>O mesmo espírito, com as possibilidades de cada sistema.<br />Sem precisar ter uma tela com notch.</p></div><div className="platform-columns">
          <article><Apple size={27} aria-hidden="true" /><h3>Feito pra se sentir em casa no Mac.</h3><p>Notch físico ou virtual, player completo, cotas, calendário e todas as integrações do Nook.</p><span>macOS 14 ou superior</span><DownloadButton className="text-action">Baixar para Mac</DownloadButton></article>
          <article><Monitor size={25} aria-hidden="true" /><h3>O topo da sua tela, agora no Windows.</h3><p>Notch nativo, agentes, mídia, Estante, transferência e ferramentas do dia a dia. Com instalador x64 e ARM64.</p><span>Windows 10 (2004+) ou 11</span><DownloadButton className="text-action">Baixar para Windows</DownloadButton></article>
        </div><p className="honesty-note">A demonstração usa a interface do Mac com dados de exemplo. As notas de cada recurso mostram as diferenças no Windows.</p></section>
        <section className="closing shell" id="downloads"><span className="closing-nib"><NibGlyph /></span><AnimatedHeading>Abre espaço<br />pro seu dia.</AnimatedHeading><DownloadButton /><p>Instaladores públicos. Sem conta, sem login.</p></section>
      </main>
      <footer className="shell"><a className="wordmark" href="#top" aria-label="Nook, início">Nook</a><span>Feito por Wilker Quirino.</span><a href={repo}>Versões e suporte</a></footer>
      <nav className="chapter-nav" aria-label="Navegar pelos recursos">{features.map(feature => <a href={'#chapter-' + feature.id} data-chapter-link={feature.id} aria-label={feature.label} key={feature.id}><span className="chapter-nav-label">{feature.label}</span><i aria-hidden="true" /></a>)}</nav>
      <a className="mobile-chapter-next" href="#chapter-files" aria-label="Ir para o próximo recurso"><span className="mobile-chapter-label">Música</span><span className="mobile-chapter-count">1 / 9</span><ArrowDown size={14} aria-hidden="true" /></a>
      <Downloads releases={releases} />
      <script id="feature-data" type="application/json" dangerouslySetInnerHTML={{__html: JSON.stringify(features).replaceAll('<', '\\u003c')}} />
    </div>
  </>;
}
