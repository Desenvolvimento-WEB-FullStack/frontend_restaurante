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

Não há backend neste repositório. O front consome uma API REST cuja URL base
vem da env var `VITE_URL_API` (definida em `.env.local`), usada em
`axios.create` dentro de `src/services/api.ts` — ver
[integracao-api.md](./integracao-api.md).

## Autenticação

Não há contexto/estado global de autenticação (sem Context API, Redux, Zustand
etc.). Todas as páginas usam o client centralizado `src/services/api.ts`, que
tem um interceptor de request injetando automaticamente
`Authorization: Bearer <token>` a partir do `localStorage`. Além disso, o
padrão em todas as páginas protegidas é:

```ts
const dadosLocalStorage = getDataLocalStorage(); // lido no escopo do módulo, fora do componente
```

`getDataLocalStorage()` (`src/utils/getDataLocalStorage.ts`) lê e faz parse da
chave `@dadoslogin` do `localStorage`, populada no login (`src/pages/Login/Login.tsx`)
com a resposta de `POST /auth/login` (contém `token` e `role`, entre outros).
As rotas exceto `/` são protegidas pelo componente `RotaPrivada`
(`src/components/RotaPrivada/RotaPrivada.tsx`), que redireciona para `/` via
`<Navigate>` quando `getDataLocalStorage()` não retorna dados. É apenas uma
checagem de presença no `localStorage` — não valida expiração/veracidade do
token.

## Convenções observadas

- Nomes de variáveis, funções e textos de UI em **português**.
- Uma pasta por página em `src/pages/<Nome>/`, com `Nome.tsx` +
  `Nome.module.css` própios.
- Tipos de domínio (ex.: `Mesa`, `Chef`, `ItemCardapio`, `PedidoItem`,
  `DadosPedido`) são declarados localmente em cada arquivo que os usa — não há
  uma pasta `types/` compartilhada nem geração de tipos a partir da API.
- Sem estado global/gerenciador de estado: cada página busca seus próprios
  dados via `useEffect` + o client `api` (`src/services/api.ts`) diretamente
  no componente.
- Camada de serviço centralizada em `src/services/api.ts` (`axios.create` +
  interceptor de `Authorization`); cada página importa esse client e chama só
  o path relativo (ex.: `api.post("mesas", {...})`).
