import { execFileSync } from 'node:child_process';

/**
 * Formats only changed files under `resources/` using Prettier.
 *
 * - Includes both staged and unstaged changes.
 * - Skips if there are no matching changed files.
 */

function getChangedFiles(args) {
    const output = execFileSync('git', args, { encoding: 'utf8' }).trim();

    if (!output) {
        return [];
    }

    return output
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
}

const changedFiles = new Set([
    ...getChangedFiles(['diff', '--name-only', '--diff-filter=ACMRTUXB']),
    ...getChangedFiles(['diff', '--name-only', '--cached', '--diff-filter=ACMRTUXB']),
]);

const prettierEligibleExtensions = new Set([
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
    '.css',
    '.html',
    '.json',
    '.md',
    '.mdx',
    '.scss',
    '.yaml',
    '.yml',
]);

const filesToFormat = Array.from(changedFiles).filter((file) => {
    if (!file.startsWith('resources/')) {
        return false;
    }

    const dotIndex = file.lastIndexOf('.');
    if (dotIndex === -1) {
        return false;
    }

    return prettierEligibleExtensions.has(file.slice(dotIndex));
});

if (filesToFormat.length === 0) {
    process.stdout.write('format:dirty: no changed files under resources/.\n');
    process.exit(0);
}

execFileSync('prettier', ['--write', ...filesToFormat], { stdio: 'inherit' });
