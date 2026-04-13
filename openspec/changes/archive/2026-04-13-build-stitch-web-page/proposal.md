## Why

O projeto já possui regras de cálculo implementadas, mas ainda não oferece uma página web para uso direto por produto e engenharia. Criar a interface com base na tela do Stitch MCP do projeto 18046564442301055737 reduz retrabalho visual e acelera a entrega de uma experiência consistente com o design aprovado.

## What Changes

- Criar uma página web de calculadora de sprint inspirada na tela do Stitch MCP "Sprint Calculator Dark".
- Aplicar o tema visual do projeto Stitch (paleta escura, acento vibrante, hierarquia tonal e cartões sem divisórias rígidas).
- Conectar formulário de entrada da página ao caso de uso existente de cálculo de sprint.
- Exibir todos os resultados nomeados e fórmulas intermediárias no layout web.
- Adicionar estados de erro e validação para entradas inválidas com mensagens claras.
- Garantir responsividade para desktop e mobile mantendo a linguagem visual da tela de referência.

## Capabilities

### New Capabilities

- `stitch-sprint-web-page`: Capability para renderizar uma página web funcional baseada na tela Stitch, consumindo o motor de cálculo já existente e exibindo entradas, resultados e validações.

### Modified Capabilities

- `sprint-value-calculation`: Expõe contrato estável para consumo pela UI web sem alteração de regra de negócio.

## Impact

- Código afetado: camada de apresentação web (HTML/CSS/JS), integração com adaptador de cálculo e mapeamento de erros para interface.
- APIs/contratos: reutilização do contrato de entrada/saída existente da calculadora, sem mudança de fórmulas.
- Dependências: possível inclusão de ferramenta de dev server/build para servir a página durante desenvolvimento.
- Sistemas: alinhamento entre protótipo Stitch e implementação real no navegador.
