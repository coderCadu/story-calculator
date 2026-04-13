## Context

O projeto precisa transformar regras de cálculo já prototipadas no Stitch MCP em uma implementação de produção consistente, extensível e fácil de testar. O estado atual não possui domínio formal, contratos de aplicação ou separação entre regra de negócio e detalhes de entrega (UI/API).

Restrições e direcionadores:

- Reutilizar a mesma regra de cálculo em múltiplos canais (UI, API, automações) sem duplicação.
- Garantir alta coesão de regras de domínio e baixo acoplamento com frameworks.
- Preservar DRY, SOLID, dependency inversion e clean architecture ao longo da implementação.

## Goals / Non-Goals

**Goals:**

- Definir arquitetura em camadas com domínio independente de infraestrutura.
- Especificar contratos de entrada e saída para cálculo de tempo de sprint.
- Formalizar validação de entrada e políticas de erro determinísticas.
- Permitir evolução de fórmulas e parâmetros sem quebrar consumidores.
- Viabilizar testes unitários de domínio e aplicação sem dependências externas.

**Non-Goals:**

- Construir interface visual final nesta change.
- Definir persistência histórica de cálculos nesta etapa.
- Otimizações avançadas de performance além de complexidade linear simples.
- Integração com serviços externos que não sejam necessários para o cálculo central.

## Decisions

### Decisão 1: Arquitetura limpa por camadas com dependências apontando para dentro

- Escolha: organizar em Domain, Application e Adapters/Infrastructure.
- Racional: mantém regra de cálculo isolada e reutilizável, reduz acoplamento e facilita testes.
- Alternativas consideradas:
  - Estrutura monolítica por feature sem portas explícitas: mais rápida no início, porém tende a acoplar regras e I/O.
  - Service layer único com utilitários globais: simples, mas aumenta risco de violar DRY e SOLID com o crescimento.

### Decisão 2: Use case explícito para cálculo de sprint

- Escolha: implementar um caso de uso principal (`CalculateSprintTime`) com contrato de input/output.
- Racional: centraliza orquestração, validação e aplicação de regras em um ponto previsível.
- Alternativas consideradas:
  - Expor funções utilitárias diretamente para UI/API: reduz ceremony inicial, mas espalha regras e validações.

### Decisão 3: Fórmula e regras de negócio no domínio com objetos de valor

- Escolha: representar parâmetros centrais (ex.: capacidade da equipe, esforço total, fator de foco, dias úteis) como value objects com invariantes.
- Racional: previne estados inválidos e favorece semântica explícita.
- Alternativas consideradas:
  - Usar tipos primitivos em toda a stack: menor esforço imediato, maior risco de erros e duplicação de validações.

### Decisão 4: Portas para entrada/saída e tratamento de erros

- Escolha: definir interfaces para adaptadores de entrega e um modelo de erro de domínio/aplicação padronizado.
- Racional: facilita troca de canais (CLI/API/UI) sem alterar núcleo de cálculo.
- Alternativas consideradas:
  - Erros livres por exceção sem contrato: flexível, porém inconsistente para consumidores.

### Decisão 5: Estrutura de testes alinhada às camadas

- Escolha: testes unitários para domínio e caso de uso, com poucos testes de integração por adaptador.
- Racional: cobertura alta das regras críticas com custo baixo de manutenção.
- Alternativas consideradas:
  - Foco apenas em testes end-to-end: maior custo, feedback mais lento e depuração mais difícil.

## Risks / Trade-offs

- [Risco] Divergência entre regra prototipada no Stitch e regra implementada. -> Mitigação: criar cenários de aceitação que reflitam explicitamente os casos do protótipo.
- [Risco] Excesso de abstrações iniciais aumentar complexidade. -> Mitigação: manter apenas portas necessárias para o caso de uso atual e evoluir incrementalmente.
- [Risco] Ambiguidade de termos de negócio (tempo, esforço, capacidade) gerar cálculo inconsistente. -> Mitigação: glossário no domínio e contratos com nomenclatura inequívoca.
- [Trade-off] Mais estrutura arquitetural no início reduz velocidade de prototipação imediata. -> Mitigação: templates simples e foco em um único fluxo principal primeiro.

## Migration Plan

1. Introduzir esqueleto de camadas e contratos sem alterar consumidores existentes.
2. Implementar o caso de uso `CalculateSprintTime` com validações e regras do protótipo.
3. Conectar um adaptador inicial (ex.: serviço de aplicação) para consumo externo.
4. Migrar chamadas antigas para o novo contrato.
5. Remover lógica duplicada legada após validação funcional.

Rollback:

- Manter temporariamente o fluxo legado atrás de feature flag ou roteamento de adaptador até validar equivalência dos resultados.

## Open Questions

- Quais campos do protótipo Stitch são mandatórios versus opcionais no input inicial?
- Qual política oficial para arredondamento de tempo (para cima, bancário, casas decimais)?
- O resultado deve trazer somente tempo final ou também métricas intermediárias explicáveis?
- Há necessidade de internacionalização de unidades (dias/horas) já nesta fase?
