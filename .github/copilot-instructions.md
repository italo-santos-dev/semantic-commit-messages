# GitHub Copilot Instructions

When suggesting Git commit messages or reviewing pull requests:

1. Always follow the Conventional Commits 1.0.0 specification.
2. Structure: `<type>(<scope>): <description>`
3. Choose the appropriate type from the standard 11:
   - `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
4. Keep the summary under 72 characters, lowercase start, imperative mood, no ending period.
5. Signal breaking changes using `!` (`feat!: ...`) or a `BREAKING CHANGE:` footer.
6. Validate messages locally using `node scripts/validate-commit.mjs "<message>"`.
