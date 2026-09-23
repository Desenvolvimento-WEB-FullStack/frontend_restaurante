# Integração com a API

Base URL vem da env var `VITE_URL_API` (definida em `.env.local`, ex.:
`https://api2.sistemadigitais.com.br`), usada em `axios.create({ baseURL: ... })`
dentro do client centralizado `src/services/api.ts`.

Todas as páginas importam esse `api` (não `axios` diretamente) e chamam só o
path relativo, ex.: `api.post("mesas", {...})`.

## Autenticação

Injetada automaticamente por um interceptor de request em `src/services/api.ts`:

```ts
config.headers.Authorization = `Bearer ${dados.token}`;
```

`dados` vem do parse de `localStorage["@dadoslogin"]` (setado no login). O
typo `Bearen` que existia em versões anteriores (chamadas manuais por página)
foi eliminado com a centralização nesse client — ver
[pontos-atencao.md](./pontos-atencao.md).

## Endpoints consumidos

| Método | Endpoint | Usado em | Auth | Observações |
|---|---|---|---|---|
| `POST` | `/auth/login` | `Login.tsx` | não | Body `{ email, senha }`. Resposta salva inteira em `localStorage["@dadoslogin"]`. |
| `GET` | `/mesas` | `Mesas.tsx` | sim | Retorna `Mesa[]`. |
| `POST` | `/mesas` | `CadastroMesa.tsx` | sim | Body `{ nome, quantidade_lugares }`. Cadastra uma nova mesa. |
| `POST` | `/pedidos` | `Mesas.tsx` | sim | Body `{ mesa_id, nome_cliente, data }`. **`data` é fixa em `"2026-08-26"`** (hardcoded, não usa a data atual). Retorna o pedido criado (`id` usado para navegar). |
| `GET` | `/pedidos/:id` | `PedidosItems.tsx` | sim | Retorna `DadosPedido` (inclui `mesa`, `items[]`, `subTotal`). |
| `GET` | `/items-cardapio` | `PedidosItems.tsx` | sim | Retorna `ItemCardapio[]`. |
| `POST` | `/items-cardapio` | `Cardapio.tsx` | sim | Body `{ nome, preco, tipo, porcoes, tamanho, vegetariano, descricao }`. Cadastra um novo item do cardápio; não navega, apenas limpa o formulário no sucesso. |
| `PUT` | `/pedidos/:id/fechar` | `PedidosItems.tsx` | sim | Body vazio `{}`. Fecha o pedido. |
| `POST` | `/items-pedidos` | `PedidosItems/Item.tsx` | sim | Body `{ pedido_id, quantidade, item_cardapio_id }`. Adiciona item ao pedido; após sucesso reseta quantidade e chama `refresh()` (recarrega `/pedidos/:id`). |
| `GET` | `/pedidos` | `Pedidos.tsx` | sim | Retorna lista de pedidos com `mesa`, `nome_cliente`, `fechado`, `items[]`, `total`. |
| `GET` | `/chefs` | `Chefs.tsx` | sim | Retorna `Chef[]` (`nome`, `especializacao`, `faz_sobremesa`). |

## Tipos de domínio (declarados localmente, não compartilhados)

- **Mesa**: `id, nome, quantidade_lugares, reservado, criado_em, atualizado_em, pedido_atual_id`
- **ItemCardapio**: `id, nome, preco, tipo, porcoes, tamanho ("P"|"M"|"G"), vegetariano, descricao, criado_em, atualizado_em`
- **PedidoItem**: `id, pedido_id, item_cardapio_id, quantidade, criado_em, atualizado_em, itemCardapio`
- **DadosPedido**: `id, nome_cliente, mesa_id, fechado, data, total, criado_em, atualizado_em, mesa, items[], subTotal`
- **Chef**: `id, nome, faz_sobremesa, especializacao, criado_em, atualizado_em`

`preco`/`total` chegam como `string` da API e são convertidos com `Number(...)`
antes de passar por `formatMoney` (`src/utils/formatMoney.ts`, usa
`Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`).
