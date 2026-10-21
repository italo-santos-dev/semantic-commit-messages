#!/usr/bin/env node

/**
 * Semantic Commit Messages - Validator CLI
 * 
 * Zero-dependency, standards-compliant Conventional Commits 1.0.0 parser and validator.
 * Can be run via CLI, Git hook (commit-msg), CI/CD, or imported as an ES module.
 * 
 * @license MIT
 * @see https://www.conventionalcommits.org/en/v1.0.0/
 */

import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

/**
 * Standard Conventional Commits 1.0.0 types
 */
export const DEFAULT_TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'chore',
  'revert'
];

/**
 * Regex for header: <type>(<scope>)?(!)?:\s+(<description>)
 * Compliant with Conventional Commits 1.0.0
 */
const HEADER_REGEX = /^(?<type>[a-zA-Z0-9_-]+)(?:\((?<scope>[^()\r\n]+)\))?(?<breaking>!)?:\s+(?<description>.+)$/;

/**
 * Git trailer token regex (e.g., "BREAKING CHANGE:", "Fixes:", "Signed-off-by:")
 */
const FOOTER_TOKEN_REGEX = /^(BREAKING CHANGE|BREAKING-CHANGE|[a-zA-Z0-9-]+)(?::\s+|\s+#)(?<value>.+)$/;

/**
 * Strips Git comments (lines starting with #) from commit-msg files
 * @param {string} raw
 * @returns {string}
 */
export function stripGitComments(raw) {
  return raw
    .split(/\r?\n/)
    .filter((line) => !line.trimStart().startsWith('#'))
    .join('\n')
    .trim();
}

/**
 * Validates a commit message string against Conventional Commits 1.0.0
 * 
 * @param {string} rawMessage Raw commit message
 * @param {object} [options]
 * @param {string[]} [options.allowedTypes]
 * @param {number} [options.maxHeaderLength=72]
 * @param {boolean} [options.strictDescriptions=false]
 * @returns {{
 *   valid: boolean,
 *   header: string,
 *   type?: string,
 *   scope?: string,
 *   isBreaking: boolean,
 *   description?: string,
 *   body?: string,
 *   footers: Array<{ token: string, value: string }>,
 *   errors: string[],
 *   warnings: string[]
 * }}
 */
export function parseCommitMessage(rawMessage, options = {}) {
  const allowedTypes = options.allowedTypes || DEFAULT_TYPES;
  const maxHeaderLength = options.maxHeaderLength ?? 72;

  const cleaned = stripGitComments(rawMessage || '');
  const errors = [];
  const warnings = [];

  if (!cleaned) {
    return {
      valid: false,
      header: '',
      isBreaking: false,
      footers: [],
      errors: ['Commit message is empty.'],
      warnings: []
    };
  }

  const lines = cleaned.split(/\r?\n/);
  const header = lines[0];

  // 1. Header syntax validation
  const match = header.match(HEADER_REGEX);
  let parsedType;
  let parsedScope;
  let isBreaking = false;
  let parsedDescription;

  if (!match || !match.groups) {
    // Provide specific helpful feedback on common header syntax errors
    if (!header.includes(':')) {
      errors.push("Missing colon separator after type/scope (expected '<type>: <description>' or '<type>(<scope>): <description>').");
    } else if (header.match(/^[a-zA-Z0-9_-]+\([^)]*$/)) {
      errors.push("Unclosed scope parenthesis in header.");
    } else if (header.match(/^[a-zA-Z0-9_-]+\(\):/)) {
      errors.push("Empty scope '()' provided. Omit parenthesis if no scope is needed.");
    } else if (header.match(/^[a-zA-Z0-9_-]+(\([^)]+\))?!?:[^\s]/)) {
      errors.push("Missing space after colon (expected ': <description>').");
    } else {
      errors.push(`Header does not match Conventional Commits format: '<type>[optional scope][optional !]: <description>'.`);
    }
  } else {
    parsedType = match.groups.type;
    parsedScope = match.groups.scope;
    isBreaking = Boolean(match.groups.breaking);
    parsedDescription = match.groups.description.trim();

    // 2. Validate Type
    if (!allowedTypes.includes(parsedType)) {
      errors.push(`Unknown commit type '${parsedType}'. Allowed types: ${allowedTypes.join(', ')}.`);
    }

    // 3. Validate Scope
    if (parsedScope !== undefined) {
      if (parsedScope.trim().length === 0) {
        errors.push("Scope cannot be empty when parentheses are present.");
      }
    }

    // 4. Validate Description
    if (!parsedDescription) {
      errors.push("Commit description cannot be empty.");
    } else {
      // Style warnings
      if (parsedDescription.endsWith('.')) {
        warnings.push("Description should not end with a period ('.').");
      }
      if (/^[A-Z]/.test(parsedDescription)) {
        warnings.push("Description preferably starts with a lowercase letter (imperative mood, e.g., 'add feature' instead of 'Add feature').");
      }
    }
  }

  // 5. Header length check
  if (header.length > maxHeaderLength) {
    warnings.push(`Header length is ${header.length} characters (recommended maximum is ${maxHeaderLength}).`);
  }

  // 6. Multi-line body structure
  let body;
  const footers = [];

  if (lines.length > 1) {
    const secondLine = lines[1];
    if (secondLine.trim().length > 0) {
      errors.push("A blank line must separate the commit header from the body (rule: Conventional Commits 1.0.0).");
    }

    // Parse rest of lines into body & footers
    const remainingLines = lines.slice(2);
    const bodyLines = [];
    let inFooterSection = false;

    for (let i = 0; i < remainingLines.length; i++) {
      const current = remainingLines[i];
      const footerMatch = current.match(FOOTER_TOKEN_REGEX);

      // Check for BREAKING CHANGE footer
      if (footerMatch) {
        inFooterSection = true;
        const token = footerMatch[1];
        let value = footerMatch.groups?.value || '';

        // Check if breaking change
        if (token === 'BREAKING CHANGE' || token === 'BREAKING-CHANGE') {
          isBreaking = true;
        }

        // Multi-line footer continuation
        while (i + 1 < remainingLines.length && remainingLines[i + 1].startsWith(' ')) {
          i++;
          value += '\n' + remainingLines[i].trim();
        }

        footers.push({ token, value });
      } else if (!inFooterSection) {
        bodyLines.push(current);
      } else if (current.trim().length > 0) {
        // Line encountered after footer started that isn't a footer
        footers[footers.length - 1].value += '\n' + current;
      }
    }

    body = bodyLines.join('\n').trim() || undefined;
  }

  return {
    valid: errors.length === 0,
    header,
    type: parsedType,
    scope: parsedScope,
    isBreaking,
    description: parsedDescription,
    body,
    footers,
    errors,
    warnings
  };
}

/**
 * Print help information
 */
function printHelp() {
  console.log(`
Semantic Commit Messages - Validator CLI (v2.0.0)

USAGE:
  node validate-commit.mjs [OPTIONS] [MESSAGE]
  npx semantic-commit-validate [OPTIONS] [MESSAGE]

OPTIONS:
  -f, --file <path>         Path to a commit message file (e.g., .git/COMMIT_EDITMSG)
  -s, --stdin               Read commit message from standard input (stdin)
  -t, --types <list>        Comma-separated list of allowed types (default: CC 1.0.0 list)
  -m, --max-length <num>    Maximum recommended header length (default: 72)
  -j, --json                Output result as JSON (useful for agents & scripts)
  -q, --quiet               Quiet mode: no output, exit code indicates validity
  -h, --help                Show this help message
  -v, --version             Show version

EXAMPLES:
  # Validate a commit string
  node validate-commit.mjs "feat(auth): add JWT login authentication"

  # Validate breaking change
  node validate-commit.mjs "feat(api)!: drop legacy v1 endpoints"

  # As a Git commit-msg hook
  node validate-commit.mjs --file "$1"

  # Piping from Git log
  git log -1 --pretty=%B | node validate-commit.mjs --stdin
`);
}

/**
 * Main CLI execution
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    printHelp();
    process.exit(args.length === 0 ? 1 : 0);
  }

  if (args.includes('-v') || args.includes('--version')) {
    console.log('semantic-commit-validate v2.0.0 (Conventional Commits 1.0.0)');
    process.exit(0);
  }

  let filePath;
  let useStdin = false;
  let isJson = false;
  let isQuiet = false;
  let customTypes;
  let maxHeaderLength = 72;
  const positionalArgs = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-f' || arg === '--file') {
      filePath = args[++i];
    } else if (arg === '-s' || arg === '--stdin') {
      useStdin = true;
    } else if (arg === '-j' || arg === '--json') {
      isJson = true;
    } else if (arg === '-q' || arg === '--quiet') {
      isQuiet = true;
    } else if (arg === '-t' || arg === '--types') {
      customTypes = (args[++i] || '').split(',').map((t) => t.trim()).filter(Boolean);
    } else if (arg === '-m' || arg === '--max-length') {
      maxHeaderLength = parseInt(args[++i], 10) || 72;
    } else if (!arg.startsWith('-')) {
      positionalArgs.push(arg);
    }
  }

  let rawMessage = '';

  if (filePath) {
    try {
      const resolved = resolve(process.cwd(), filePath);
      const stat = statSync(resolved);
      if (!stat.isFile()) {
        console.error(`Error: Path '${filePath}' is not a file.`);
        process.exit(1);
      }
      rawMessage = readFileSync(resolved, 'utf-8');
    } catch (err) {
      console.error(`Error reading commit message file '${filePath}': ${err.message}`);
      process.exit(1);
    }
  } else if (useStdin || (!process.stdin.isTTY && positionalArgs.length === 0)) {
    // Read from standard input
    const chunks = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    rawMessage = Buffer.concat(chunks).toString('utf-8');
  } else if (positionalArgs.length > 0) {
    rawMessage = positionalArgs.join(' ');
  } else {
    console.error('Error: No commit message provided. Use a string argument, --file, or --stdin.');
    process.exit(1);
  }

  const result = parseCommitMessage(rawMessage, {
    allowedTypes: customTypes,
    maxHeaderLength
  });

  if (isJson) {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.valid ? 0 : 1);
  }

  if (isQuiet) {
    process.exit(result.valid ? 0 : 1);
  }

  // TTY / Human formatted output
  const useColor = !process.env.NO_COLOR && process.stdout.isTTY;
  const green = (s) => (useColor ? `\x1b[32m${s}\x1b[0m` : s);
  const red = (s) => (useColor ? `\x1b[31m${s}\x1b[0m` : s);
  const yellow = (s) => (useColor ? `\x1b[33m${s}\x1b[0m` : s);
  const cyan = (s) => (useColor ? `\x1b[36m${s}\x1b[0m` : s);
  const bold = (s) => (useColor ? `\x1b[1m${s}\x1b[0m` : s);

  if (result.valid) {
    console.log(`${green('✔ Valid conventional commit:')} ${bold(result.header)}`);
    console.log(`  ${cyan('Type:')}         ${result.type}`);
    console.log(`  ${cyan('Scope:')}        ${result.scope || '(none)'}`);
    console.log(`  ${cyan('Breaking:')}     ${result.isBreaking ? red('YES (! or BREAKING CHANGE)') : 'no'}`);
    console.log(`  ${cyan('Description:')}  ${result.description}`);

    if (result.body) {
      console.log(`  ${cyan('Body:')}         ${result.body.split('\n').length} line(s)`);
    }
    if (result.footers.length > 0) {
      console.log(`  ${cyan('Footers:')}      ${result.footers.map((f) => f.token).join(', ')}`);
    }

    if (result.warnings.length > 0) {
      console.log(`\n${yellow('Warnings / Style recommendations:')}`);
      result.warnings.forEach((w) => console.log(`  ${yellow('⚠')} ${w}`));
    }
    process.exit(0);
  } else {
    console.error(`${red('✖ Invalid conventional commit message:')} "${result.header}"`);
    console.error(`\n${red('Errors:')}`);
    result.errors.forEach((e) => console.error(`  ${red('•')} ${e}`));

    if (result.warnings.length > 0) {
      console.error(`\n${yellow('Warnings:')}`);
      result.warnings.forEach((w) => console.error(`  ${yellow('⚠')} ${w}`));
    }

    console.error(`\n${cyan('Expected Format:')} <type>(<scope>)?: <description>`);
    console.error(`${cyan('Standard Types:')}  ${(customTypes || DEFAULT_TYPES).join(', ')}`);
    console.error(`${cyan('Documentation:')}   https://www.conventionalcommits.org/`);
    process.exit(1);
  }
}

// Execute if run from CLI
if (process.argv[1] && process.argv[1].endsWith('validate-commit.mjs')) {
  main().catch((err) => {
    console.error('Unexpected validator error:', err);
    process.exit(1);
  });
}
