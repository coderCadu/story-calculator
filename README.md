# Story Calculator

Aplicação web para calcular valor de sprint com base na calculadora já existente no repositório.

## Como executar

1. Use o nvm para instalar a versão correta do Node.js:
    - Instale o nvm seguindo as instruções em [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)
    - Quando existir um arquivo `.nvmrc` no projeto, ao utilizar o comando abaixo o nvm irá automaticamente instalar e usar a versão correta do Node.js especificada no arquivo

```bash
nvm use
```
2. Instale dependências do Node.js com `npm install`
3. Inicie o servidor local:

```bash
npm run dev
```

4. Abra `http://localhost:3000` no navegador.

Campos da página:

- Quantidade de desenvolvedores
- Horas de desenvolvimento por dia
- Pontos totais da história
- Valor de cada ponto
- Refinamento técnico em horas
- Quantidade de desenvolvedores no RNF

## Testes

Testes unitários e de arquitetura (`node --test`):

```bash
npm test
```

Testes end-to-end (funcionais e de regressão visual, via Playwright): sobem `server.js`, abrem a página num Chromium headless, preenchem o formulário e conferem os valores calculados, além de comparar screenshots com os baselines em `e2e/app.spec.js-snapshots/`.

```bash
npx playwright install --with-deps chromium   # primeira vez
npm run test:e2e
```

Ao alterar a UI intencionalmente, atualize os baselines com `npm run test:e2e -- --update-snapshots` e faça a geração preferencialmente dentro da mesma imagem usada no CI (`mcr.microsoft.com/playwright:v1.62.1-noble`), para evitar diffs por diferença de renderização de fontes entre sistemas operacionais.

## Integração contínua

O workflow `.github/workflows/ci.yml` roda em push/PR e tem dois jobs: `unit-tests` (`npm test`) e `e2e-tests` (Playwright, dentro do container oficial do Playwright para bater com os screenshots de referência). Em falha dos testes E2E, o relatório HTML e os artefatos de diff ficam disponíveis como artifact do workflow.

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

A interface usa Vue 3 carregado via CDN (jsDelivr), fixado em `3.5.32` (consulte `package.json` para a referência da dependência), sem exigir um pipeline de build adicional. Ao atualizar o Vue, atualize também a versão fixada na URL de import em `app.js` (e, se necessário, em `package.json`).

## Deploy na Vercel

O projeto é um site estático (`index.html`, `app.js`, `styles.css`). O `vercel.json` na raiz já configura o deploy sem build step. Basta importar o repositório na Vercel — nenhuma variável de ambiente ou configuração adicional é necessária.
