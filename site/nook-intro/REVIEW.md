# Revisão atual do Nook

Abertura: marca vetorial de 2 s, Nib no N com tchau e salto direto para o k. O site usa os vetores após a hidratação e a mesma timeline do HyperFrames. A montagem completa foi medida no navegador em 2667 ms; há limite global de 3 s. O MP4 de referência foi atualizado para 2 s a 60 fps. Sem áudio por intenção.

Percurso: notches estacionários nas nove seções, sem a caixa externa. Uma única timeline por par de destinos é buscada pela rolagem em coordenadas do documento, inclusive na volta. O painel anterior recolhe, o Nib salta e o seguinte abre. O último destino é a área “Seu dia tem companhia”. As reações de trabalho, atenção, conclusão e descanso usam timelines finitas e controles reais. Títulos revelados por palavras, respeitando movimento reduzido.

Hidratação: o SVG da abertura não faz parte do HTML inicial a ser comparado com o cliente. O site e a demonstração declaram tema próprio por darkreader-lock. No navegador recarregado, os atributos data-darkreader-inline-fill dos SVGs não estavam presentes e não surgiu a mensagem de hidratação relatada no print. Não há supressão genérica do aviso.

Um erro diferente de MutationObserver também foi reproduzido no navegador embutido em uma página estática com iframe e sem scripts da aplicação. Esse controle foi arquivado em .local/hop-evidence e retirado da pasta pública; não é atribuído à animação do Nook. A ausência desse aviso de ambiente não é critério alegado de aprovação do site.

O laboratório HyperFrames é uma composição representativa com os mesmos helpers; não é gravação do site ou do aplicativo macOS. A conferência do produto real usa ações e capturas no navegador, incluindo navegação pelas nove seções e retorno. A base de medidas e curvas nativas foi lida no código do Mac; não se alega comparação visual quadro a quadro com macOS.
## Fechamento em 26/11/2026

Movimento reduzido conferido no navegador: intro liberada diretamente, nenhum título invisível, troca entre Música/Estante concluída e recolhimento/reabertura funcionais. Movimento normal: o clique direto no controle recolhe e a pequena rolagem mantém o estado fechado; o painel reabre, a busca preserva nookabc/cursor 7/foco e configurações/downloads fecham por Escape. No viewport 390 × 844, recolher e reabrir passaram sem overflow; o estado Descansando atualizou tarefa, expressão e mensagem.

A inversão com a roda do mouse foi observada de jumping/travel/zero painéis ativos para idle/notch/Música/um painel ativo. A abertura completa mediu 2669 ms no fechamento. O ensaio por viewport não equivale a aparelho físico; não há alegação de teste no macOS nativo. As pendências de recolhimento manual e preferência reduzida foram encerradas.

Na conferência de publicação, foi corrigido um clique atravessando o notch compacto: abrir em pointerenter removia o botão antes do clique e podia atingir uma aba do iframe. A demonstração recolhida agora abre por clique, toque ou teclado, mantendo o alvo estável. Repetido com movimento normal e reduzido: recolhe, reabre e mantém Música selecionada. Sete testes e build passaram após a correção.
