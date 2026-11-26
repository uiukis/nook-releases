# Nook — abertura e percurso do Nib

Identidade mantida: carvão #151618, lilás #d6c5f6, Bricolage Grotesque e Instrument Sans locais.

A marca dura 2 s, 1920 × 1080 a 60 fps. A logo original aparece; o Nib sai, pousa no N e dá tchau; apenas “ook” surge ao lado do N. O personagem salta direto para o k. A coreografia original roda a 80% da velocidade e segura o último quadro até 2 s. A montagem do conteúdo dura aproximadamente 0,71 s; um limite global de 3 s também libera a página em caso de atraso.

O percurso entre seções usa a posição de rolagem e coordenadas do documento. Cada par de destinos fornece uma timeline normalizada de 0 a 1. O painel anterior recolhe no começo, o personagem percorre o arco e o novo painel abre nos 22% finais. O relógio é reversível e não depende de animações anteriores. Os estados de descanso entre os saltos permitem ler e usar cada painel.

Cada seção tem uma borda discreta e um notch compacto. A área final recebe o personagem ampliado e apresenta uma atividade fictícia, com reações finitas a cinco humores. Títulos entram por palavras com deslocamento de 14 px, duração de 0,48 s e intervalo de 0,035 s. Preferência de movimento reduzido aplica os estados finais diretamente.

Fonte única das timelines: app/nook-motion.js. sync-motion.mjs gera a cópia do HyperFrames e os vetores da abertura. Os vetores são montados no cliente após hidratação; não se comparam SVGs alterados por extensões ao HTML do servidor. O laboratório de 5,8 s demonstra ida e volta entre dois notches usando o mesmo helper handoff. Sem áudio por intenção.