<#
.SYNOPSIS
  Installs a local Git commit-msg hook for Conventional Commits validation on Windows.
.DESCRIPTION
  Safely installs or updates the .git/hooks/commit-msg file to validate commit messages with Node.js.
#>

$gitDir = git rev-parse --git-dir 2>$null
if (-not $gitDir) {
    Write-Error "Not inside a Git repository. Run this command inside a git repository."
    exit 1
}

$hooksDir = Join-Path $gitDir "hooks"
if (-not (Test-Path $hooksDir)) {
    New-Item -ItemType Directory -Path $hooksDir -Force | Out-Null
}

$hookFile = Join-Path $hooksDir "commit-msg"

if (Test-Path $hookFile) {
    $timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    $backupFile = "$hookFile.backup-$timestamp"
    Copy-Item -Path $hookFile -Destination $backupFile
    Write-Host "Existing hook backed up to: $backupFile" -ForegroundColor Yellow
}

$hookContent = @'
#!/usr/bin/env bash
COMMIT_MSG_FILE="$1"

if ! command -v node >/dev/null 2>&1; then
  exit 0
fi

ROOT_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
VALIDATOR="$ROOT_DIR/scripts/validate-commit.mjs"

if [ -f "$VALIDATOR" ]; then
  node "$VALIDATOR" --file "$COMMIT_MSG_FILE"
fi
'@

Set-Content -Path $hookFile -Value $hookContent -NoNewline -Encoding utf8
Write-Host "Semantic commit-msg hook installed at: $hookFile" -ForegroundColor Green
Write-Host "To bypass when needed: git commit --no-verify" -ForegroundColor Cyan
