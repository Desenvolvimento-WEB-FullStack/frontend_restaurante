# Pontos de atenção / débitos técnicos

Observações levantadas na leitura do código em 2026-09-03. Úteis como
checklist para próximas mudanças — não são bloqueantes, mas valem correção.

## Bugs / inconsistências

- ~~Typo `Bearen` em vez de `Bearer`~~ Corrigido: a autenticação agora é
  injetada por um único interceptor em `src/services/api.ts`, com o prefixo
  `Bearer` correto em todas as chamadas.
- **Data hardcoded** em `Mesas.tsx` (`criarPedido`): `data: "2026-08-26"` no
  lugar da data atual.
- ~~Filtros "Todos/Abertos/Finalizados" em `Pedidos.tsx` sem `onClick`~~
  Corrigido: `Pedidos.tsx` tem `filtroStatus` com `onClick` funcional nos três
  botões.
- ~~Itens do pedido mockados em `Pedidos.tsx`~~ Corrigido: a listagem usa
  `pedido.items` vindo da API.
- ~~`Chefs.tsx` exibe `chef.criado_em` na coluna "Nome"~~ Corrigido: a coluna
  usa `chef.nome`.
- **`somar(num1, num2)` em `Mesas.tsx`** — função de teste/depuração sem
  tipagem, chamada uma vez (`somar(10, 20)`) sem uso do resultado. Parece
  código esquecido, candidato a remoção. *(não reverificado nesta rodada —
  confirmar antes de remover)*
- **`generateRandomColor.ts`** não é importado/usado em nenhuma página atual.
  *(não reverificado nesta rodada)*
- ~~`src/services/` está vazia~~ Corrigido: `src/services/api.ts` centraliza
  `axios.create` (baseURL via `VITE_URL_API`) + interceptor de
  `Authorization`; todas as páginas (incluindo a nova `Cardapio.tsx`) usam
  esse client.

## Tratamento de erro

- ~~`Login.tsx` acessa `error.response.data.error` sem checar o tipo do
  erro~~ Corrigido: agora usa `axios.isAxiosError(error)` antes de ler
  `error.response?.data?.error`, com `mensagem` podendo ficar `undefined` em
  vez de lançar exceção.
- `Mesas.tsx` e `PedidosItems.tsx` (`fecharPedido`) usam `alert(...)` genérico
  em catch, sem mostrar a mensagem real de erro da API (inconsistente com o
  uso de `Swal.fire` no restante do fluxo).
- Nenhuma página trata estado de loading nas listagens (`Mesas`, `Pedidos`,
  `PedidosItems`, `Chefs`) — `Loading` só é usado no botão de login.

## Tipagem

- ~~`Pedidos.tsx` usa `useState([])` sem tipo genérico~~ Corrigido: agora usa
  `useState<Pedido[]>([])` com interfaces `Pedido`/`PedidoItem`/`ItemCardapio`
  declaradas no arquivo.
- `Login.tsx` (e as páginas geradas a partir dela, como `Cardapio.tsx`) tipam
  o handler como `React.SubmitEvent` (não existe esse tipo em `@types/react`
  — o correto seria `React.FormEvent<HTMLFormElement>`); pode estar
  compilando por `any` implícito ou erro de tipo silenciado.
- `.map((mesa) => ...)`/`.map((pedido) => ...)`/`.map((item) => ...)` em
  listas renderizadas sem `key` em alguns pontos (`Pedidos.tsx` item de
  pedido `<div>`, `PedidosItems.tsx` `<li>` do resumo) — React vai reclamar em
  runtime (warning de `key` ausente).

## Autenticação / segurança

- ~~Sem guard de rota~~ Corrigido: `src/components/RotaPrivada/RotaPrivada.tsx`
  envolve as rotas protegidas (`/mesas`, `/mesas/nova`, `/pedido-items/:id`,
  `/pedidos`, `/chefes`) em `App.tsx` e redireciona para `/` via `<Navigate>`
  quando `getDataLocalStorage()` não retorna dados. Continua sendo apenas uma
  checagem de presença no `localStorage`, não de validade/expiração do token.
- `dadosLocalStorage` é lido **uma única vez no escopo do módulo** (fora do
  componente) em cada página — se o token mudar/expirar durante a sessão sem
  reload de página, o valor em memória fica desatualizado.
- Botão de logout no `Menu` (ícone `FaDoorOpen`) não tem `onClick` — não limpa
  o `localStorage` nem redireciona.
