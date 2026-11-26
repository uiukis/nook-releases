# Revisão da abertura curta

A correção final usa o N da própria marca. O Nib sai dela, pousa no N, dá tchau e salta direto para o k. Apenas “ook” é revelado; não há um segundo N nem quatro pulos. O vídeo termina em 1,6 s.

Medido: MP4 silencioso de 1,600 s, 1920 × 1080, 60 fps e 86.576 bytes. HyperFrames passou lint, runtime e layout sem erros. Foram inspecionados os frames de saída da logo, tchau no N, salto e pouso no k. O laboratório separado exercita os mesmos helpers da landing. A posição final compartilhada é (1000, 374), com tamanho 96.

Aviso mantido: frame zero vazio por intenção, para o aparecimento da logo. Há um poster local com a marca. No laboratório, três instâncias da mesma imagem representam Nib em casa, viajando e reagindo; duplicação de imagem é intencional, não há áudio duplicado.

A fonte única das timelines é app/nook-motion.js. sync-motion.mjs prepara a cópia usada pelo HyperFrames; não se edita a cópia gerada manualmente. A página usa a mesma geometria para assumir o Nib na saída do vídeo e montar o hero sem trocar de personagem.

Sem som por intenção. O site continua interativo. Pular, Escape, movimento reduzido, economia de dados, deep links, resize e falha de mídia liberam o conteúdo.

## Abertura vetorial e demonstração móvel pela página

O site agora executa os próprios vetores e `brandIntro` da composição. O MP4 continua disponível como exportação, mas não é carregado na abertura: elimina-se a camada opaca de vídeo durante a passagem para o conteúdo. A montagem também deixa de recortar o palco e o texto; usa opacidade e deslocamento. As fontes locais ficam prontas antes de iniciar. O destino final do Nib é medido sem a transformação provisória do palco, evitando um salto na troca para o personagem interativo.

O laboratório de 5,8 s foi atualizado para demonstrar duas seções alternadas, com o mesmo helper `travel` de 0,55 s, trocas direcionais de conteúdo, recolhimento e reabertura. A landing mantém um único iframe, posicionado por transformação em espaços reservados no documento; não fixa o notch ao topo. Abaixo de 1100 px a demonstração fica entre a descrição e os exemplos. Janelas usam o viewport inteiro com deslocamento compensado em ambos os eixos. O vídeo do laboratório é uma composição representativa; a verificação do site real usa capturas e ações no navegador.

## Revisão dos movimentos do produto

A abertura curta permanece intacta. O laboratório de 5,8 s agora demonstra a chegada inicialmente oculta, abertura, duas trocas direcionais, recolhimento e reabertura com os mesmos helpers do site. O painel aberto usa 740 × 320 e o compacto 360 × 36, com caminho SVG contínuo. Tempos e curvas foram comparados com o código nativo do Mac, sem publicar fontes do aplicativo privado.

Conferência no navegador: nove abas, navegação rápida sem camadas residuais, painel sem recolher nas trocas, janelas de configurações e Nib, botão de download e Escape, busca preservando texto/cursor, retorno ao início e movimento reduzido. Revisão responsiva em 1280 × 720 e 390 × 844; controles Nib/configurações mantêm áreas de toque separadas. A reprodução do laboratório usa dados representativos; não é uma gravação do navegador nem do aplicativo no Mac.
