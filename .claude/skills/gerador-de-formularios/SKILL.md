---
name: gerador-de-formularios
description: Cria uma nova página em src/pages/ com um formulário, perguntando ao usuário campo a campo (input, select, textarea, checkbox etc.) e outras informações relevantes (nome da página, rota, endpoint), sempre com um botão submit associado a uma chamada axios post com um body genérico. Use quando o usuário pedir para "criar um formulário", "gerar uma tela de cadastro" ou algo parecido neste projeto.
---

# Gerador de formulários

Skill interativa: cria uma nova página com formulário em `src/pages/`,
seguindo os padrões já estabelecidos no projeto (ver
[wiki/estrutura-pastas.md](../../../wiki/estrutura-pastas.md) e
[wiki/visao-geral.md](../../../wiki/visao-geral.md)). **Não gere nenhum
arquivo antes de coletar as respostas do usuário** — esta skill é guiada por
perguntas, campo a campo.

## 1. Perguntas gerais sobre a página

Pergunte ao usuário (pode agrupar quando fizer sentido):

- **Nome da página** (ex.: `CadastroCliente`) — define a pasta
  `src/pages/<Nome>/`, o arquivo `<Nome>.tsx` e `<Nome>.module.css`.
- **Rota** (ex.: `/clientes/novo`) — será registrada em `src/App.tsx`.
- **Endpoint da API** para o POST (ex.: `/clientes`) — a base é
  `http://localhost:8888` (ver
  [wiki/integracao-api.md](../../../wiki/integracao-api.md)), hardcoded como
  nas demais páginas.
- Se a página deve usar o componente `Header` (título + descrição) — padrão
  usado pela maioria das páginas do projeto.
- Se deve navegar para alguma rota após o sucesso do submit (ex.:
  `navigate("/mesas")`, como faz o Login) e, se sim, para qual.
- Texto do botão de submit (ex.: "Cadastrar", "Salvar").

## 2. Perguntas campo a campo

Para cada campo do formulário, pergunte:

- **Nome do campo** — a chave que vai no body do POST (ex.: `nome`, `email`).
- **Label** — texto exibido ao usuário.
- **Tipo do campo** — apresente as opções:
  - `input` texto simples
  - `input` email
  - `input` número
  - `input` senha
  - `input` data
  - `select` (nesse caso, pergunte também as opções: rótulo + valor de cada
    uma)
  - `textarea`
  - `checkbox`
  - `radio` (pergunte também as opções do grupo)
  - outro tipo, se o usuário quiser especificar algo fora dessa lista
- Se o campo é **obrigatório**.
- **Placeholder**, quando fizer sentido para o tipo escolhido.

Repita até o usuário indicar que não há mais campos a adicionar. Não invente
campos que o usuário não pediu — inclua só os confirmados nesta etapa.

## 3. Confirmar antes de gerar

Resuma para o usuário: nome da página, rota, endpoint, texto do botão e a
lista de campos (nome, tipo, label, obrigatório, opções quando houver). Peça
confirmação explícita antes de escrever qualquer arquivo.

## 4. Gerar a página

Siga o padrão observado em `src/pages/Login/Login.tsx` e no restante do
projeto:

- Pasta `src/pages/<Nome>/` com `<Nome>.tsx` e `<Nome>.module.css`.
- Um `useState` por campo, com nome de variável em português coerente com o
  nome do campo (checkbox como `boolean`, os demais tipos texto como
  `string`).
- `useState` para `loading` (booleano).
- Uma função `async function <verbo><Nome>(event: React.SubmitEvent)`,
  nomeada em português (ex.: `cadastrarCliente`), que:
  1. `event.preventDefault()`
  2. `setLoading(true)`
  3. Faz o POST com um body genérico, usando as chaves definidas na etapa 2:
     ```ts
     const response = await axios.post("http://localhost:8888/<endpoint>", {
       campo1: campo1,
       campo2: campo2,
       // ...um por campo confirmado
     });
     ```
  4. Em caso de sucesso: `Swal.fire({ title: "...", icon: "success" })`
     (`sweetalert2`, padrão do projeto) e, se combinado na etapa 1,
     `navigate(...)`.
  5. Em caso de erro (`catch`): `setLoading(false)` e
     ```ts
     Swal.fire({
       title: error.response.data.error,
       icon: "error",
       showConfirmButton: false,
       timer: 3000,
     });
     ```
     igual ao que o Login faz.
- `<form onSubmit={...}>` com um bloco por campo, usando
  `stylesIndex.containerInput` (de `src/index.module.css`, importado como nas
  outras páginas) como container de label + campo, quando fizer sentido para
  o tipo:
  - `input` textual/email/número/senha/data → `<input type="...">` com o
    `type` correspondente.
  - `select` → `<select>` com um `<option>` por item informado.
  - `textarea` → `<textarea>`.
  - `checkbox` → `<input type="checkbox">` ligado ao estado booleano.
  - `radio` → grupo de `<input type="radio">` com o mesmo `name`, um por
    opção.
  - Marque `required` nos campos indicados como obrigatórios.
- Botão `type="submit"` que mostra `<Loading />`
  (`src/components/Loading/Loading.tsx`) quando `loading` for `true`, senão o
  texto combinado na etapa 1.
- Renderize `Header` no topo (com `title`/`description` combinados com o
  usuário) se ele confirmou isso na etapa 1.
- Crie `<Nome>.module.css` com uma classe de container básica, coerente com o
  restante do projeto — não precisa copiar o CSS do Login, só manter a mesma
  estrutura (container da página, algum espaçamento/botão).

## 5. Registrar a rota

Adicione o `import` de `<Nome>` e a `<Route path="<rota>" element={<Nome />} />`
em `src/App.tsx`, na posição que fizer sentido em relação às rotas já
existentes.

## 6. Atualizar a wiki

Depois de criar a página, acrescente uma linha na tabela de
[wiki/rotas-paginas.md](../../../wiki/rotas-paginas.md) e, se fizer sentido,
uma entrada em [wiki/estrutura-pastas.md](../../../wiki/estrutura-pastas.md),
conforme pedido no `CLAUDE.md` do projeto.

## 7. Resumo final

Ao final, informe ao usuário os arquivos criados/alterados e pergunte se ele
quer rodar o projeto (`yarn dev`) para conferir a tela.
