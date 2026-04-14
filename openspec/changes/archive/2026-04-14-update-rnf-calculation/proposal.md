## Why

A fórmula atual de cálculo de RNF (Requisitos Não Funcionais) está baseada em 30% do esforço com refinamento da história (`refinedStoryEffort * 0.30`). Esta abordagem gera valores de RNF que crescem proporcionalmente ao tamanho da história, mas não reflete adequadamente a realidade operacional onde o RNF deve ser uma reserva fixa baseada na capacidade diária do time.

Esta mudança alinha o cálculo de RNF com a capacidade diária do time, tornando o RNF uma reserva operacional previsível independentemente do tamanho da história.

## What Changes

- Alterar a fórmula de cálculo de horas de RNF de `refinedStoryEffort * 0.30` para `dailyCapacity * 0.30`
- Manter o arredondamento de horas de RNF para inteiro mais próximo
- Manter o cálculo de dias de RNF usando a nova base de horas de RNF
- Atualizar validações e testes para refletir a nova fórmula
- Atualizar labels e descrições de fórmulas nos contratos de saída

## Capabilities

### Modified Capabilities

- `sprint-value-calculation`: A fórmula de RNF agora usa capacidade diária como base ao invés de esforço com refinamento, tornando o RNF uma reserva fixa por dia de trabalho ao invés de proporcional ao tamanho da história.

### New Capabilities

- None.

## Impact

- Código afetado: domínio de cálculo de sprint (`sprintValueCalculator.js`), contratos de saída (`sprintCalculationContracts.js`)
- APIs/contratos: o campo `rnfHours` terá valores diferentes para as mesmas entradas históricas
- Testes: testes de aceitação e unitários precisam ser atualizados com novos valores esperados
- Sistemas: todas as estimativas existentes terão valores de RNF diferentes se recalculadas
- Usuários: mudança visível nos resultados de RNF exibidos na interface
