# Story Calculator

Aplicação web para calcular valor de sprint com base na calculadora já existente no repositório.

## Como executar

1. Instale dependências do Node.js com `npm install`
2. Inicie o servidor local:

```bash
npm run dev
```

3. Abra `http://localhost:3000` no navegador.

Campos da página:

- Quantidade de desenvolvedores
- Horas de desenvolvimento por dia
- Pontos totais da história
- Valor de cada ponto
- Refinamento técnico em horas
- Quantidade de desenvolvedores no RNF

## Testes

```bash
npm test
```

## Direção visual Stitch

A página foi construída com base na tela do projeto Stitch MCP `18046564442301055737` e segue estes tokens e padrões:

- Fundo escuro: `#0e0e0e`
- Superfícies em camadas: `surface`, `surface-container`, `surface-container-high` e `surface-container-highest`
- Acento primário: `#c59aff`
- Acento secundário/dim: `#934eeb`
- Cartões com bordas suaves e sem divisórias rígidas
- CTA com gradiente de `primary` para `primary-dim`
- Tipografia Inter com títulos grandes e contraste alto

<img width="3334" height="1798" alt="image" src="https://github.com/user-attachments/assets/3ed377db-e375-4323-81a8-6549030a4a41" />

## Estrutura

- `index.html`: página principal
- `styles.css`: tokens visuais e layout responsivo
- `app.js`: aplicação Vue e renderização dos resultados
- `server.js`: servidor HTTP local para preview

## Dependência de UI

A interface usa Vue 3 carregado localmente a partir de `node_modules`, sem exigir um pipeline de build adicional.
