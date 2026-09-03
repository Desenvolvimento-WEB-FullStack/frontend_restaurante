---
name: farejador-de-bug
description: Analisa o código em busca de vulnerabilidades de segurança e violações de clean code (nomes ruins, funções/arquivos inchados, duplicação, complexidade desnecessária, acoplamento, código morto). Apenas relata — não corrige nada sozinho. Use quando o usuário pedir para "farejar bug", "checar segurança", "revisar clean code" ou algo parecido neste projeto.
---

# Farejador de bug

Skill de auditoria: varre o código em busca de **vulnerabilidades de
segurança** e **violações de clean code**, e devolve um relatório. Não edita
nada — quem decide o que fazer com cada achado é o usuário.

## 1. Definir o escopo

Por padrão, analise as alterações pendentes no repositório (staged + não
staged), rodando `git status` e `git diff` / `git diff --staged`.

Exceções:
- Se o usuário pedir explicitamente para analisar **o projeto inteiro**, um
  arquivo, pasta ou PR específico, use esse escopo em vez do diff.
- Se não houver nenhuma alteração pendente e o usuário não tiver pedido outro
  escopo, avise disso e pergunte se quer que a varredura seja no projeto
  inteiro em vez do diff (não rode uma varredura completa sem essa
  confirmação, pode ser cara/demorada).

## 2. O que procurar

### Segurança
- Segredos/credenciais hardcoded (tokens, senhas, chaves de API, URLs com
  credenciais embutidas).
- Injeção (SQL, comando de shell, HTML/XSS) por concatenação de input não
  sanitizado.
- Uso inseguro de `eval`/`Function`/`dangerouslySetInnerHTML` ou equivalente.
- Dados sensíveis logados ou expostos no client sem necessidade.
- Falta de validação em fronteiras de confiança (input do usuário, resposta
  de API externa) quando isso abre uma vulnerabilidade real (não é para
  sugerir validação defensiva genérica sem risco concreto).
- Autenticação/autorização ausente ou fraca em fluxos que deveriam ser
  protegidos.
- Dependências ou padrões conhecidos por serem inseguros (ex.: `http` puro
  para dados sensíveis, CORS liberado demais, cookies sem `httpOnly`/`secure`
  quando aplicável).

### Clean code
- Nomes de variáveis/funções que não comunicam intenção.
- Funções/componentes/arquivos fazendo coisa demais (baixa coesão).
- Duplicação de lógica que deveria ser uma função/hook compartilhado.
- Complexidade desnecessária (aninhamento profundo, condicionais que dá para
  simplificar, abstração prematura).
- Código morto: imports não usados, funções nunca chamadas, blocos
  comentados esquecidos.
- Inconsistência com o padrão já estabelecido no restante do projeto (ex.:
  ver [wiki/visao-geral.md](../../../wiki/visao-geral.md) e
  [wiki/pontos-atencao.md](../../../wiki/pontos-atencao.md) se existirem,
  para não repetir débitos técnicos já mapeados nem contradizer convenções
  documentadas).

Não é uma revisão de estilo (formatação, ponto e vírgula, etc.) — isso é
trabalho de linter, não desta skill. Foque em problemas reais de segurança e
manutenibilidade, não em preferência estética.

## 3. Relatório

Para cada achado, reporte:
- **Arquivo:linha**
- **Categoria**: `segurança` ou `clean-code`
- **Severidade**: crítica / alta / média / baixa
- **O que é o problema** (1-2 frases)
- **Cenário de risco ou impacto concreto** (para segurança: como isso pode
  ser explorado; para clean code: que dor isso causa na prática — bug futuro,
  dificuldade de manter, etc.)

Ordene do mais severo para o menos severo. Se não encontrar nada relevante,
diga isso claramente em vez de forçar achados triviais.

Ao final, **não aplique nenhuma correção** — apenas pergunte ao usuário se
ele quer que algum achado específico seja corrigido agora.
