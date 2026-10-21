# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) and [Conventional Commits](https://www.conventionalcommits.org/).

---

## [2.0.0] - 2026-10-21

### Changed
- **BREAKING CHANGE**: Upgraded project to a full-fledged **Agent Skill & Developer Toolchain** compliant with Conventional Commits 1.0.0.
- Corrected misleading definitions of `refactor` and `style` in the specification.
- Modernized legacy references (replaced 2014 Grunt mentions with modern tooling).
- Transformed README into a comprehensive, high-DX guide with quick-start workflows.

### Added
- **Canonical Agent Skill (`SKILL.md`)**: Full YAML frontmatter and operational runbook for AI agents (Antigravity, Claude Code, Cursor, Copilot).
- **Zero-Dependency Validator (`scripts/validate-commit.mjs`)**: Native Node.js CLI to validate commits via args, files (`commit-msg`), or stdin with JSON output support.
- **Git Hook Installers**: Safe non-destructive setup scripts for bash (`install-hook.sh`) and PowerShell (`install-hook.ps1`).
- **Comprehensive Test Suite (`tests/validator.test.mjs`)**: 42 automated tests running via Node native test runner covering valid/invalid cases, breaking changes, git comments, and edge cases.
- **Modular References (`references/`)**:
  - `conventional-commits-spec.md`: BNF grammar and structural rules.
  - `types-and-scopes.md`: All 11 standard types, disambiguation heuristics, and scoping guidelines.
  - `semver-mapping.md`: Explicit mapping to SemVer Major.Minor.Patch.
  - `language-guidelines.md`: Imperative mood in English and Portuguese.
- **Practical Examples (`examples/`)**:
  - `basic-commits.md`: Common single-line commits.
  - `breaking-changes.md`: Breaking changes with `!` and footers.
  - `multi-line-body.md`: Contextual body and git trailers.
  - `real-world-diffs.md`: 5 scenarios translating raw `git diff` into semantic commits.
- **Agent Integrations**: Native configs for `CLAUDE.md`, `.cursorrules`, and `.github/copilot-instructions.md`.
- **Open Source Governance**: MIT `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`, GitHub issue templates, PR template, and GitHub Actions CI workflow.

---

## [1.0.0] - 2020-2021

### Added
- Initial community reference for semantic commit messages in Portuguese and English.
