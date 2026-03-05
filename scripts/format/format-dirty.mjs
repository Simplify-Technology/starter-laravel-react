import { execFileSync } from 'node:child_process';

/**
 * Formats only changed files under `resources/` using Prettier.
 *
 * - Includes both staged and unstaged changes.
 * - Skips if there are no matching changed files.
 */

/**
 * Executes an external command synchronously, exiting the current process on failure.
 *
 * @param {string} command - The executable to run (e.g. "git", "prettier").
 * @param {string[] | null | undefined} args - List of arguments to pass to the command.
 * @param {import('node:child_process').ExecFileSyncOptions} [options] - Options forwarded to execFileSync.
 * @returns {Buffer | string} The stdout from the command when it completes successfully.
 *
 * On error, this function writes a descriptive message, the error message, and any stderr
 * output to process.stderr, then terminates the process with exit code 1 and does not return.
 */
function execFileSyncOrExit(command, args, options) {
    const safeArgs = Array.isArray(args) ? args : [];

    try {
        return execFileSync(command, safeArgs, options);
    } catch (error) {
        const commandString = `${command} ${safeArgs.join(' ')}`;

        process.stderr.write(`format:dirty: failed to run "${commandString}".\n`);

        if (error && typeof error === 'object') {
            if ('message' in error && error.message) {
                process.stderr.write(`${String(error.message)}\n`);
            }

            if ('stderr' in error && error.stderr) {
                process.stderr.write(`${String(error.stderr)}\n`);
            }
        } else if (error) {
            process.stderr.write(`${String(error)}\n`);
        }

        process.exit(1);
    }
}

function getChangedFiles(args) {
    const output = execFileSyncOrExit('git', args, { encoding: 'utf8' }).trim();

    if (!output) {
        return [];
    }

    return output
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
}

const changedFiles = new Set([
    ...getChangedFiles(['diff', '--name-only', '--diff-filter=ACMRU']),
    ...getChangedFiles(['diff', '--name-only', '--cached', '--diff-filter=ACMRU']),
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
        // Files under `resources/` without an extension (no `.`) are intentionally skipped,
        // as we only run Prettier on a known set of extensions.
        return false;
    }

    return prettierEligibleExtensions.has(file.slice(dotIndex));
});

if (filesToFormat.length === 0) {
    process.stdout.write('format:dirty: no changed files under resources/.\n');
    process.exit(0);
}

execFileSyncOrExit('prettier', ['--write', ...filesToFormat], { stdio: 'inherit' });
