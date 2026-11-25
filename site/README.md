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

O componente React em `app/showcase.jsx` controla a simulação por `postMessage`, validando origem e janela. As imagens e fontes são locais; não há dependência de serviços de imagem ou fonte externos durante a visita.

## Direção visual e recursos

O design acompanha o Nook: fundo obsidiana, acento lilás, notch junto à borda superior e linguagem direta. O produto interativo ocupa a posição principal; as funcionalidades são exploradas por abas, situações de exemplo e controles reais da simulação.

Manrope está distribuída sob a licença OFL em `public/fonts/OFL-Manrope.txt`. O papel de parede original `public/wallpaper.png` foi gerado com OpenAI ImageGen: paisagem panorâmica de montanhas e pinheiros, em tons discretos de cinza e lavanda, sem interface ou texto. O logotipo e os desenhos do Nib fazem parte da identidade do Nook. Veja também os avisos de terceiros na raiz.

Todo o material do Nook permanece com os direitos reservados indicados na raiz. A publicação do site e dos instaladores não concede uma licença de código aberto para os aplicativos.
