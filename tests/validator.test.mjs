import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseCommitMessage, stripGitComments, DEFAULT_TYPES } from '../scripts/validate-commit.mjs';

describe('Conventional Commits 1.0.0 Validator', () => {

  describe('Standard Valid Headers', () => {
    for (const type of DEFAULT_TYPES) {
      it(`accepts valid type '${type}' without scope`, () => {
        const result = parseCommitMessage(`${type}: add comprehensive test cases`);
        assert.equal(result.valid, true);
        assert.equal(result.type, type);
        assert.equal(result.scope, undefined);
        assert.equal(result.isBreaking, false);
        assert.equal(result.description, 'add comprehensive test cases');
        assert.equal(result.errors.length, 0);
      });

      it(`accepts valid type '${type}' with scope`, () => {
        const result = parseCommitMessage(`${type}(core): handle edge cases`);
        assert.equal(result.valid, true);
        assert.equal(result.type, type);
        assert.equal(result.scope, 'core');
        assert.equal(result.isBreaking, false);
        assert.equal(result.errors.length, 0);
      });
    }

    it('accepts scopes with hyphens, underscores, slashes, numbers', () => {
      const scopes = ['ui-button', 'api_v2', 'parser/ast', 'i18n', 'auth.jwt'];
      for (const scope of scopes) {
        const result = parseCommitMessage(`feat(${scope}): implement feature`);
        assert.equal(result.valid, true);
        assert.equal(result.scope, scope);
      }
    });
  });

  describe('Breaking Changes', () => {
    it('detects breaking change with ! before colon without scope', () => {
      const result = parseCommitMessage('feat!: remove deprecated v1 REST endpoints');
      assert.equal(result.valid, true);
      assert.equal(result.type, 'feat');
      assert.equal(result.isBreaking, true);
      assert.equal(result.scope, undefined);
    });

    it('detects breaking change with ! after scope and before colon', () => {
      const result = parseCommitMessage('refactor(database)!: drop legacy users table');
      assert.equal(result.valid, true);
      assert.equal(result.type, 'refactor');
      assert.equal(result.scope, 'database');
      assert.equal(result.isBreaking, true);
    });

    it('detects breaking change via BREAKING CHANGE footer', () => {
      const raw = `feat(config): change port environment variable

BREAKING CHANGE: PORT is replaced by APP_PORT for 12-factor compatibility.`;
      const result = parseCommitMessage(raw);
      assert.equal(result.valid, true);
      assert.equal(result.isBreaking, true);
      assert.equal(result.footers.length, 1);
      assert.equal(result.footers[0].token, 'BREAKING CHANGE');
    });

    it('detects breaking change via BREAKING-CHANGE hyphenated footer', () => {
      const raw = `fix(auth): update token expiration logic

BREAKING-CHANGE: refresh token grant type requires client_secret.`;
      const result = parseCommitMessage(raw);
      assert.equal(result.valid, true);
      assert.equal(result.isBreaking, true);
      assert.equal(result.footers[0].token, 'BREAKING-CHANGE');
    });
  });

  describe('Multi-line Commits: Body and Footers', () => {
    it('accepts header and body separated by a blank line', () => {
      const raw = `feat(auth): add OAuth2 provider support

This allows users to log in with GitHub and Google accounts.
Includes token persistence and automatic refresh flow.`;
      const result = parseCommitMessage(raw);
      assert.equal(result.valid, true);
      assert.ok(result.body?.includes('GitHub and Google'));
      assert.equal(result.footers.length, 0);
    });

    it('accepts header, body, and git trailers (footers)', () => {
      const raw = `fix(parser): resolve null pointer exception on empty array

The AST walker crashed when encountering zero-length arrays.
Now returns an empty node list instead.

Fixes: #420
Signed-off-by: Jane Dev <jane@example.com>`;
      const result = parseCommitMessage(raw);
      assert.equal(result.valid, true);
      assert.equal(result.footers.length, 2);
      assert.equal(result.footers[0].token, 'Fixes');
      assert.equal(result.footers[0].value, '#420');
      assert.equal(result.footers[1].token, 'Signed-off-by');
    });

    it('rejects multi-line commit when missing blank line between header and body', () => {
      const raw = `feat(api): add healthcheck endpoint
This line is immediately below without blank line.`;
      const result = parseCommitMessage(raw);
      assert.equal(result.valid, false);
      assert.ok(result.errors.some((e) => e.includes('blank line must separate')));
    });

    it('handles Windows CRLF line endings cleanly', () => {
      const raw = "feat(ci): add windows runner\r\n\r\nRun matrix includes windows-latest.\r\n\r\nCloses: #12";
      const result = parseCommitMessage(raw);
      assert.equal(result.valid, true);
      assert.equal(result.type, 'feat');
      assert.equal(result.footers.length, 1);
    });
  });

  describe('Invalid Headers & Syntax Errors', () => {
    it('rejects empty commit message', () => {
      const result = parseCommitMessage('');
      assert.equal(result.valid, false);
      assert.ok(result.errors.includes('Commit message is empty.'));
    });

    it('rejects message with missing colon', () => {
      const result = parseCommitMessage('feat add new feature');
      assert.equal(result.valid, false);
      assert.ok(result.errors.some((e) => e.includes('Missing colon separator')));
    });

    it('rejects message with missing space after colon', () => {
      const result = parseCommitMessage('feat:add new feature');
      assert.equal(result.valid, false);
      assert.ok(result.errors.some((e) => e.includes('Missing space after colon')));
    });

    it('rejects unknown type', () => {
      const result = parseCommitMessage('random: update something');
      assert.equal(result.valid, false);
      assert.ok(result.errors.some((e) => e.includes("Unknown commit type 'random'")));
    });

    it('rejects empty description', () => {
      const result = parseCommitMessage('feat:   ');
      assert.equal(result.valid, false);
    });

    it('rejects empty scope parentheses', () => {
      const result = parseCommitMessage('feat(): add feature');
      assert.equal(result.valid, false);
      assert.ok(result.errors.some((e) => e.includes("Empty scope '()'")));
    });

    it('rejects unclosed scope parenthesis', () => {
      const result = parseCommitMessage('feat(api: add feature');
      assert.equal(result.valid, false);
      assert.ok(result.errors.some((e) => e.includes('Unclosed scope parenthesis')));
    });
  });

  describe('Git Comment Stripping', () => {
    it('strips git comment lines from COMMIT_EDITMSG', () => {
      const raw = `feat(ui): add theme switcher

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
# On branch main
`;
      const stripped = stripGitComments(raw);
      assert.equal(stripped, 'feat(ui): add theme switcher');

      const result = parseCommitMessage(raw);
      assert.equal(result.valid, true);
      assert.equal(result.type, 'feat');
      assert.equal(result.scope, 'ui');
    });
  });

  describe('Custom Configurations and Warnings', () => {
    it('supports custom allowed types', () => {
      const result = parseCommitMessage('release: prepare v1.0.0', {
        allowedTypes: ['release', 'hotfix']
      });
      assert.equal(result.valid, true);
      assert.equal(result.type, 'release');

      const rejected = parseCommitMessage('feat: add button', {
        allowedTypes: ['release', 'hotfix']
      });
      assert.equal(rejected.valid, false);
    });

    it('generates warnings for style guidelines without failing validation', () => {
      const result = parseCommitMessage('feat: Add button with period.');
      assert.equal(result.valid, true); // Still valid according to spec
      assert.ok(result.warnings.some((w) => w.includes('period')));
      assert.ok(result.warnings.some((w) => w.includes('lowercase')));
    });

    it('generates warning for header exceeding recommended length', () => {
      const longHeader = 'feat(super-long-scope-name): this is an extremely long commit description that definitely exceeds 72 chars';
      const result = parseCommitMessage(longHeader, { maxHeaderLength: 72 });
      assert.equal(result.valid, true);
      assert.ok(result.warnings.some((w) => w.includes('recommended maximum is 72')));
    });
  });

});
