## Why

O cálculo de valor e duração de sprint precisa ser padronizado com regras claras para evitar estimativas inconsistentes entre times. Esta mudança formaliza as fórmulas operacionais e o RNF de 30% com regras de arredondamento explícitas para tornar os resultados auditáveis e reproduzíveis.

## What Changes

- Adicionar cálculo de capacidade diária com base em quantidade de desenvolvedores e horas de desenvolvimento por dia.
- Adicionar cálculo de esforço total da história usando pontos totais da história e valor por ponto (poker Fibonacci).
- Incluir refinamento técnico padrão de 26 horas no esforço total para obter esforço com refinamento.
- Calcular número de dias necessários com arredondamento para cima.
- Calcular RNF como 30% do esforço com refinamento e arredondar horas de RNF para inteiro mais próximo.
- Calcular dias de RNF considerando 2 desenvolvedores por padrão.
- Exibir cada valor calculado com seu respectivo nome, incluindo valores intermediários e finais.

## Capabilities

### New Capabilities

- `sprint-value-calculation`: Define regras normativas para calcular capacidade diária, esforço total, esforço com refinamento técnico, dias necessários, horas de RNF e dias de RNF com nomes explícitos para cada resultado.

### Modified Capabilities

- None.

## Impact

- Código afetado: domínio de cálculo de sprint, contratos de entrada/saída e camada de apresentação de resultados nomeados.
- APIs/contratos: inclusão de campos para parâmetros de entrada e resultados intermediários/finais, além de política de arredondamento.
- Dependências: nenhuma dependência externa obrigatória para o núcleo de cálculo.
- Sistemas: padronização de estimativa para uso por UI, API e fluxos operacionais internos.
