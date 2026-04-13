## Context

O sistema precisa incluir cálculos normativos para determinar valor operacional de sprint com base em capacidade diária do time, esforço total da história, refinamento técnico fixo e reserva de RNF. As regras devem refletir os exemplos fornecidos e manter arquitetura limpa, DRY, SOLID e dependency inversion para facilitar manutenção e evolução.

## Goals / Non-Goals

**Goals:**

- Definir um fluxo único de cálculo com entradas explícitas: quantidade de devs, horas por dia, pontos da história e valor por ponto.
- Garantir cálculo de resultados intermediários e finais com nomes obrigatórios para exibição.
- Padronizar arredondamentos: dias necessários com teto e RNF em horas com arredondamento para inteiro.
- Formalizar regra de RNF em 30% do esforço com refinamento e cálculo de dias RNF com 2 devs.
- Preservar separação entre domínio, aplicação e adaptadores para reuso em UI/API.

**Non-Goals:**

- Definir layout de interface final.
- Implementar persistência histórica de simulações.
- Adicionar múltiplos modelos de refinamento técnico além do padrão de 26 horas nesta change.

## Decisions

### Decisão 1: Pipeline de cálculo determinístico e ordenado

- Escolha: executar sempre nesta ordem: capacidade diária -> esforço total -> esforço com refinamento -> dias necessários -> horas RNF -> dias RNF.
- Racional: evita divergência de fórmulas e facilita rastreabilidade dos valores exibidos.
- Alternativas consideradas:
  - Cálculos independentes por módulo: aumenta risco de inconsistência e duplicação.

### Decisão 2: Regras de negócio explícitas no domínio

- Escolha: manter as fórmulas no domínio com objetos de valor e validações de entrada.
- Racional: garante coesão e independência de framework.
- Alternativas consideradas:
  - Colocar fórmulas na camada de apresentação: viola DIP e dificulta testes.

### Decisão 3: Política de arredondamento separada por métrica

- Escolha: dias necessários da história usam arredondamento para cima; RNF horas usa arredondamento para inteiro mais próximo; dias RNF usam arredondamento para inteiro mais próximo conforme exemplo operacional.
- Racional: preserva comportamento esperado no exemplo e evita interpretação ambígua no consumo.
- Alternativas consideradas:
  - Aplicar teto para todas as métricas: não reproduz o exemplo de dias RNF.

### Decisão 4: Contrato de saída nomeado

- Escolha: retorno deve expor cada valor com seu nome, fórmula aplicada e resultado final.
- Racional: aumenta auditabilidade e reduz erro de interpretação por times de produto/engenharia.
- Alternativas consideradas:
  - Retornar somente resultado final de dias: perde transparência dos cálculos.

### Decisão 5: Constantes configuráveis por política

- Escolha: refinamento técnico padrão (26h), percentual RNF (30%) e devs RNF (2) definidos como políticas com defaults.
- Racional: facilita futura mudança sem alterar assinatura principal do caso de uso.
- Alternativas consideradas:
  - Constantes hardcoded em múltiplos pontos: quebra DRY e aumenta risco de drift.

## Risks / Trade-offs

- [Risco] Interpretação distinta de arredondamento para dias RNF em integrações futuras. -> Mitigação: documentar regra no contrato e cobrir com testes de aceitação.
- [Risco] Entradas inválidas (zero ou negativas) produzirem divisões inválidas. -> Mitigação: validação estrita antes de qualquer cálculo.
- [Trade-off] Exibir fórmulas e resultados intermediários amplia payload de saída. -> Mitigação: manter estrutura padronizada e leve.

## Migration Plan

1. Introduzir contratos de input/output do cálculo na camada de aplicação.
2. Implementar serviço de domínio com as fórmulas definidas.
3. Conectar adaptador de apresentação para exibir valores nomeados.
4. Cobrir com testes unitários e de aceitação usando os exemplos fornecidos.
5. Ativar novo fluxo e remover lógica duplicada anterior, se houver.

Rollback:

- Manter adaptador anterior disponível por feature flag enquanto a equivalência for validada.

## Open Questions

- Devemos permitir sobrescrever refinamento técnico padrão por requisição em versões futuras?
- Para dias RNF, a política deve permanecer arredondamento para inteiro mais próximo em todos os cenários ou virar configurável?
