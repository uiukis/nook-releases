# Revisão da abertura curta

A correção final usa o N da própria marca. O Nib sai dela, pousa no N, dá tchau e salta direto para o k. Apenas “ook” é revelado; não há um segundo N nem quatro pulos. O vídeo termina em 1,6 s.

Medido: MP4 silencioso de 1,600 s, 1920 × 1080, 60 fps e 86.576 bytes. HyperFrames passou lint, runtime e layout sem erros. Foram inspecionados os frames de saída da logo, tchau no N, salto e pouso no k. O laboratório separado exercita os mesmos helpers da landing. A posição final compartilhada é (1000, 374), com tamanho 96.

Aviso mantido: frame zero vazio por intenção, para o aparecimento da logo. Há um poster local com a marca. No laboratório, três instâncias da mesma imagem representam Nib em casa, viajando e reagindo; duplicação de imagem é intencional, não há áudio duplicado.

A fonte única das timelines é app/nook-motion.js. sync-motion.mjs prepara a cópia usada pelo HyperFrames; não se edita a cópia gerada manualmente. A página usa a mesma geometria para assumir o Nib na saída do vídeo e montar o hero sem trocar de personagem.

Sem som por intenção. O site continua interativo. Pular, Escape, movimento reduzido, economia de dados, deep links, resize e falha de mídia liberam o conteúdo.

## Revisão dos movimentos do produto

A abertura curta permanece intacta. O laboratório de 5,8 s agora demonstra a chegada inicialmente oculta, abertura, duas trocas direcionais, recolhimento e reabertura com os mesmos helpers do site. O painel aberto usa 740 × 320 e o compacto 360 × 36, com caminho SVG contínuo. Tempos e curvas foram comparados com o código nativo do Mac, sem publicar fontes do aplicativo privado.

Conferência no navegador: nove abas, navegação rápida sem camadas residuais, painel sem recolher nas trocas, janelas de configurações e Nib, botão de download e Escape, busca preservando texto/cursor, retorno ao início e movimento reduzido. Revisão responsiva em 1280 × 720 e 390 × 844; controles Nib/configurações mantêm áreas de toque separadas. A reprodução do laboratório usa dados representativos; não é uma gravação do navegador nem do aplicativo no Mac.
