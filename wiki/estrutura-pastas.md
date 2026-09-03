# Estrutura de pastas

```
restaurante/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/               # imagens estáticas importadas no código (hero.png, logos)
│   ├── components/           # componentes reutilizáveis entre páginas
│   │   ├── Header/           # cabeçalho de página (título + descrição)
│   │   ├── Loading/          # spinner de carregamento (usado no botão de login)
│   │   └── Menu/             # menu de navegação lateral/topo (Mesas/Pedidos/Chefes + logout)
│   ├── pages/                # uma pasta por rota/tela
│   │   ├── Chefs/            # quadro de chefs (tabela MUI)
│   │   ├── Login/            # tela de login
│   │   ├── Mesas/            # grade de mesas + modal de abertura de pedido
│   │   ├── Pedidos/          # listagem de pedidos
│   │   └── PedidosItems/     # detalhe de um pedido: cardápio + resumo do pedido
│   │       └── Item.tsx      # card de item do cardápio dentro de PedidosItems
│   ├── services/              # (VAZIA) — reservada para uma camada de API, ainda não implementada
│   ├── styles/
│   │   └── reset.css          # reset global de CSS
│   ├── utils/
│   │   ├── formatMoney.ts          # formata número como moeda BRL (Intl.NumberFormat)
│   │   ├── generateRandomColor.ts  # gera cor hex aleatória (uso não identificado nas páginas atuais)
│   │   └── getDataLocalStorage.ts  # lê/faz parse de "@dadoslogin" do localStorage
│   ├── App.tsx                # define as rotas (react-router) e exibe <Menu/> condicionalmente
│   ├── main.tsx                # bootstrap: StrictMode + BrowserRouter + import dos CSS globais
│   └── index.module.css        # classes CSS globais reaproveitadas entre páginas (ex.: containerInput)
├── index.html
├── vite.config.ts              # config padrão do Vite (apenas plugin React), sem alias de path
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
└── package.json
```

## Padrão de cada página (`src/pages/<Nome>/`)

- `<Nome>.tsx` — componente da página.
- `<Nome>.module.css` — estilos exclusivos, importados como `styles`.
- Página busca seus dados via `axios` dentro de `useEffect(() => {...}, [])`.
- Usa `Header` (`src/components/Header/Header.tsx`) para título + descrição
  padronizados (exceto `Chefs`, que usa um `<h2>` solto em vez de `Header`).

## Componentes (`src/components/`)

| Componente | Responsabilidade |
|---|---|
| `Header` | Título + descrição de página, recebe `title`/`description` via props |
| `Menu` | Navegação principal (Mesas, Pedidos, Chefes) + exibe `role` do usuário logado + ícone de logout (sem handler de clique implementado) |
| `Loading` | Spinner CSS puro, usado apenas no botão "Entrar" do Login |
