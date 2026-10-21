# Claude Code Integration Guide

Guidelines for Claude Code when working with `semantic-commit-messages`.

## Conventional Commits Protocol
When asked to create commits, structure changes, or review diffs:

1. **Inspect Staged Diffs:** Always run `git diff --staged` first.
2. **Standard Types:** Use only Conventional Commits 1.0.0 types (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`).
3. **Imperative Mood:** Use lowercase imperative descriptions (e.g., `feat(auth): add logout endpoint`).
4. **Breaking Changes:** Append `!` to type/scope or add `BREAKING CHANGE:` footer.
5. **Validation:** Run the project validator before proposing or creating commits:
   ```bash
   node scripts/validate-commit.mjs "<proposed commit message>"
   ```

## Running Tests
```bash
node --test tests/**/*.test.mjs
```
