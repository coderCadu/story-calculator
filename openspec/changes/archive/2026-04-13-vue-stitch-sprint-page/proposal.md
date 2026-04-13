## Why

A página atual precisa evoluir para uma implementação em Vue que siga as regras do restante do código e acompanhe a tela mais recente do Stitch MCP. A nova interface também precisa permitir personalização explícita do refinamento técnico e da quantidade de desenvolvedores participantes do RNF, atualizando os campos sempre que o usuário clicar em calcular.

## What Changes

- Criar uma página Vue para a calculadora de sprint com base na tela mais recente do Stitch MCP do projeto 18046564442301055737.
- Manter a linguagem visual dark premium já definida no projeto, com superfícies em camadas e CTA com gradiente.
- Adicionar campos editáveis para refinamento técnico e quantidade de desenvolvedores do RNF.
- Recalcular e atualizar todos os campos de resultado a cada clique em Calcular sprint.
- Exibir resultados intermediários e finais com labels claros e comportamento consistente com o motor de cálculo existente.
- Garantir que a UI continue sem duplicar regras de negócio fora da camada de cálculo compartilhada.

## Capabilities

### New Capabilities

- `vue-stitch-sprint-page`: Página em Vue para consumir o cálculo de sprint, aplicar a estética Stitch atualizada e permitir personalização de refinamento técnico e RNF.

### Modified Capabilities

- `sprint-value-calculation`: Ajusta o contrato de consumo para suportar personalização de refinamento técnico e RNF dev count na UI sem alterar a fórmula central.

## Impact

- Código afetado: camada Vue de apresentação, integração com o adaptador de cálculo e exibição de resultados.
- APIs/contratos: contrato de cálculo consumido pela UI para incluir parâmetros personalizáveis da tela.
- Dependências: inclusão de Vue como camada de front-end e possível tooling de build/dev server.
- Sistemas: alinhamento entre o protótipo Stitch mais recente, a UI Vue e o motor de cálculo existente.
