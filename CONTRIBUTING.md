# Contributing to Semantic Commit Messages

Thank you for investing your time in improving `semantic-commit-messages`!

---

## Code of Conduct & Principles
- Keep tools lightweight and zero-dependency. Do not add heavy npm libraries unless strictly necessary.
- Ensure 100% adherence to [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).
- Maintain backwards compatibility and clear documentation.

---

## Local Development Workflow

### Prerequisites
- Node.js 18.0.0 or higher
- Git 2.30 or higher

### 1. Clone the repository
```bash
git clone https://github.com/italo-santos-dev/semantic-commit-versioning.git
cd semantic-commit-versioning
```

### 2. Run Tests
We use Node's built-in native test runner (zero `npm install` required):
```bash
node --test tests/**/*.test.mjs
```

### 3. Test Validator CLI
```bash
node scripts/validate-commit.mjs "feat(test): verify new feature"
```

### 4. Committing Your Changes
All commits must strictly follow Conventional Commits 1.0.0. For example:
- `feat(validator): add support for custom trailer tokens`
- `docs(readme): add instructions for Claude Code`
- `test(validator): add test case for CRLF footers`
