# Visão geral

Front-end de um sistema de gestão de restaurante ("Sabor & Arte"): login de
funcionário, visualização de mesas, montagem de pedido a partir do cardápio,
listagem de pedidos e quadro de chefs.

## Stack

- **React 19** + **TypeScript**, bundler **Vite 8**
- **react-router 7** (`BrowserRouter`, componentes `Routes`/`Route`)
- **axios** para chamadas HTTP diretas (sem client/wrapper próprio)
- **@mui/material** (+ `@emotion/react`, `@emotion/styled`) para alguns
  componentes (Dialog, Table, Chip) — usado de forma pontual, o resto da UI é
  CSS Modules puro
- **sweetalert2** para alertas/confirmações (`Swal.fire`)
- **react-icons** para ícones (`react-icons/fa`, `react-icons/gi`)
- CSS Modules (`*.module.css`) por componente/página, mais um
  `src/index.module.css` global e `src/styles/reset.css`

## Scripts (`package.json`)

- `dev` — `vite`
- `build` — `tsc -b && vite build`
- `lint` — `eslint .`
- `preview` — `vite preview`

Gerenciador de pacotes: `yarn` (campo `packageManager` fixado).

## Backend

Não há backend neste repositório. O front consome uma API REST em
`http://localhost:8888` (hardcoded em cada chamada axios — ver
[integracao-api.md](./integracao-api.md)). Presume-se um projeto separado
rodando localmente nessa porta durante o desenvolvimento.

## Autenticação

Não há contexto/estado global de autenticação (sem Context API, Redux, Zustand
etc.). O padrão em todas as páginas protegidas é:

```ts
const dadosLocalStorage = getDataLocalStorage(); // lido no escopo do módulo, fora do componente
```

`getDataLocalStorage()` (`src/utils/getDataLocalStorage.ts`) lê e faz parse da
chave `@dadoslogin` do `localStorage`, populada no login (`src/pages/Login/Login.tsx`)
com a resposta de `POST /auth/login` (contém `token` e `role`, entre outros).
Não há rotas protegidas de fato (nenhum guard/redirect caso não exista token).

## Convenções observadas

- Nomes de variáveis, funções e textos de UI em **português**.
- Uma pasta por página em `src/pages/<Nome>/`, com `Nome.tsx` +
  `Nome.module.css` própios.
- Tipos de domínio (ex.: `Mesa`, `Chef`, `ItemCardapio`, `PedidoItem`,
  `DadosPedido`) são declarados localmente em cada arquivo que os usa — não há
  uma pasta `types/` compartilhada nem geração de tipos a partir da API.
- Sem estado global/gerenciador de estado: cada página busca seus próprios
  dados via `useEffect` + `axios` diretamente no componente.
- Sem camada de serviço/API centralizada: `src/services/` existe mas está
  vazia; toda chamada usa `axios` diretamente na página, repetindo a URL base
  e o header de `Authorization`.
