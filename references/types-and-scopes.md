# Conventional Commit Types and Scopes

A comprehensive guide to standard commit types, semantic classification heuristics, and scope conventions.

---

## 1. The 11 Standard Types

| Type | SemVer Impact | Primary Purpose | Example |
| :--- | :--- | :--- | :--- |
| **`feat`** | **MINOR** | Introduces a new feature or user-facing capability. | `feat(auth): add OAuth2 refresh token rotation` |
| **`fix`** | **PATCH** | Patches a bug or incorrect behavior in production/source code. | `fix(cart): prevent negative discount calculation` |
| **`docs`** | None | Changes exclusively to documentation (README, guides, API docs). | `docs(api): document rate limiting headers` |
| **`style`** | None | Formatting, whitespace, indentation, missing commas/semicolons (no logic change). | `style(lint): format imports according to style guide` |
| **`refactor`** | None | Code restructuring without fixing a bug or adding a feature. | `refactor(parser): extract token normalization method` |
| **`perf`** | **PATCH** (often) | Code modification that measurably improves performance or memory usage. | `perf(image): optimize image compression pipeline` |
| **`test`** | None | Adding missing tests, correcting existing tests, or updating mocks. | `test(auth): add integration tests for session expiration` |
| **`build`** | None / **PATCH** | Build system, toolchain, bundlers, or external package dependencies. | `build(deps): update vite to v6.0.0` |
| **`ci`** | None | CI configuration files and automation scripts (GitHub Actions, GitLab CI). | `ci(workflow): cache node_modules across workflow steps` |
| **`chore`** | None | Auxiliary maintenance tasks, internal scripts, or non-source updates. | `chore(release): bump version to 2.0.0` |
| **`revert`** | Depends | Reverts a previous commit. | `revert: feat(checkout): rollback express payment` |

---

## 2. Decision Tree & Disambiguation Heuristics

### `feat` vs `fix` vs `refactor`
- **Does it introduce new functionality from a user or API standpoint?** $\rightarrow$ `feat`.
- **Did something behave erroneously or crash, and this restores intended behavior?** $\rightarrow$ `fix`.
- **Does the code do the exact same thing externally, but with cleaner, modular architecture?** $\rightarrow$ `refactor`.
- ⚠️ *Anti-pattern:* Never use `refactor` to mask a bug fix. If you fixed an underlying logic flaw, use `fix`.

### `style` vs `refactor`
- **`style`**: Strictly superficial. Prettier formatting, ESLint whitespace fixes, semicolon adjustments. A compiler or transpiler would produce identical AST or binary output.
- **`refactor`**: Modifies the structure of functions, modules, classes, or design patterns without altering end-user behavior.

### `chore` vs `build` vs `ci`
- **`build`**: Modifies how the software builds, packages, or resolves external dependencies (e.g., `package.json`, `pom.xml`, `Dockerfile`, `webpack.config.js`).
- **`ci`**: Modifies continuous integration pipelines (e.g., `.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`).
- **`chore`**: Housekeeping that doesn't fit `build` or `ci` (e.g., updating `.gitignore`, internal scripts, license dates).

### `test` alongside features
- If you implement a new feature and write tests for it in the same commit, categorize it as `feat` (the feature is the primary intent).
- Use `test` when the commit's primary intent is adding, updating, or fixing tests independently.

---

## 3. Scope Guidelines

The scope is an optional noun placed within parentheses to pinpoint the subsection of the codebase affected:

`<type>(<scope>): <description>`

### Best Practices:
1. **Keep it short and lowercase**: `feat(auth):`, `fix(cli):`, `docs(readme):`.
2. **Use kebab-case or slash for hierarchy**: `fix(ui/modal):`, `feat(api-gateway):`.
3. **Monorepo / Package scoping**: In monorepos, use the package name or module name:
   - `feat(client): add dark mode toggle`
   - `fix(server): resolve race condition in worker pool`
4. **Avoid artificial scopes**: Don't repeat the type or create redundant noise:
   - ❌ `feat(feature-login): add login`
   - ❌ `docs(documentation): update readme`
   - ✅ `feat(auth): add login`
   - ✅ `docs(readme): update quickstart`
