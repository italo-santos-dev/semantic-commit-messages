# Language and Style Guidelines

Guidelines for language selection, verb tenses, and multilingual commit conventions.

---

## 1. Default Language: English

In modern open source and professional software engineering, **English is the recommended default** for commit messages. It facilitates global collaboration, code reviews, and cross-team tooling.

### The Imperative Mood
Always write the commit description in the **imperative mood** (present tense command):

- ✅ `add user authentication endpoint` (think: *"If applied, this commit will..."*)
- ❌ `added user authentication endpoint` (past tense)
- ❌ `adds user authentication endpoint` (third-person singular)
- ❌ `adding user authentication endpoint` (gerund)

### Capitalization and Punctuation
- Start description with a **lowercase letter** (unless it begins with a proper noun or acronym like `JWT`, `OAuth`, `iOS`).
- Do **not** end the header description with a period (`.`).

---

## 2. Portuguese Language Guidelines (Diretrizes em Português)

Quando o projeto ou a equipe adotar o idioma Português nas mensagens de commit, mantenha a sintaxe padrão de tipos e escopos em inglês (para compatibilidade com linters e ferramentas SemVer), traduzindo a descrição para o imperativo:

### Regra do Imperativo em Português:
Utilize o verbo na 3ª pessoa do singular do imperativo afirmativo ou presente do indicativo:

| Ação em Inglês | Verbo Recomendado (PT) | Exemplo em Português |
| :--- | :--- | :--- |
| `add` | **adiciona** / **implementa** | `feat(auth): adiciona autenticação via JWT` |
| `fix` | **corrige** | `fix(checkout): corrige cálculo de cupom de desconto` |
| `update` | **atualiza** | `docs(readme): atualiza instruções de instalação` |
| `remove` / `delete` | **remove** | `chore(deps): remove biblioteca não utilizada` |
| `refactor` | **refatora** | `refactor(parser): refatora módulo de extração de tokens` |
| `optimize` | **otimiza** | `perf(query): otimiza consulta de relatório financeiro` |
| `test` | **adiciona testes para** | `test(cart): adiciona testes unitários para cálculo de frete` |
| `revert` | **reverte** | `revert: reverte commit de atualização de layout` |

### O que evitar:
- ❌ `feat: adicionando login` (gerúndio)
- ❌ `fix: corrigido erro` (particípio)
- ❌ `docs: atualizei o readme` (primeira pessoa)
