# Basic Conventional Commit Examples

Everyday single-line commit examples across all 11 standard types.

---

### 1. `feat` (Features)
```text
feat: add dark mode support
feat(auth): implement Google OAuth2 provider
feat(search): add fuzzy matching to user search input
```

### 2. `fix` (Bug Fixes)
```text
fix: resolve crash on null user profile
fix(checkout): prevent duplicate payment submission on double click
fix(i18n): correct French translation for checkout button
```

### 3. `docs` (Documentation)
```text
docs: fix typo in quickstart installation guide
docs(api): document query parameters for /users endpoint
docs(contributing): add guidelines for running local integration tests
```

### 4. `style` (Formatting & Linting)
```text
style: format files with Prettier
style(css): reorder layout rules alphabetically
style(lint): resolve trailing whitespace and semicolon warnings
```

### 5. `refactor` (Restructuring)
```text
refactor: simplify user permissions verification logic
refactor(database): extract repository layer from user service
refactor(router): migrate legacy callback routing to async/await
```

### 6. `perf` (Performance)
```text
perf: memoize expensive matrix calculations
perf(db): add index on orders.created_at column
perf(images): defer offscreen image loading via native lazyload
```

### 7. `test` (Testing)
```text
test: add unit tests for discount calculator
test(auth): add edge case tests for expired refresh tokens
test(e2e): update cypress login flow selectors
```

### 8. `build` (Build System & Dependencies)
```text
build: upgrade typescript to v5.5.0
build(deps): bump axios from 1.6.0 to 1.7.0
build(docker): optimize multi-stage build caching layers
```

### 9. `ci` (Continuous Integration)
```text
ci: add matrix testing for Node.js 20 and 22
ci(github): add automated pull request title validator workflow
ci(security): schedule weekly CodeQL security analysis
```

### 10. `chore` (Maintenance)
```text
chore: update .gitignore to exclude .turbo cache directory
chore(license): bump copyright year to 2026
chore(release): bump version to 2.0.0
```

### 11. `revert` (Reversals)
```text
revert: feat(checkout): rollback express checkout integration
revert: "fix(auth): handle token expiry redirect"
```
