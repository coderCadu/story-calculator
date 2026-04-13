## Context

A base atual possui o motor de cálculo de sprint e testes, mas não possui interface web. O projeto Stitch 18046564442301055737 (Sprint Calculator Dark) define uma direção visual clara com tons escuros, acento violeta, profundidade por camadas de superfície e cartões sem linhas divisórias duras.

Stakeholders principais:

- Produto: precisa de página navegável para simulação rápida.
- Engenharia: precisa manter regras no domínio/aplicação e UI desacoplada.
- Design: precisa fidelidade visual ao conceito aprovado no Stitch.

## Goals / Non-Goals

**Goals:**

- Entregar uma página web funcional consumindo o cálculo já existente.
- Reproduzir a linguagem visual da tela Stitch (palette, hierarquia tonal, gradiente primário e cards).
- Exibir formulário, resultados nomeados, fórmulas e mensagens de erro de validação.
- Garantir experiência responsiva para desktop e mobile.
- Manter princípios de clean architecture: UI apenas orquestra I/O.

**Non-Goals:**

- Reescrever regras de cálculo de sprint.
- Criar backend dedicado para esta etapa.
- Implementar autenticação, persistência de histórico ou multiusuário.

## Decisions

### Decisão 1: Página estática com JavaScript modular

- Escolha: implementar com HTML/CSS/JS simples, importando o adaptador existente.
- Racional: entrega rápida, dependência mínima e baixo acoplamento.
- Alternativas consideradas:
  - Framework SPA completo: mais overhead para escopo inicial.

### Decisão 2: Tema baseado em tokens Stitch

- Escolha: definir variáveis CSS usando as cores do projeto Stitch (surface, surface-container, primary, primary-dim, on-surface).
- Racional: garante consistência visual e facilita ajustes sem alterar estrutura.
- Alternativas consideradas:
  - Estilo genérico sem tokens: maior risco de desvio visual.

### Decisão 3: Mapeamento explícito de contrato para UI

- Escolha: usar as chaves nomeadas do contrato de saída para montar cards de resultado.
- Racional: reduz duplicação e evita espalhar regras de apresentação.
- Alternativas consideradas:
  - Recalcular no front-end: viola DRY e pode divergir da regra oficial.

### Decisão 4: Responsividade mobile-first

- Escolha: layout com grid adaptável, cards empilhados em telas menores e áreas de ação acessíveis ao toque.
- Racional: amplia uso da ferramenta sem duplicar páginas.
- Alternativas consideradas:
  - Layout apenas desktop: compromete adoção e usabilidade.

### Decisão 5: Erros determinísticos na UI

- Escolha: exibir erros do contrato estruturado sem transformar códigos de domínio no adaptador.
- Racional: mantém separação de responsabilidades e previsibilidade.
- Alternativas consideradas:
  - Mensagens ad hoc geradas na UI: inconsistência entre canais.

## Risks / Trade-offs

- [Risco] Diferença visual entre Stitch e implementação final. -> Mitigação: usar tokens e regras visuais explicitadas no design system do projeto Stitch.
- [Risco] UI acumular lógica de negócio por conveniência. -> Mitigação: limitar UI a coleta de input, chamada do adaptador e renderização.
- [Trade-off] Solução sem framework reduz complexidade, mas exige disciplina manual de estrutura e testes de interação.

## Migration Plan

1. Criar estrutura web (HTML/CSS/JS) conectada ao adaptador atual.
2. Implementar formulário e renderização dos resultados nomeados.
3. Aplicar tema e componentes visuais alinhados ao Stitch.
4. Adicionar validação de fluxo e testes básicos de integração da UI.
5. Publicar instruções de execução local para equipe.

Rollback:

- Manter entrada por terminal/script disponível enquanto a UI web é validada.

## Open Questions

- Qual nível de fidelidade visual exigido na primeira entrega: pixel-perfect ou equivalência funcional/estética?
- A página deve incluir modo claro no futuro ou manter dark-only conforme referência Stitch?
