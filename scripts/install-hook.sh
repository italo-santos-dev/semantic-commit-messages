#!/usr/bin/env bash

# Safe local installer for Git commit-msg hook
# Enforces Conventional Commits 1.0.0 locally before commits are finalized.

set -euo pipefail

GIT_DIR=$(git rev-parse --git-dir 2>/dev/null || true)

if [ -z "$GIT_DIR" ]; then
  echo "❌ Error: Not inside a Git repository. Run this command inside a git repository root." >&2
  exit 1
fi

HOOKS_DIR="$GIT_DIR/hooks"
HOOK_FILE="$HOOKS_DIR/commit-msg"

mkdir -p "$HOOKS_DIR"

if [ -f "$HOOK_FILE" ]; then
  echo "⚠️  Existing 'commit-msg' hook detected at $HOOK_FILE"
  BACKUP_FILE="$HOOK_FILE.backup-$(date +%s)"
  cp "$HOOK_FILE" "$BACKUP_FILE"
  echo "📦 Backup created at $BACKUP_FILE"
fi

cat << 'EOF' > "$HOOK_FILE"
#!/usr/bin/env bash

# Semantic Commit Messages - Local commit-msg hook
# Validates commit message against Conventional Commits 1.0.0

COMMIT_MSG_FILE="$1"

if ! command -v node >/dev/null 2>&1; then
  echo "⚠️  Node.js is not installed or not in PATH. Skipping commit message validation."
  exit 0
fi

# Locate validate-commit.mjs in repo
ROOT_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
VALIDATOR="$ROOT_DIR/scripts/validate-commit.mjs"

if [ -f "$VALIDATOR" ]; then
  node "$VALIDATOR" --file "$COMMIT_MSG_FILE"
else
  # Fallback to npx if script is not in repo directory
  npx --no-install semantic-commit-validate --file "$COMMIT_MSG_FILE" 2>/dev/null || exit 0
fi
EOF

chmod +x "$HOOK_FILE"

echo "✅ Semantic commit-msg hook successfully installed at: $HOOK_FILE"
echo "💡 To bypass temporarily for emergency hotfixes, use: git commit --no-verify"
