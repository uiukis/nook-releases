# Continuar o site do Nook em outra máquina

**Estado em 26/11/2026: demanda concluída e validada.** Não há implementação obrigatória pendente desta rodada. As instruções abaixo preservam o contexto para novas solicitações.

## Prompt para colar no Codex

Continue o desenvolvimento do site do Nook neste repositório: https://github.com/uiukis/nook-releases, branch main. Leia este arquivo, site/README.md, site/AGENTS.md e site/nook-intro/REVIEW.md antes de alterar algo. Entre em site/, use Node 22 ou 24, execute npm ci, node scripts/sync-motion.mjs e npm run dev. O site publicado é https://nook-notch-beta.vercel.app/.

Preserve a identidade aprovada: fundo carvão #151618, lilás #d6c5f6, Bricolage Grotesque nos títulos, Instrument Sans nos textos e a logo/Nib existentes. O usuário prefere linguagem natural, ações diretas e nenhuma pausa desnecessária para confirmação.

A versão atual implementa notches estacionários nas nove seções. A rolagem é o único relógio dos saltos: o anterior recolhe, o Nib salta e o próximo abre. Ao voltar, a timeline é buscada no sentido contrário. Coordenadas são relativas ao documento. Há um único iframe interativo, reposicionado somente enquanto oculto. Não reintroduza o painel inteiro voando pela página nem voos independentes com posições de viewport capturadas uma única vez.

A área final agora é “Seu dia tem companhia”: o Nib chega ampliado, acompanha uma atividade fictícia e reage a cinco humores. Os títulos entram por grupos de palavras, com uma subida discreta. Os spans dos títulos são renderizados pelo próprio React; não troque seus nós de texto em efeitos.

A abertura tem 2 s de marca e aproximadamente 0,71 s de montagem. Foi medida em 2667 ms no navegador. O usuário exigiu não ultrapassar 3 s: mantenha o limite global de 3000 ms, incluindo espera por fontes e montagem. O Nib sai da logo, dá tchau no N e salta diretamente para o k.

Foi corrigido um erro de hidratação reportado em screenshot: Dark Reader inseria atributos data-darkreader-* no SVG bruto antes do React. IntroCanvas monta o SVG após a hidratação usando useLayoutEffect; o HTML inicial da área fica vazio. A página e o iframe incluem meta darkreader-lock porque já têm tema próprio. Não use suppressHydrationWarning para esconder a divergência. Revalide com a extensão real após recarregar a página.

Use as skills frontend-design, ui-taste e HyperFrames quando disponíveis. Timelines canônicas estão em site/app/nook-motion.js; não edite manualmente site/nook-intro/assets/nook-motion.js nem site/app/intro-brand.json. npm run build sincroniza as cópias. Mantenha HyperFrames CLI 0.9.94; não atualize dependências sem uma razão concreta. O laboratório gerado por node scripts/prepare-motion-review.mjs demonstra ida e volta entre dois notches usando o mesmo helper handoff; ele é uma composição representativa, não uma gravação do navegador. Use preview --background para manter a prévia viva.

Validação final concluída: rolagem e inversão no meio do salto, retorno ao notch anterior, hero e área de companhia, recolhimento e reabertura manual com animação normal e movimento reduzido, configurações, downloads e busca preservando texto/cursor. O recolhimento permaneceu fechado após pequena rolagem; a busca manteve nookabc com cursor na posição 7. No viewport de 390 × 844 não houve overflow horizontal. A abertura completa foi medida novamente em 2669 ms. Ao fazer alterações futuras, repita esses casos. No navegador embutido, o teste foi limitado a viewport, não aparelho físico. Um erro separado de MutationObserver também foi reproduzido em uma página estática com iframe e sem scripts do Nook; não atribua esse aviso automaticamente ao aplicativo nem esconda erros reais.

Foram conferidos os nove capítulos e o retorno, um painel ativo por vez, controles de mídia/configurações no celular, reações do Nib e ausência do erro de hidratação do print na página recarregada. Os sete testes de seleção/sincronização dos downloads e o build passaram. HyperFrames passou check na marca e no laboratório; o MP4 da marca foi atualizado para 2 s a 60 fps.

O aplicativo nativo é desenvolvido em outro repositório privado. Este repositório público contém o site e os instaladores. Não copie fontes privadas, credenciais ou dados de contas para cá. Os exemplos da demonstração são fictícios. Preserve a sincronização dos releases públicos.

## Arquivos principais

- site/app/nib-journey.js: coordenadas, busca reversível da timeline e posse do Nib.
- site/app/scroll-controller.js: rolagem, navegação, exemplos e integração com a demonstração.
- site/app/nook-motion.js: marca, handoff, texto e reações compartilhadas com HyperFrames.
- site/app/text-motion.js: IntersectionObserver e revelação dos títulos.
- site/app/landing.jsx e site/app/native-motion.css: apresentação, notches e área de companhia.
- site/app/opening.js: abertura, montagem e limite de três segundos.
- site/app/product-motion.js: controles e transições da simulação nativa.
- site/nook-intro/: composição HyperFrames editável e revisão atual.

## Comandos

```sh
git pull --ff-only
cd site
npm ci
node scripts/sync-motion.mjs
npm run dev
```

Validação: npm test e npm run build. A publicação de main dispara o projeto Vercel nook-site; confira o SHA do deploy antes de afirmar que está atualizado. Os caminhos C:/developer e os processos localhost da máquina anterior não são necessários para continuar.

Na conferência de publicação, foi corrigido um clique atravessando o notch compacto: abrir em pointerenter removia o botão antes do clique e podia atingir uma aba do iframe. A demonstração recolhida agora abre por clique, toque ou teclado, mantendo o alvo estável. Repetido com movimento normal e reduzido: recolhe, reabre e mantém Música selecionada. Sete testes e build passaram após a correção.
