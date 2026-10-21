---
name: git-commit-versioning
description: Generate, validate, and structure semantic Git commit messages adhering strictly to Conventional Commits 1.0.0 based on real staged and unstaged diffs. Use when asked to write a commit message, manage Git versioning, prepare commits, inspect git diffs, or validate commit compliance.
compatibility: Git, Node.js 18+ (for validator CLI)
metadata:
  standard: "Conventional Commits 1.0.0"
  version: "2.0.0"
---

# Git Commit & Versioning Agent Skill

An automated, evidence-based procedure for AI agents to inspect repository diffs and produce precise, standard-compliant Git commit messages following **Conventional Commits 1.0.0**.

---

## 1. Trigger Criteria & Scope

### When to Activate This Skill:
- The user requests a commit message for current code changes.
- Preparing to finalize a git commit or pull request.
- Validating whether a proposed commit message meets Conventional Commits 1.0.0.
- Structuring breaking changes or multi-line commits with issue references.

### Boundaries & Constraints:
- **Evidence-Only:** Base every commit message exclusively on actual, inspected `git diff` outputs.
- **No Hallucinations:** Never invent ticket numbers, issue IDs, co-authors, or unperformed actions.
- **No Secret Leaks:** Never include API keys, passwords, bearer tokens, or personal identifiers in commit messages.
- **No Destructive Actions:** Do not stage or commit files automatically without user review or approval.

---

## 2. Step-by-Step Generation Workflow

### Step 1: Inspect Repository State
Run the following inspection commands:
```bash
# Check modified, staged, and untracked files
git status --short

# Inspect staged changes (the actual commit payload)
git diff --staged

# If no files are staged, inspect working tree changes to advise the user
git diff
```

> [!IMPORTANT]
> If staged changes contain unrelated changes across multiple distinct features, advise the user to split the changes into atomic commits before proceeding.

### Step 2: Classify Primary Intent (Type)
Map the observed changes to exactly one of the 11 standard types:
- `feat`: New feature or user capability (SemVer MINOR).
- `fix`: Bug fix restoring intended behavior (SemVer PATCH).
- `docs`: Documentation only changes.
- `style`: Whitespace, commas, formatting (no logic change).
- `refactor`: Structural rewrite with identical behavior and no bug fix.
- `perf`: Measurable performance or memory optimization.
- `test`: Adding or correcting tests only.
- `build`: Build system, bundler configs, or package dependencies.
- `ci`: CI configuration files and pipeline scripts.
- `chore`: Auxiliary tooling, gitignore, licenses, or housekeeping.
- `revert`: Reverting a previous commit.

*Need detailed edge-case classification? Consult [references/types-and-scopes.md](./references/types-and-scopes.md).*

### Step 3: Determine Scope (Optional)
Identify the module, directory, or feature area modified (e.g., `auth`, `cli`, `database`, `ui`):
- Format: lowercase, alphanumeric, hyphens or slashes.
- Omit scope if the change touches the whole repository or has no clear single module.

### Step 4: Detect Breaking Changes
Evaluate if the change breaks existing APIs, configurations, or interfaces:
- **Append `!`** after type/scope: `feat(api)!: remove v1 endpoints`.
- Or include a `BREAKING CHANGE:` footer for detailed migration guidance.
- *See [references/semver-mapping.md](./references/semver-mapping.md) and [examples/breaking-changes.md](./examples/breaking-changes.md).*

### Step 5: Craft Description & Structure
- **Imperative mood:** `add`, `fix`, `refactor`, `update` (never past tense or gerund).
- **Lowercase start:** start description with lowercase.
- **No trailing period:** omit final `.`.
- **Length:** under 72 characters (recommended <= 50).
- **Language:** English by default; Portuguese if requested (see [references/language-guidelines.md](./references/language-guidelines.md)).

### Step 6: Validate Proposed Message
Before finalizing, run the built-in validator:
```bash
node scripts/validate-commit.mjs "<proposed commit message>"
```
Ensure the validator exits with `0` and no blocking errors.

---

## 3. Output Format for User

Always present the proposed message clearly formatted for easy copying:

```text
<type>(<optional-scope>): <description>

[optional body explaining motivation and context]

[optional footer(s)]
```

Explain concisely:
1. **Type selection:** Why this specific type was chosen based on the diff.
2. **Scope selection:** Why the scope accurately reflects the impacted area.
3. **SemVer impact:** Whether this corresponds to PATCH, MINOR, or MAJOR.

---

## 4. Reference Index

- **Canonical Specification:** [references/conventional-commits-spec.md](./references/conventional-commits-spec.md)
- **Types & Scopes Deep Dive:** [references/types-and-scopes.md](./references/types-and-scopes.md)
- **SemVer Mapping:** [references/semver-mapping.md](./references/semver-mapping.md)
- **Language Guidelines (EN/PT):** [references/language-guidelines.md](./references/language-guidelines.md)
- **Real-World Diff Walkthroughs:** [examples/real-world-diffs.md](./examples/real-world-diffs.md)
