import { Download, Apple, Monitor, MessageCircle } from 'lucide-react';
import { Demo, CompactCompanion } from './showcase';
import { Nib } from './nib';
import releases from '../data/releases.json';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const publicRepo = 'https://github.com/uiukis/nook-releases';
const compatibility = [
  ['Música e controles do player', 'Player completo, letras e saída de áudio', 'Controles de mídia do sistema'],
  ['Estante de arquivos', 'Arraste, prévia e compartilhamento', 'Arraste, abrir e mostrar no Explorer'],
  ['Cotas de uso', 'Claude, Codex, Cursor e Antigravity', 'Codex'],
  ['Atividade de agentes', 'Claude, Codex, Cursor e Antigravity', 'Codex, Claude Code e Cursor'],
  ['Histórico de transferência', 'Textos, links, imagens, cores e atalhos', 'Textos em memória e busca'],
  ['Ferramentas do dia a dia', 'Foco, calendário e avisos do terminal', 'Foco e atalho para o Relógio'],
  ['Monitor do sistema', 'Memória, CPU, GPU e ações por app', 'Memória e processos'],
  ['Armazenamento', 'Comandos do Mole no terminal', 'Ferramentas nativas do Windows'],
  ['Permissões do Claude Code', 'Revisar, permitir, negar ou ir ao terminal', 'Revisar, permitir, negar ou ir ao terminal'],
];

export default function Home() {
  return <>
    <a className="skip-link" href="#demo">Pular para a demonstração</a>
    <header className="mast wrap">
      <a className="brand" href="#top" aria-label="Nook, início"><img src={basePath + '/nook.svg'} width="30" height="30" alt="" />Nook</a>
      <nav aria-label="Navegação principal"><a href="#demo">O que cabe aqui</a><a href="#platforms">Mac e Windows</a><a className="button button-small" href="#downloads">Baixar a beta</a></nav>
    </header>
    <main id="top">
      <section className="hero wrap" aria-labelledby="hero-title">
        <h1 id="hero-title">Um pequeno espaço.<br />Pra muita coisa.</h1>
        <p>Sua música, seus agentes e as coisas que você usa o tempo todo.<br className="desktop-break" /> Tudo no notch.</p>
        <div className="hero-actions"><a className="button" href="#downloads"><Download size={17} aria-hidden="true" />Baixar a beta</a><a className="plain-link" href="#demo">Experimentar o Nook</a></div>
        <span className="beta-note">Beta pública para macOS e Windows</span>
      </section>
      <div className="demo-wrap"><Demo basePath={basePath} /></div>
      <CompactCompanion />
      <section className="platform-section wrap" id="platforms" aria-labelledby="platform-title">
        <div className="section-heading"><div><p className="section-hint">O seu computador, do seu jeito</p><h2 id="platform-title">Um Nook em cada sistema.<br />Com suas próprias possibilidades.</h2></div><p>O visual é da mesma família. Os recursos acompanham o que cada sistema permite — e a versão Windows segue crescendo.</p></div>
        <div className="platform-pair">
          <article className="platform-summary"><Apple size={25} aria-hidden="true" /><h3>No Mac</h3><p>Integração com o notch físico ou virtual, materiais do macOS e o conjunto mais completo de recursos do Nook.</p><span>macOS 14 ou superior</span></article>
          <article className="platform-summary"><Monitor size={25} aria-hidden="true" /><h3>No Windows</h3><p>Notch preso ao topo da tela, Acrylic opcional e as ferramentas essenciais, com instalador para Intel/AMD ou ARM64.</p><span>Windows 10 (2004+) ou 11</span></article>
        </div>
        <details className="compatibility"><summary>Compare todos os recursos <span aria-hidden="true">+</span></summary><div className="table-scroll"><table><caption>Disponibilidade dos recursos nesta beta</caption><thead><tr><th scope="col">Recurso</th><th scope="col">macOS</th><th scope="col">Windows</th></tr></thead><tbody>{compatibility.map(([name, mac, win]) => <tr key={name}><th scope="row">{name}</th><td>{mac}</td><td>{win}</td></tr>)}</tbody></table></div></details>
      </section>
      <section className="download-section" id="downloads" aria-labelledby="download-title">
        <div className="wrap">
          <div className="download-heading"><Nib size={55} mood="done" /><h2 id="download-title">Seu próximo cantinho<br />favorito da tela.</h2><p>A beta está aberta. Escolha seu sistema e vem experimentar.</p></div>
          <div className="download-pair">
            <article className="download-option"><div className="download-os"><Apple size={24} aria-hidden="true" /><h3>macOS</h3><span>{releases.macos.version}</span></div><p>Um pacote universal para Apple Silicon e Intel.</p><a className="button" href={releases.macos.download}><Download size={16} aria-hidden="true" />Baixar para macOS</a><a className="install-link" href={publicRepo + '#instalar-no-macos'}>Como instalar no Mac</a><small>macOS 14+. O pacote desta versão mantém a beta do Mac.</small></article>
            <article className="download-option"><div className="download-os"><Monitor size={24} aria-hidden="true" /><h3>Windows</h3><span>{releases.windows.version}</span></div><p>Instalação completa, com os componentes necessários.</p><div className="windows-downloads"><a className="button" href={releases.windows.x64}><Download size={16} aria-hidden="true" />Intel/AMD</a><a className="button button-secondary" href={releases.windows.arm64}>ARM64</a></div><a className="install-link" href={publicRepo + '#instalar-no-windows'}>Como instalar no Windows</a><small>Windows 10 (2004+) ou 11. Para atualizar, feche o Nook pela bandeja e execute o instalador.</small></article>
          </div>
          <div className="release-links"><span>Downloads públicos. Sem conta ou login.</span><a href={releases.releaseUrl}>Notas da versão</a><a href={releases.checksums}>Verificar os arquivos</a></div>
        </div>
      </section>
      <section className="questions wrap" aria-labelledby="questions-title"><div><p className="section-hint">Antes de instalar</p><h2 id="questions-title">As perguntas<br />que costumam aparecer.</h2></div><div className="question-list">
        <details><summary>Preciso ter um computador com notch?</summary><p>Não. O Nook também cria um notch virtual no topo da tela. Ele funciona em Macs sem recorte de câmera e no Windows.</p></details>
        <details><summary>O que acontece com os meus arquivos?</summary><p>A Estante guarda referências aos arquivos originais. Retirar um arquivo da Estante não apaga o arquivo do computador.</p></details>
        <details><summary>Ele já começa a guardar tudo que eu copio?</summary><p>Não. O histórico da área de transferência começa quando você ativa. No Windows, os textos ficam somente em memória; no Mac, há opções de persistência nas configurações.</p></details>
        <details><summary>É preciso conectar os agentes?</summary><p>Codex é acompanhado pelos arquivos locais. Claude Code e Cursor usam integrações que você instala nas configurações do Nook. A leitura de cotas depende da sessão já existente de cada conta.</p></details>
        <details><summary>Por que o sistema pode mostrar um aviso ao instalar?</summary><p>A beta ainda não tem assinatura de distribuição no Windows nem notarização da Apple. O guia de instalação explica os avisos e os limites desta versão.</p><a href={publicRepo + '#baixar-a-beta'}>Ler o guia de instalação</a></details>
        <details><summary>Encontrei um problema. Onde conto?</summary><p>Abra uma issue com a versão, o sistema e os passos para reproduzir. Se puder, uma captura ajuda. Não inclua credenciais ou dados pessoais.</p><a href={publicRepo + '/issues'}>Relatar um problema</a></details>
      </div></section>
    </main>
    <footer className="foot wrap"><a className="brand" href="#top"><img src={basePath + '/nook.svg'} width="27" height="27" alt="" />Nook</a><p>Um pequeno espaço no seu dia.<br /><span>Feito por Wilker Quirino.</span></p><a href={publicRepo}><MessageCircle size={17} aria-hidden="true" />Downloads e suporte</a></footer>
  </>;
}
