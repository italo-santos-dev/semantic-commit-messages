# Real-World Diffs to Semantic Commits

This guide illustrates how to analyze actual `git diff` outputs and craft precise Conventional Commit messages.

---

## Scenario 1: Bug Fix in JWT Token Expiry

### Git Diff:
```diff
diff --git a/src/auth/token.js b/src/auth/token.js
--- a/src/auth/token.js
+++ b/src/auth/token.js
@@ -42,3 +42,3 @@ export function isTokenExpired(token) {
   const now = Math.floor(Date.now() / 1000);
-  return token.exp < now;
+  return token.exp <= now;
 }
```

### Analysis:
- **Modified files:** `src/auth/token.js`
- **What happened?** Tokens expiring at the exact current second were incorrectly treated as valid, causing race conditions in session validation.
- **Intent:** Restoring intended correctness without adding new features.
- **Type:** `fix`
- **Scope:** `auth`

### Semantic Commit:
```text
fix(auth): treat tokens expiring at current second as expired
```

---

## Scenario 2: New Feature Accompanied by Tests

### Git Diff:
```diff
diff --git a/src/users/avatar.js b/src/users/avatar.js
new file mode 100644
--- /dev/null
+++ b/src/users/avatar.js
@@ -0,0 +1,12 @@
+export function generateGravatarUrl(email, size = 80) {
+  const hash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
+  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
+}
diff --git a/test/avatar.test.js b/test/avatar.test.js
new file mode 100644
--- /dev/null
+++ b/test/avatar.test.js
@@ -0,0 +1,8 @@
+import { test } from 'node:test';
+import assert from 'node:assert';
+import { generateGravatarUrl } from '../src/users/avatar.js';
+
+test('generates valid gravatar url', () => {
+  assert.ok(generateGravatarUrl('user@example.com').includes('identicon'));
+});
```

### Analysis:
- **Modified files:** `src/users/avatar.js`, `test/avatar.test.js`
- **What happened?** A new Gravatar generation utility was added along with its test file.
- **Intent:** The primary intent is a new user/system capability (`feat`). The test is part of the feature delivery.
- **Type:** `feat` (not `test`)
- **Scope:** `users` or `avatar`

### Semantic Commit:
```text
feat(users): add Gravatar URL generation helper
```

---

## Scenario 3: Structural Refactoring (No Behavior Change)

### Git Diff:
```diff
diff --git a/src/services/order.js b/src/services/order.js
--- a/src/services/order.js
+++ b/src/services/order.js
@@ -15,7 +15,2 @@ export class OrderService {
   async processOrder(order) {
-    if (!order.id) throw new Error('Missing ID');
-    if (!order.items || order.items.length === 0) throw new Error('Empty items');
-    if (!order.customerEmail) throw new Error('Missing email');
+    validateOrderPayload(order);
     return this.repo.save(order);
   }
+}
+
+function validateOrderPayload(order) {
+  if (!order.id) throw new Error('Missing ID');
+  if (!order.items || order.items.length === 0) throw new Error('Empty items');
+  if (!order.customerEmail) throw new Error('Missing email');
 }
```

### Analysis:
- **Modified files:** `src/services/order.js`
- **What happened?** Inline validation was extracted into a standalone helper function. The behavior, exceptions, and outputs are 100% identical.
- **Intent:** Code restructuring for readability and reuse.
- **Type:** `refactor` (not `style`, not `fix`, not `feat`)
- **Scope:** `order`

### Semantic Commit:
```text
refactor(order): extract order payload validation into helper function
```

---

## Scenario 4: Dependency Update

### Git Diff:
```diff
diff --git a/package.json b/package.json
--- a/package.json
+++ b/package.json
@@ -18,3 +18,3 @@
   "dependencies": {
-    "dotenv": "^16.3.1"
+    "dotenv": "^16.4.5"
   }
```

### Analysis:
- **Modified files:** `package.json`, `package-lock.json`
- **What happened?** Bumped an external build/runtime dependency version.
- **Intent:** Build system / dependency maintenance.
- **Type:** `build` (or `chore` depending on project convention; `build(deps)` is the standard in Angular/npm ecosystem).
- **Scope:** `deps`

### Semantic Commit:
```text
build(deps): bump dotenv from 16.3.1 to 16.4.5
```

---

## Scenario 5: CI Workflow Optimization

### Git Diff:
```diff
diff --git a/.github/workflows/ci.yml b/.github/workflows/ci.yml
--- a/.github/workflows/ci.yml
+++ b/.github/workflows/ci.yml
@@ -14,2 +14,5 @@ jobs:
       - uses: actions/checkout@v4
+      - uses: actions/cache@v4
+        with:
+          path: ~/.npm
+          key: npm-${{ hashFiles('package-lock.json') }}
       - run: npm ci
```

### Analysis:
- **Modified files:** `.github/workflows/ci.yml`
- **What happened?** Added caching for the npm cache directory in CI.
- **Intent:** Continuous integration automation improvement.
- **Type:** `ci`
- **Scope:** `workflow` or `cache`

### Semantic Commit:
```text
ci(workflow): cache npm directory in CI pipeline
```
