'use client';

import { useEffect } from 'react';
import { ArrowDown, ArrowRight, Apple, ChevronUp, Download, Monitor, Settings, X } from 'lucide-react';
import features from './story-features.json';
import { mountStory } from './scroll-controller';
import { NibGlyph } from './nib';
import introBrand from './intro-brand.json';

const repo = 'https://github.com/uiukis/nook-releases';
const moods = [['idle', 'De boa'], ['working', 'Trabalhando'], ['waiting', 'Esperando'], ['done', 'Prontinho'], ['sleeping', 'Descansando']];
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

function DownloadButton({children = 'Baixar a beta', className = 'button'}) {
  return <button type="button" className={className} data-download=""><Download size={19} aria-hidden="true" />{children}</button>;
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
    <button className="closed-face" type="button" aria-label="Explorar o Nook no notch" aria-expanded="false"><span className="closed-label"><strong>Nook</strong><small className="closed-context">Seu dia, por perto.</small></span><span className="closed-nib"><NibGlyph /></span></button>
    </div>
  </div></aside>;
}

function FeatureChapters() {
  return <section className="scroll-features" id="features" aria-label="Conheça os nove recursos do Nook">{features.map((feature, index) => <article className="feature-chapter" id={'chapter-' + feature.id} data-chapter={feature.id} aria-labelledby={'chapter-' + feature.id + '-title'} key={feature.id}>
    <div className="chapter-body shell"><div className="chapter-copy"><span className="chapter-label">{feature.label}</span><h2 id={'chapter-' + feature.id + '-title'}>{feature.title}</h2><p>{feature.text}</p></div>
      <div className="chapter-dock" data-dock={feature.id} aria-hidden="true"><span className="dock-caption">{feature.label}, no seu ritmo.</span><span className="dock-note">Experimente os controles do Nook.</span></div>
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
    <span className="dialog-nib"><NibGlyph /></span><h2 id="download-heading">Vem pro seu notch.</h2><p>Escolha o pacote para o seu computador.</p>
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
      <div className="intro-canvas" aria-hidden="true" dangerouslySetInnerHTML={{__html:introBrand.html}} />
      <button className="skip-intro" type="button">Pular abertura <ArrowRight size={16} aria-hidden="true" /></button>
    </div>
    <noscript><style>{'.intro-overlay{display:none!important}'}</style></noscript>
    <div className="nib-traveler" aria-hidden="true"><NibGlyph /></div>
    <div className="site-content"><a className="skip" href="#features">Pular para os recursos</a><TravelingNotch basePath={basePath} /><div id="top" />
      <header className="site-header shell"><a className="wordmark" href="#top" aria-label="Nook, início">Nook</a><nav aria-label="Navegação principal"><a href="#features">Recursos</a><a href="#platforms">Mac e Windows</a></nav><DownloadButton>Baixar beta</DownloadButton></header>
      <main>
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy"><h1 id="hero-title">Seu dia.<br />{' '}No seu<br /><span className="notch-word">notch.<i aria-hidden="true" /></span></h1><p>Música, arquivos e agentes de IA. Tudo perto, sem sair do que você está fazendo.</p>
            <div className="hero-actions"><DownloadButton /><a className="button button-outline" href="#features">Explorar recursos</a></div><div className="hero-compatibility"><span><Apple size={14} aria-hidden="true" />macOS</span><span><Monitor size={14} aria-hidden="true" />Windows</span></div>
          </div>
          <div className="hero-nib-scene playground" id="playground"><p className="home-label">Esse é o Nib.</p><p className="home-heading">Pequeno.<br />Mas tá sempre<br />por perto.</p><div className="home-track" aria-hidden="true" /><div className="home-speech">Bora dar uma volta?</div><button type="button" className="nib-home" aria-label="Levar o Nib até o notch"><NibGlyph /></button><a className="scroll-invitation" href="#chapter-music"><span>Rola a página.<br />Eu vou junto.</span><ArrowDown size={20} aria-hidden="true" /></a><span className="home-note">Seu companheiro no Nook.</span></div>
        </section>
        <FeatureChapters />
        <section className="nib-section shell" id="nib" aria-labelledby="nib-title"><div className="nib-room"><div className="nib-room-edge"><span>Codex está trabalhando</span><span className="tiny-nib"><NibGlyph /></span></div><div className="big-nib"><NibGlyph /></div><div className="nib-bubble" role="status">Pode deixar comigo.</div><div className="nib-shadow" /></div><div className="nib-copy"><h2 id="nib-title">Tem alguém<br />de olho.</h2><p>Esse é o Nib. Pequeno, discreto e com um jeito de contar que algo está acontecendo. Ele trabalha, espera por você e comemora quando termina.</p><div className="mood-buttons" role="group" aria-label="Humores do Nib">{moods.map(([id, label]) => <button key={id} type="button" data-mood={id} aria-pressed={id === 'idle'}>{label}</button>)}</div></div></section>
        <section className="platforms shell" id="platforms" aria-labelledby="platform-title"><div className="platforms-heading"><h2 id="platform-title">Mac ou Windows.<br />Tem um lugar pra ele.</h2><p>O mesmo espírito, com as possibilidades de cada sistema.<br />Sem precisar ter uma tela com notch.</p></div><div className="platform-columns">
          <article><Apple size={27} aria-hidden="true" /><h3>Feito pra se sentir em casa no Mac.</h3><p>Notch físico ou virtual, player completo, cotas, calendário e todas as integrações do Nook.</p><span>macOS 14 ou superior</span><DownloadButton className="text-action">Baixar para Mac</DownloadButton></article>
          <article><Monitor size={25} aria-hidden="true" /><h3>O topo da sua tela, agora no Windows.</h3><p>Notch nativo, agentes, mídia, Estante, transferência e ferramentas do dia a dia. Com instalador x64 e ARM64.</p><span>Windows 10 (2004+) ou 11</span><DownloadButton className="text-action">Baixar para Windows</DownloadButton></article>
        </div><p className="honesty-note">A demonstração usa a interface do Mac com dados de exemplo. As notas de cada recurso mostram as diferenças no Windows.</p></section>
        <section className="closing shell" id="downloads"><span className="closing-nib"><NibGlyph /></span><h2>Abre espaço<br />pro seu dia.</h2><DownloadButton /><p>Instaladores públicos. Sem conta, sem login.</p></section>
      </main>
      <footer className="shell"><a className="wordmark" href="#top" aria-label="Nook, início">Nook</a><span>Feito por Wilker Quirino.</span><a href={repo}>Versões e suporte</a></footer>
      <nav className="chapter-nav" aria-label="Navegar pelos recursos">{features.map(feature => <a href={'#chapter-' + feature.id} data-chapter-link={feature.id} aria-label={feature.label} key={feature.id}><span className="chapter-nav-label">{feature.label}</span><i aria-hidden="true" /></a>)}</nav>
      <a className="mobile-chapter-next" href="#chapter-files" aria-label="Ir para o próximo recurso"><span className="mobile-chapter-label">Música</span><span className="mobile-chapter-count">1 / 9</span><ArrowDown size={14} aria-hidden="true" /></a>
      <Downloads releases={releases} />
      <script id="feature-data" type="application/json" dangerouslySetInnerHTML={{__html: JSON.stringify(features).replaceAll('<', '\\u003c')}} />
    </div>
  </>;
}
