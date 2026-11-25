# Revisão da abertura

Logo original do Nook, palavra revelada a partir da lateral do ícone, salto do Nib com preparação e contato. Fundo carvão e lilás #d6c5f6, sem flash, trilha ou looping. O site monta o hero enquanto transporta o Nib do ponto final do vídeo para o palco real.

Medido: 2,800 s, 1920 × 1080, 30 fps, MP4 H.264 silencioso de aproximadamente 103 KB. HyperFrames check passou lint, runtime e layout sem erros. Frames em 0,3 / 0,8 / 1,45 / 2,3 / 2,716 s foram inspecionados; uma folha adicional foi decodificada do MP4 final.

Aviso mantido: o frame zero é vazio. É uma abertura de página com aparecimento da logo, e não uma miniatura social; o poster local já mostra a logo. Não há espera artificial após o arquivo terminar.

O ponto mais delicado é a passagem do vídeo para o Nib real. O site calcula object-fit: contain para mapear as coordenadas finais e usa a posição real do palco no navegador. Resize interrompe a abertura com segurança. Pular, Escape, movimento reduzido, economia de dados, deep links e falha de mídia liberam o conteúdo.

O arquivo não tem áudio por intenção. O estudo anterior de scroll não faz parte deste vídeo; o scroll continua interativo em GSAP.
