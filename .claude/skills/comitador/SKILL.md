---
name: comitador
description: Analisa as alterações pendentes no repositório, verifica brevemente a qualidade do código (bugs óbvios/erros de sintaxe), commita com mensagem objetiva, faz push da branch atual e — mediante confirmação do usuário — abre um pull request no GitHub com um relatório das mudanças na descrição. Use quando o usuário pedir para "comitar", "commitar", "subir o código", "dar push" ou "abrir PR" neste projeto.
---

# Comitador

Skill de fechamento de trabalho: revisa, commita, faz push e (com confirmação)
abre PR no GitHub. Siga os passos nesta ordem, sem pular etapas.

## 1. Levantar o estado atual

Rode em paralelo:
- `git status`
- `git diff` (não staged) e `git diff --staged` (já staged, se houver)
- `git log --oneline -10` (estilo das mensagens de commit do repo)
- `git branch --show-current`

Se não houver nenhuma alteração (staged, não staged ou untracked relevante),
avise o usuário que não há nada para commitar e pare aqui.

## 2. Revisão breve de qualidade

Antes de commitar, leia o diff completo (arquivos alterados e novos) e
procure especificamente por:

- Erros de sintaxe óbvios (parênteses/chaves não fechados, imports quebrados,
  tipos claramente inválidos).
- Bugs evidentes: variável não definida, lógica invertida, `console.log`/
  `debugger` esquecido, credenciais ou segredos expostos, código morto
  comentado deixado por engano.
- Nada além disso — esta não é uma revisão completa de arquitetura ou estilo,
  é uma checagem rápida de "isso vai quebrar o build ou tem um erro claro".

Se encontrar algo suspeito ou um problema real:
- **Não commite.** Apresente ao usuário um relatório curto (arquivo, linha
  aproximada, o que parece errado) e pergunte como proceder (corrigir agora,
  ignorar e commitar mesmo assim, ou não commitar). Aguarde a decisão antes de
  continuar.

Se o diff estiver limpo, siga para o próximo passo sem perguntar nada.

## 3. Commit

- Monte a mensagem de commit em português, curta e objetiva, no padrão
  imperativo (ex.: "adiciona X", "corrige Y", "ajusta Z"), coerente com o
  estilo dos commits recentes (`git log`) e refletindo o *porquê*/*o quê* real
  da mudança — não uma lista mecânica de arquivos.
- Adicione os arquivos relevantes por nome (nunca `git add -A`/`.` sem
  checagem — reveja `git status` antes para não incluir arquivos que não
  deveriam ir, como `.env`, credenciais, artefatos de build).
- Crie o commit com a mensagem via heredoc, terminando com:
  ```
  Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
  ```
- **Nunca** use `--no-verify` ou pule hooks. Se um hook de pre-commit falhar,
  corrija a causa raiz, re-adicione os arquivos e crie um **novo** commit
  (nunca `--amend` depois de uma falha de hook).
- Rode `git status` depois para confirmar que o commit foi criado com
  sucesso.

## 4. Push

- Verifique se a branch atual já tem upstream configurado
  (`git rev-parse --abbrev-ref --symbolic-full-name @{u}` ou
  `git status -sb`).
- Faça `git push` (ou `git push -u origin <branch>` se ainda não houver
  upstream) da branch atual.
- **Nunca** force push sem pedido explícito do usuário.

## 5. Perguntar antes de abrir o PR

Depois do push bem-sucedido, **pare e pergunte ao usuário** se deseja abrir o
pull request agora. Não abra o PR automaticamente — esse passo exige
confirmação explícita, mesmo que o resto da skill rode sem interrupção.

Se o usuário confirmar, **pergunte também qual é a branch alvo (base) do PR**
antes de criar qualquer coisa. Sugira `develop` como padrão (branch alvo
padrão deste projeto), mas deixe explícito que o usuário pode escolher outra
(ex.: `main`, uma branch de release/staging). Confirme que `develop` existe no
remoto antes de sugeri-la (`git ls-remote --heads origin develop`); se não
existir, avise e peça a branch correta. Não presuma a base sem essa
confirmação.

## 6. Abrir o pull request (somente após confirmação)

Se o usuário confirmar e informar a branch alvo:

- Use a branch alvo escolhida pelo usuário como base do PR (`--base <branch>`
  no `gh pr create`).
- Reveja **todos** os commits que entrarão no PR (não só o último):
  `git log <base>..HEAD --oneline` e `git diff <base>...HEAD`.
- Título curto (até ~70 caracteres), objetivo, descrevendo a mudança
  principal.
- Corpo do PR usando `gh pr create --title "..." --body "$(cat <<'EOF' ... EOF)"`
  contendo um **pequeno relatório** das funcionalidades adicionadas/alteradas,
  no formato:

  ```markdown
  ## Resumo
  - <funcionalidade/mudança 1 — o que muda e por quê, em 1 linha>
  - <funcionalidade/mudança 2>
  - ...

  ## Detalhes
  <2-4 frases explicando o essencial da mudança para quem for revisar: o que
  foi adicionado, alterado, corrigido, e qualquer impacto relevante (ex.:
  novas dependências, rotas, endpoints, comportamento de UI).>

  ## Teste
  [Checklist markdown do que foi/deveria ser testado]

  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  ```

- Ao final, devolva a URL do PR criado para o usuário.

Se o usuário recusar abrir o PR, pare depois do push e informe que o código
está commitado e enviado, mas o PR não foi aberto.
