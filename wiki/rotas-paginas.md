# Rotas e páginas

Definidas em `src/App.tsx` com `react-router` (`<Routes>`/`<Route>`).
O componente `<Menu>` é exibido em todas as rotas exceto `/` (login).

| Rota | Componente | Arquivo | Descrição |
|---|---|---|---|
| `/` | `Login` | `src/pages/Login/Login.tsx` | Formulário de e-mail/senha. `POST /auth/login`, salva resposta em `localStorage["@dadoslogin"]`, navega para `/mesas`. |
| `/mesas` | `Mesas` | `src/pages/Mesas/Mesas.tsx` | Lista mesas (`GET /mesas`) em grade. Clicar numa mesa livre abre modal MUI para informar nome do cliente e criar pedido (`POST /pedidos`); clicar numa mesa com `pedido_atual_id` navega direto para `/pedido-items/:id`. |
| `/mesas/nova` | `CadastroMesa` | `src/pages/CadastroMesa/CadastroMesa.tsx` | Formulário de cadastro de mesa (`nome`, `quantidade_lugares`). `POST /mesas`, navega para `/mesas` no sucesso. |
| `/pedido-items/:id` | `PedidosItems` | `src/pages/PedidosItems/PedidosItems.tsx` | Tela principal de montagem do pedido: lista o cardápio (`GET /items-cardapio`) à esquerda e o resumo do pedido atual (`GET /pedidos/:id`) à direita. Botão "Fechar pedido" chama `PUT /pedidos/:id/fechar` (com confirmação via SweetAlert2) e volta para `/mesas`. Cada item do cardápio é renderizado por `Item` (`src/pages/PedidosItems/Item.tsx`), que controla sua própria quantidade e faz `POST /items-pedidos` ao clicar em "Adicionar". |
| `/pedidos` | `Pedidos` | `src/pages/Pedidos/Pedidos.tsx` | Lista todos os pedidos (`GET /pedidos`) com nome da mesa, cliente, status (aberto/fechado) e total. Botões "Todos/Abertos/Finalizados" existem na UI mas **sem filtro implementado**. Os itens do pedido exibidos na listagem são mockados/fixos ("2x Coxinha"), não vêm da API. |
| `/chefes` | `Chefs` | `src/pages/Chefs/Chefs.tsx` | Tabela MUI com chefs (`GET /chefs`): nome/especialização/faz sobremesa. |

## Fluxo principal do usuário

1. Login (`/`) → salva token/role no `localStorage`.
2. Mesas (`/mesas`) → escolhe mesa livre → informa cliente → cria pedido → vai para `/pedido-items/:id`.
3. Monta o pedido adicionando itens do cardápio.
4. Fecha o pedido → volta para `/mesas`.
5. Acompanha pedidos em `/pedidos` e o quadro de chefs em `/chefes`.
