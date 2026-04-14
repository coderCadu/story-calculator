## Context

O sistema atual calcula RNF (Requisitos Não Funcionais) como 30% do esforço com refinamento da história. Esta fórmula vincula o RNF ao tamanho da história, gerando valores variáveis. A nova abordagem calcula RNF como 30% da capacidade diária, tornando-o uma reserva operacional fixa por dia de trabalho, independente do tamanho da história.

## Goals / Non-Goals

**Goals:**

- Alterar a fórmula base de cálculo de horas de RNF de `refinedStoryEffort * 0.30` para `dailyCapacity * 0.30`
- Manter a política de arredondamento existente (arredondamento para inteiro mais próximo)
- Preservar o cálculo de dias de RNF usando a nova base de horas
- Atualizar labels de fórmulas nos contratos para refletir a mudança
- Garantir que todos os testes reflitam os novos valores esperados
- Manter a arquitetura limpa e separação de responsabilidades

**Non-Goals:**

- Alterar a política de arredondamento de RNF
- Modificar o cálculo de dias de RNF além da atualização da fonte de horas
- Alterar outros cálculos do pipeline (capacidade diária, esforço total, dias necessários)
- Adicionar configurações adicionais ou parâmetros opcionais

## Decisions

### Decisão 1: Nova base para RNF - capacidade diária

- Escolha: usar `dailyCapacity * 0.30` ao invés de `refinedStoryEffort * 0.30`
- Racional: RNF representa uma reserva operacional por dia de trabalho, não uma proporção do tamanho da história. A capacidade diária é uma métrica mais estável e previsível.
- Alternativas consideradas:
  - Manter fórmula atual: mantém dependência incorreta do tamanho da história
  - Usar entrada direta de horas de RNF: adiciona complexidade na interface e remove padronização

### Decisão 2: Manter política de arredondamento

- Escolha: continuar usando `Math.round()` para horas de RNF e dias de RNF
- Racional: política de arredondamento já validada e alinhada com requisitos operacionais
- Alternativas consideradas:
  - Alterar para teto ou piso: quebraria consistência com exemplos validados

### Decisão 3: Atualizar label da fórmula no contrato

- Escolha: alterar o campo `formula` em `rnfHours` de `"refinedStoryEffort * rnfPercentage (nearest integer)"` para `"dailyCapacity * rnfPercentage (nearest integer)"`
- Racional: mantém transparência e auditabilidade do cálculo
- Alternativas consideradas:
  - Não atualizar label: geraria confusão sobre como o valor foi calculado

### Decisão 4: Impacto nos testes existentes

- Escolha: atualizar todos os valores esperados nos testes de aceitação e unitários
- Racional: os testes devem refletir o comportamento correto da nova fórmula
- Alternativas consideradas:
  - Manter testes antigos com flag: adiciona complexidade desnecessária

## Implementation Details

### Mudanças no Domínio

**Arquivo:** `src/domain/services/sprintValueCalculator.js`

Alterar linha de cálculo de `rawRnfHours`:

```javascript
// De:
const rawRnfHours = truncateToTwoDecimals(
  refinedStoryEffort * policy.rnfPercentage,
);

// Para:
const rawRnfHours = truncateToTwoDecimals(
  dailyCapacity * policy.rnfPercentage,
);
```

Nenhuma outra alteração necessária no calculador domain.

### Mudanças nos Contratos

**Arquivo:** `src/application/contracts/sprintCalculationContracts.js`

Atualizar o campo `formula` no objeto `rnfHours`:

```javascript
rnfHours: {
  label: OUTPUT_LABELS.rnfHours,
  formula: "dailyCapacity * rnfPercentage (nearest integer)",  // atualizar aqui
  raw: values.rawRnfHours,
  value: values.roundedRnfHours,
}
```

### Mudanças nos Testes

**Arquivo:** `test/domain/sprintValueCalculator.test.js`

Atualizar valores esperados para `rawRnfHours` e `roundedRnfHours` em todos os testes que verificam cálculos de RNF.

**Arquivo:** `test/application/calculateSprintValue.acceptance.test.js`

Atualizar os valores esperados nos testes de aceitação para refletir a nova fórmula.

Exemplo de cálculo com nova fórmula:
- Entrada: 7 devs, 6h/dia, 55 pontos, 4 valor/ponto
- `dailyCapacity` = 7 * 6 = 42
- `rawRnfHours` = truncateToTwoDecimals(42 * 0.30) = 12.60
- `roundedRnfHours` = Math.round(12.60) = 13 (anteriormente era 74)
- `rnfDailyCapacity` = 2 * 6 = 12
- `rawRnfDays` = truncateToTwoDecimals(13 / 12) = 1.08
- `roundedRnfDays` = Math.round(1.08) = 1 (anteriormente era 6)

## Risks / Trade-offs

- [Risco] Valores históricos de RNF mudam dramaticamente com a nova fórmula - histórias grandes que antes tinham muito RNF agora terão valores menores e fixos. → Mitigação: documentar mudança claramente e validar com stakeholders antes de deploy.
- [Risco] Usuários podem estranhar a mudança nos valores exibidos. → Mitigação: comunicar mudança e justificativa aos times que usam o sistema.
- [Trade-off] RNF agora é fixo por dia, não escala com tamanho da história. → Benefício: previsibilidade e simplicidade operacional; Risk: pode não refletir complexidade adicional de histórias maiores.

## Migration Plan

1. Atualizar fórmula em `sprintValueCalculator.js`
2. Atualizar label de fórmula em `sprintCalculationContracts.js`
3. Atualizar todos os testes unitários com novos valores esperados
4. Atualizar testes de aceitação com novos valores esperados
5. Executar suite completa de testes para validar
6. Deploy com documentação da mudança

Rollback:

- Reverter commits específicos desta mudança se necessário
- Testes garantem que rollback restaura comportamento anterior

## Open Questions

- Os stakeholders validaram que RNF deve ser fixo por dia ao invés de proporcional ao tamanho da história?
- Precisamos adicionar alguma mensagem ou tooltip na UI explicando a mudança da fórmula?
