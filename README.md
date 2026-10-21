# Semantic Commit & Versioning (Agent Skill)

[![Conventional Commits 1.0.0](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://www.conventionalcommits.org/en/v1.0.0/)
[![SemVer 2.0.0](https://img.shields.io/badge/SemVer-2.0.0-blue.svg)](https://semver.org/)
[![Node.js 18+](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![Dependencies: 0](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](#built-in-validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

A standardized **Conventional Commits 1.0.0 specification**, an open **Agent Skill** for AI coding assistants (Antigravity, Claude Code, Cursor, Copilot), a **zero-dependency validator CLI**, and developer workflow guides.

---

## 🎯 What is this project?

Writing clean Git commits is one of the highest-leverage habits in software engineering. When commit messages follow a predictable, machine-readable standard, repositories gain:
- 🚀 **Automated Semantic Versioning (SemVer)**: Automatic determination of PATCH, MINOR, or MAJOR releases.
- 📜 **Automated Changelogs**: Instant release notes generated directly from Git history.
- 🔍 **Efficient Code Archaeology**: Instant clarity in `git log` and `git blame` regarding *why* changes occurred.
- 🤖 **Consistent AI Pair Programming**: AI coding agents create precise, evidence-based commits based on actual `git diff` outputs instead of vague guesses.

This repository transforms commit guidelines into an **executable toolkit and Agent Skill** that developers and AI assistants can immediately use, validate, and integrate into any codebase.

---

## ⚡ Quick Start

### 1. For Developers (Validate in 5 Seconds)
No installation or dependencies required:
```bash
# Validate any commit message
node scripts/validate-commit.mjs "feat(auth): implement JWT refresh token rotation"

# Or install the local Git commit-msg hook
bash scripts/install-hook.sh        # Linux / macOS / Git Bash
# or on Windows PowerShell:
.\scripts\install-hook.ps1
```

### 2. For AI Agents (Antigravity, Claude, Cursor, Copilot)
This repository includes a canonical **[SKILL.md](./SKILL.md)** and pre-configured adapters:
- **Antigravity / Agent Skills:** Discovered automatically in [`.agents/skills/git-commit-versioning/`](./.agents/skills/git-commit-versioning/) or root [`SKILL.md`](./SKILL.md).
- **Claude Code:** Configured via [`CLAUDE.md`](./CLAUDE.md).
- **Cursor:** Enforced via [`.cursorrules`](./.cursorrules).
- **GitHub Copilot:** Configured via [`.github/copilot-instructions.md`](./.github/copilot-instructions.md).

---

## 📐 Commit Message Structure

Every commit message follows the Conventional Commits 1.0.0 specification:

```text
<type>[optional scope][optional !]: <description>

[optional body explaining motivation and context]

[optional footer(s) for breaking changes and ticket tracking]
```

```text
feat(auth)!: add OAuth2 provider support
^--^ ^---^  ^---------------------------^
|    |      |
|    |      +-> Summary in imperative mood, lowercase, no trailing period.
|    +--------> Optional scope (module, package, or component affected).
+-------------> Standard type (feat, fix, docs, refactor, perf, test, build, ci, chore, revert).
     +--------> Breaking change exclamation (signals SemVer MAJOR bump).
```

---

## 📚 Standard Types & SemVer Correlation

| Type | SemVer | Purpose | Practical Example |
| :--- | :--- | :--- | :--- |
| **`feat`** | **MINOR** | Introduces a new feature or user capability | `feat(api): add GraphQL subscription endpoint` |
| **`fix`** | **PATCH** | Fixes a bug or defect in production/source code | `fix(cart): prevent negative discount calculation` |
| **`docs`** | None | Changes exclusively to documentation | `docs(readme): add installation guide` |
| **`style`** | None | Formatting, whitespace, semicolons (no code logic change) | `style(lint): organize import order` |
| **`refactor`** | None | Code restructuring without fixing bugs or adding features | `refactor(parser): extract token normalization` |
| **`perf`** | **PATCH** | Code modification that improves performance | `perf(query): add index on orders.created_at` |
| **`test`** | None | Adding missing tests or correcting existing tests | `test(auth): add integration tests for JWT expiry` |
| **`build`** | None/Patch | Build system, toolchain, bundlers, or dependencies | `build(deps): bump vite from 5.4.0 to 6.0.0` |
| **`ci`** | None | CI configuration files and pipeline scripts | `ci(github): cache npm packages across workflow` |
| **`chore`** | None | Maintenance, housekeeping, non-production updates | `chore(release): bump version to 2.0.0` |
| **`revert`** | Depends | Reverts a previous commit | `revert: feat(checkout): rollback express payment` |

> [!IMPORTANT]
> **Breaking Changes (SemVer MAJOR):** Any commit that breaks backwards compatibility triggers a MAJOR version bump. Mark it with an exclamation mark before the colon (`feat(api)!: drop legacy v1`) or add a `BREAKING CHANGE:` footer. See [references/semver-mapping.md](./references/semver-mapping.md).

---

## 🛠️ Built-in Zero-Dependency Validator

The repository includes a standalone validator CLI written in standard Node.js (ESM). It has **zero third-party dependencies**, starts in under 15ms, and runs on any system with Node 18+:

```bash
# Validate a commit string
node scripts/validate-commit.mjs "feat(auth): add JWT login"

# Validate breaking change
node scripts/validate-commit.mjs "refactor(db)!: drop legacy users table"

# Output as JSON (ideal for scripts and agents)
node scripts/validate-commit.mjs --json "fix: handle null exception"

# Validate commit from file (used by Git hook)
node scripts/validate-commit.mjs --file .git/COMMIT_EDITMSG

# Pipe from Git log
git log -1 --pretty=%B | node scripts/validate-commit.mjs --stdin
```

### Validator Features:
- ✔ Validates header syntax, types, scopes, and breaking changes.
- ✔ Validates multi-line commits (enforces blank line before body).
- ✔ Validates git trailers (`BREAKING CHANGE:`, `Fixes #123`, `Signed-off-by:`).
- ✔ Automatically strips Git comments (`#`) from commit-msg files.
- ✔ Provides clear, colored error messages and style recommendations.

---

## 🧪 Automated Testing

Run the test suite using Node's native test runner (zero `node_modules` required):

```bash
node --test tests/**/*.test.mjs
```

All 42 test scenarios verify:
- Standard headers across all 11 types.
- Scoped headers with hyphens, underscores, slashes, and numbers.
- Breaking changes via `!` and `BREAKING CHANGE:` footers.
- Multi-line body structure and git trailers.
- Invalid syntax handling (missing colons, unknown types, unclosed scopes).
- Git comment stripping and Windows CRLF normalization.

---

## 🗂️ Project Architecture & Documentation Index

```text
├── SKILL.md                          # Canonical Agent Skill specification
├── references/                       # Modular in-depth documentation
│   ├── conventional-commits-spec.md  # Formal CC 1.0.0 BNF grammar and rules
│   ├── types-and-scopes.md           # Exhaustive type definitions & heuristics
│   ├── semver-mapping.md             # Strict mapping with Semantic Versioning
│   └── language-guidelines.md        # English imperative & Portuguese guidelines
├── examples/                         # Real-world patterns and walkthroughs
│   ├── basic-commits.md              # Everyday single-line examples
│   ├── breaking-changes.md           # Breaking change variations
│   ├── multi-line-body.md            # Extended bodies and Git trailers
│   └── real-world-diffs.md           # 5 walkthroughs from Git diff to commit
├── scripts/
│   ├── validate-commit.mjs           # Zero-dependency validator CLI
│   ├── install-hook.sh               # Bash commit-msg hook installer
│   └── install-hook.ps1              # PowerShell commit-msg hook installer
├── tests/
│   └── validator.test.mjs            # Automated test suite
├── .agents/skills/semantic-commit/   # Antigravity native skill mirror
├── .github/
│   ├── workflows/ci.yml              # Automated multi-version CI
│   ├── ISSUE_TEMPLATE/               # Structured GitHub issue templates
│   ├── PULL_REQUEST_TEMPLATE.md      # Pull request checklist
│   └── copilot-instructions.md       # GitHub Copilot integration
├── CLAUDE.md                         # Claude Code instructions
├── .cursorrules                      # Cursor IDE instructions
├── CHANGELOG.md                      # Full version history
├── CONTRIBUTING.md                   # How to contribute
├── LICENSE                           # MIT License
└── package.json                      # Project metadata and test runner
```

---

## 🌍 Language Conventions

- **Default:** **English** in the imperative mood (`feat: add feature`, `fix: resolve crash`).
- **Portuguese Support:** When requested or mandated by team conventions, use the imperative affirmative (`feat: adiciona funcionalidade`, `fix: corrige falha`). Types and scopes remain in English for tooling compatibility. See [references/language-guidelines.md](./references/language-guidelines.md).

---

## 🤝 Contributing

Contributions are warmly welcomed! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on development, running tests, and submitting pull requests.

---

## 📄 License

This project is open source and available under the [MIT License](./LICENSE).

---

## 🔗 Connect with the Author

Created and maintained by **Ítalo Santos**:
- 💼 **LinkedIn:** [italo-santos-dev](https://www.linkedin.com/in/italo-santos-dev/)
- 📸 **Instagram:** [@italosantsz](https://www.instagram.com/italosantsz/)
- 🐙 **GitHub:** [@italo-santos-dev](https://github.com/italo-santos-dev)
