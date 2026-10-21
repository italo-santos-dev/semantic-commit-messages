# Semantic Versioning (SemVer) Mapping

How Conventional Commits 1.0.0 directly drives automated semantic versioning and release management.

---

## 1. The Core Equation

Conventional Commits maps directly to **Semantic Versioning 2.0.0** (`MAJOR.MINOR.PATCH`):

$$\text{Commit Signal} \implies \text{SemVer Bump}$$

```text
[BREAKING CHANGE / !]  ===>  MAJOR bump  (X.0.0)
feat                   ===>  MINOR bump  (0.X.0)
fix                    ===>  PATCH bump  (0.0.X)
```

| Commit Pattern | SemVer Target | Example Release Bump |
| :--- | :--- | :--- |
| `fix: ...` | **PATCH** | `1.4.2` $\rightarrow$ `1.4.3` |
| `feat: ...` | **MINOR** | `1.4.2` $\rightarrow$ `1.5.0` |
| `feat!: ...` or `fix!: ...` | **MAJOR** | `1.4.2` $\rightarrow$ `2.0.0` |
| Commit with `BREAKING CHANGE:` footer | **MAJOR** | `1.4.2` $\rightarrow$ `2.0.0` |
| `docs:`, `chore:`, `test:`, `style:`, `ci:` | **No Bump** (or optional patch) | Remains on current version |

---

## 2. Breaking Changes Anatomy

A Breaking Change indicates an API or behavioral modification that breaks backwards compatibility, requiring consumers to update their code or configuration.

There are two valid ways to declare a breaking change:

### Method A: Exclamation mark (`!`) before colon
Best for short commits where the header alone is sufficient:
```text
feat(auth)!: replace Bearer tokens with mTLS certificates
```
or without scope:
```text
refactor!: redesign plugin architecture interface
```

### Method B: `BREAKING CHANGE:` footer
Best when the breaking change requires detailed explanation and migration steps:
```text
feat(database): migrate connection string format

Support clustered Redis topology out of the box.

BREAKING CHANGE: The `REDIS_URL` string now requires `rediss://` protocol for TLS connections. Legacy `redis://` connections will be rejected.
```

---

## 3. Tooling Ecosystem Integration

Automated release tools scan Git commit history from the latest tag to determine the next version:

- **`semantic-release`**: Fully automated version management and package publishing based on commit types.
- **`standard-version` / `commit-and-tag-version`**: Automated changelog generation and version bumping.
- **`git-cliff`**: Highly customizable changelog generator built in Rust.
- **`changesets`**: Multi-package version management for monorepos.
