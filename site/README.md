# Site do Nook

Landing page e demonstração interativa pública. Os aplicativos nativos são desenvolvidos em um repositório privado separado.

## Desenvolvimento

Requer Node.js 22 ou 24 e npm.

```sh
cd site
npm ci
npm run dev
```

`npm test` verifica a seleção de downloads. `npm run build` gera o site estático em `out/`. O projeto Vercel `nook-site` usa o framework Next.js e a pasta raiz `site`, com publicação de `main` em <https://nook-notch-beta.vercel.app/>. O workflow **Site** verifica testes e build sem consumir armazenamento de artefatos do GitHub.

## Publicar versões

1. Gere os aplicativos no repositório privado e confira os pacotes.
2. Crie uma release neste repositório público, com os binários `Nook-win-x64-Setup.exe`, `Nook-win-arm64-Setup.exe` e/ou `Nook-macOS.dmg`. Inclua `SHA256SUMS.txt` com os hashes dos instaladores anunciados.
3. No rótulo de cada pacote, informe a versão real do aplicativo, por exemplo `macOS 0.12.0-beta`. Isso é obrigatório quando o conteúdo do pacote Mac muda; a versão não é presumida a partir de uma release de Windows.
4. Publique a release. **Sync release downloads** consulta somente os assets públicos deste repositório, valida endereço, tamanho e digest SHA-256, e atualiza `data/releases.json`. A alteração em `main` publica o site pelo vínculo Git da Vercel.

Releases de Windows podem manter o último pacote Mac verificado. Se um pacote Mac for republicado sem mudar, o digest preserva sua versão anterior. Releases incompletas, URLs de outro repositório ou assets sem digest interrompem a sincronização sem modificar os downloads publicados.

Também é possível executar **Sync release downloads → Run workflow** no GitHub ou `npm run sync-releases` localmente. `GH_TOKEN` é opcional para a consulta local e nunca é incluído no site. A sincronização não copia fontes, segredos ou instaladores do repositório privado e não cria novos binários.

## Demonstração

`public/preview/index.html` é uma simulação de interface com nove abas, seis seções de configurações e estados do Nib. Os estados de erro, carregamento, vazio, permissões e ações são exemplos. Nenhuma conta é conectada e nenhum comando de sistema é executado. As diferenças de disponibilidade entre macOS e Windows estão descritas no site.

`app/landing.jsx` contém a landing aprovada e seus nove capítulos. `app/scroll-controller.js` mantém o notch no topo, transporta o Nib ao entrar nos recursos e troca a simulação por `postMessage`, validando origem e janela. A volta ao início devolve o Nib ao palco. As imagens e fontes são locais; não há dependência de serviços de imagem ou fonte externos durante a visita.

## Direção visual e recursos

O design aprovado combina a composição da primeira proposta com o fundo carvão da terceira e o lilás `#d6c5f6` da primeira. O Nib pequeno ocupa o palco inicial; as funcionalidades aparecem no notch fixo conforme a página é percorrida. Cada capítulo tem situações de exemplo e controles reais da simulação.

Bricolage Grotesque e Instrument Sans são locais, sob OFL em `public/fonts/`. Manrope e o papel de parede anterior permanecem como recursos do projeto. O logotipo e os desenhos do Nib fazem parte da identidade do Nook. Veja também os avisos de terceiros na raiz.

## Abertura em HyperFrames

O projeto editável fica em `nook-intro/`, com roteiro em `SPEC.md` e revisão em `REVIEW.md`. HyperFrames 0.9.94 renderiza o Nib saindo da logo, dando tchau no N e saltando direto para o k em um MP4 silencioso de 1,6 segundo, 1920 × 1080 a 60 fps, aproximadamente 85 KB. O site entrega somente `public/motion/nook-intro.mp4` e seu poster, sem rodar HyperFrames no navegador.

`app/opening.js` mapeia o último Nib do vídeo para a posição real do palco, monta a página com GSAP e libera o scroll. Abertura pode ser pulada por botão ou Escape; preferência de movimento reduzido, economia de dados, deep links, falha de autoplay ou de mídia entram direto no conteúdo. Um limite de sete segundos evita bloqueio por vídeo travado. Não há loop.

Para editar, use as skills oficiais HyperFrames e a CLI 0.9.94. Com Node 22+ e FFmpeg disponíveis, abra uma prévia com `hyperframes preview --background`, execute `hyperframes check --json` e revise os snapshots antes de renderizar. A renderização final deve substituir `public/motion/nook-intro.mp4` e o poster. Se mudar o ponto final do Nib na composição, atualize também as coordenadas em `app/opening.js`.

Todo o material do Nook permanece com os direitos reservados indicados na raiz. A publicação do site e dos instaladores não concede uma licença de código aberto para os aplicativos.

As timelines da landing compartilham `app/nook-motion.js` com o HyperFrames: montagem, voo, abertura e troca de conteúdo do notch, navegação, hover e humores. `npm run build` sincroniza a cópia da composição antes de compilar. Para revisar esses movimentos no HyperFrames, execute `node scripts/prepare-motion-review.mjs`; o projeto de revisão será criado em `.local/nook-motion-review/`, sem alterar a abertura curta do site. A CLI permanece fixada em 0.9.94 para reprodutibilidade; a versão 0.9.96 está disponível.

O notch começa oculto e surge quando o Nib vai aos recursos. A superfície usa um caminho SVG contínuo, com encaixe superior, e as medidas do painel virtual do Mac: 740 × 320 aberto e 360 × 36 recolhido, adaptadas à largura disponível. Abre em 0,32 s e fecha em 0,24 s. Trocar de aba mantém a superfície aberta; o conteúdo desliza 18 px na direção da aba, com blur de 6 px e resposta de mola de 0,38 s. Esses valores foram conferidos no código nativo; a revisão no Windows não constitui comparação visual quadro a quadro com o aplicativo macOS.

`app/product-motion.js` aplica as timelines compartilhadas à demonstração: indicador de aba, conteúdo, configurações, Nib, notificações, seletores e retorno dos botões. Preserva o controle de texto focado durante atualizações, incluindo cursor e composição de entrada. As janelas usam temporariamente a área completa da página, mantendo o mesmo iframe e seus estados. Controles do topo têm áreas de toque separadas no celular. Preferência de movimento reduzido resolve as timelines diretamente no estado final; `?reduce-motion` permite conferir esse caminho.
