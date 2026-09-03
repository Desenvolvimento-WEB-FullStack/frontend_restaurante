# Pontos de atenção / débitos técnicos

Observações levantadas na leitura do código em 2026-09-03. Úteis como
checklist para próximas mudanças — não são bloqueantes, mas valem correção.

## Bugs / inconsistências

- **Typo `Bearen` em vez de `Bearer`** no header `Authorization`, presente em
  quase toda chamada autenticada (`Mesas.tsx`, `Pedidos.tsx`, `Chefs.tsx`,
  `PedidosItems/Item.tsx`, e no `fecharPedido` de `PedidosItems.tsx`).
  A única chamada correta (`Bearer`) é `buscarDadosPedidoAtual` em
  `PedidosItems.tsx:72`. Se a API validar o valor do prefixo, isso pode estar
  quebrando autenticação nessas chamadas.
- **Data hardcoded** em `Mesas.tsx` (`criarPedido`): `data: "2026-08-26"` no
  lugar da data atual.
- **Filtros "Todos/Abertos/Finalizados" em `Pedidos.tsx`** existem na UI mas
  não têm `onClick`/estado associado — não filtram nada.
- **Itens do pedido mockados em `Pedidos.tsx`**: a listagem de itens dentro de
  cada card de pedido é fixa ("2x Coxinha" repetido), não vem de
  `pedido.items` da API.
- **`Chefs.tsx` exibe `chef.criado_em` na coluna "Nome"** (`TableCell` da
  primeira coluna usa `chef.criado_em` em vez de `chef.nome`).
- **`somar(num1, num2)` em `Mesas.tsx`** — função de teste/depuração sem
  tipagem, chamada uma vez (`somar(10, 20)`) sem uso do resultado. Parece
  código esquecido, candidato a remoção.
- **`generateRandomColor.ts`** não é importado/usado em nenhuma página atual.
- **`src/services/` está vazia** — não há camada de API centralizada; toda
  chamada duplica base URL e headers manualmente em cada página.

## Tratamento de erro

- `Login.tsx` acessa `error.response.data.error` sem checar o tipo do erro
  (axios error) nem fazer fallback — se a request falhar por rede (sem
  `response`), essa leitura lança exceção não tratada.
- `Mesas.tsx` e `PedidosItems.tsx` (`fecharPedido`) usam `alert(...)` genérico
  em catch, sem mostrar a mensagem real de erro da API (inconsistente com o
  uso de `Swal.fire` no restante do fluxo).
- Nenhuma página trata estado de loading nas listagens (`Mesas`, `Pedidos`,
  `PedidosItems`, `Chefs`) — `Loading` só é usado no botão de login.

## Tipagem

- `Pedidos.tsx` usa `useState([])` sem tipo genérico e acessa
  `pedido.mesa.nome`, `pedido.nome_cliente`, `pedido.fechado`, `pedido.total`
  sem interface declarada (diferente do padrão tipado usado em
  `PedidosItems.tsx`/`Mesas.tsx`/`Chefs.tsx`).
- `Login.tsx` tipa o handler como `React.SubmitEvent` (não existe esse tipo em
  `@types/react` — o correto seria `React.FormEvent<HTMLFormElement>`); pode
  estar compilando por `any` implícito ou erro de tipo silenciado.
- `.map((mesa) => ...)`/`.map((pedido) => ...)`/`.map((item) => ...)` em
  listas renderizadas sem `key` em alguns pontos (`Pedidos.tsx` item de
  pedido `<div>`, `PedidosItems.tsx` `<li>` do resumo) — React vai reclamar em
  runtime (warning de `key` ausente).

## Autenticação / segurança

- Sem guard de rota: qualquer rota (`/mesas`, `/pedidos`, etc.) é acessível
  diretamente pela URL mesmo sem login prévio; a página só vai falhar ao
  chamar a API sem token válido.
- `dadosLocalStorage` é lido **uma única vez no escopo do módulo** (fora do
  componente) em cada página — se o token mudar/expirar durante a sessão sem
  reload de página, o valor em memória fica desatualizado.
- Botão de logout no `Menu` (ícone `FaDoorOpen`) não tem `onClick` — não limpa
  o `localStorage` nem redireciona.
