## Context

A aplicação já possui o motor de cálculo de sprint e uma página estática anterior, mas a nova entrega precisa ser implementada em Vue para seguir o pedido atual e reforçar a separação entre estado de interface e regra de negócio. A tela deve acompanhar a direção visual mais recente do Stitch MCP do projeto 18046564442301055737, incluindo a linguagem dark, camadas tonais, gradiente primário e cards sem divisórias rígidas.

Restrições e direcionadores:

- Manter o núcleo de cálculo fora da UI.
- Permitir edição de refinamento técnico e quantidade de devs no RNF antes de cada cálculo.
- Recalcular a partir dos valores mais recentes sempre que o usuário clicar em Calcular sprint.
- Evitar adicionar um pipeline de build pesado se uma solução Vue ESM local resolver o problema com menor acoplamento.

## Goals / Non-Goals

**Goals:**

- Implementar a interface em Vue com estado reativo claro e fácil de manter.
- Exibir campos adicionais para refinamento técnico e RNF developer count.
- Recalcular resultados a cada submissão usando os valores atuais do formulário.
- Preservar o contrato do motor de cálculo e expor apenas entrada/saída para a UI.
- Manter a estética Stitch e responsividade desktop/mobile.

**Non-Goals:**

- Reescrever as regras matemáticas do cálculo de sprint.
- Adicionar backend novo, autenticação ou persistência.
- Introduzir um sistema de componentes ou design system externo maior que o necessário.

## Decisions

### Decisão 1: Vue 3 com ESM browser build local

- Escolha: usar Vue 3 como dependência local e carregar o ESM browser build diretamente na página.
- Racional: entrega uma implementação Vue real sem impor um bundler ou pipeline de build desnecessário.
- Alternativas consideradas:
  - CDN público: mais simples, porém menos confiável para uso local/offline.
  - Vite imediato: mais robusto, mas adiciona custo de setup para o escopo atual.

### Decisão 2: Estado do formulário centralizado em um único componente raiz

- Escolha: manter todos os inputs e o resultado dentro de um componente Vue principal.
- Racional: reduz complexidade e facilita atualizar os campos a cada clique em Calcular sprint.
- Alternativas consideradas:
  - Vários componentes pequenos: aumenta boilerplate para uma tela única.

### Decisão 3: Política de cálculo passada explicitamente do UI para o adaptador

- Escolha: manter o motor de cálculo no domínio/application e permitir que a UI envie refinamento técnico e RNF developer count como política de execução.
- Racional: a UI pode personalizar parâmetros sem duplicar regras.
- Alternativas consideradas:
  - Recalcular valores customizados no front-end: viola DRY e risco de divergência.

### Decisão 4: Atualização por ação explícita do usuário

- Escolha: recalcular apenas quando o usuário clicar em Calcular sprint, usando os valores atuais do formulário.
- Racional: evita resultados intermediários confusos durante digitação e corresponde ao fluxo pedido.
- Alternativas consideradas:
  - Recalcular em cada evento de input: mais dinâmico, mas menos controlado e mais ruidoso.

### Decisão 5: Página estática servida por Node local

- Escolha: manter um servidor local simples para servir HTML, CSS, JS e o bundle ESM da dependência Vue.
- Racional: integra com o projeto atual sem forçar uma migração completa para Vite neste momento.
- Alternativas consideradas:
  - Build tool completo: melhor para escala, mas desnecessário para a primeira entrega Vue.

## Risks / Trade-offs

- [Risco] Importar Vue via ESM local pode exigir dependência instalada corretamente. -> Mitigação: incluir Vue em package.json e validar execução local com npm test/dev.
- [Risco] Sem bundler, a organização de arquivos precisa ser disciplinada. -> Mitigação: manter entrada única e contratos simples.
- [Risco] Atualizar o motor para aceitar política de execução pode exigir ajuste de contrato. -> Mitigação: limitar mudanças ao adaptador e ao contrato de entrada, preservando a regra central.
- [Trade-off] Solução leve reduz overhead, mas não traz otimizações de build avançadas imediatamente.

## Migration Plan

1. Adicionar Vue como dependência local e migrar a UI para um componente raiz reativo.
2. Ajustar o adaptador para receber política customizada de refinamento técnico e RNF developer count.
3. Renderizar o layout Stitch atualizado com os novos campos e cards de resultado.
4. Validar o fluxo com testes de contrato e páginas.
5. Se a necessidade crescer, evoluir para Vite depois da entrega funcional.

Rollback:

- A página pode voltar ao HTML/JS estático anterior sem alterar o motor de cálculo, caso a abordagem Vue precise ser revertida.

## Open Questions

- O valor de refinamento técnico deve continuar com default 26 ou a interface deve permitir alterar também o default de forma persistente?
- A implementação Vue deve ser mantida com ESM local ou vale migrar para Vite antes do merge final?
