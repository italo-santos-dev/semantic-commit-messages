# Breaking Changes Examples

Practical examples of breaking changes triggering **MAJOR** version bumps.

---

### Example 1: API Endpoint Signature Change (Exclamation `!`)
```text
feat(api)!: require api_key query parameter for public metrics endpoint
```

### Example 2: Database Schema Incompatibility (Exclamation `!` with Body)
```text
refactor(database)!: drop legacy `is_admin` column in favor of RBAC roles table

All role checks now query the `user_roles` relational mapping.
Direct database readers must update their queries.
```

### Example 3: Configuration Option Renamed (`BREAKING CHANGE:` Footer)
```text
feat(config): modernize logging configuration schema

Switch to structured JSON logging by default.

BREAKING CHANGE: The `LOG_LEVEL_VERBOSE` environment variable is removed. Use `LOG_LEVEL=debug` instead.
```

### Example 4: Dependency Major Upgrade Dropping Older Runtimes
```text
build(deps)!: upgrade react to v19

Drop support for React 17 and legacy component lifecycle methods.

BREAKING CHANGE: `componentWillReceiveProps` and legacy context APIs are no longer supported.
```

### Example 5: CLI Command Refactoring
```text
feat(cli)!: change default output format from XML to JSON

BREAKING CHANGE: Scripts parsing stdout as XML must now supply the `--format=xml` flag explicitly.
```
