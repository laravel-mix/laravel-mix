import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * @typedef {object} CliResult
 * @property {Error|null} error
 * @property {number} code
 * @property {string} stdout
 * @property {string} stderr
 */

/**
 * Return a helper function appropriately configured to run the Mix CLI
 *
 * @param {{testing?: boolean, cwd?: string, env?: Record<string, string>}} opts
 */
export function cli(opts) {
    const { cwd, testing, env } = {
        cwd: '.',
        testing: true,
        env: {},
        ...opts
    };

    /**
     * Run the Mix CLI
     *
     * @param {string[]} args
     * @returns {Promise<CliResult>}
     */
    async function run(args = []) {
        let cmd = [`node ${path.resolve('./bin/cli')}`, ...args];

        try {
            const { stdout, stderr } = await execAsync(cmd.join(' '), {
                cwd,
                env: {
                    ...process.env,
                    ...env,
                    TESTING: testing ? '1' : undefined
                }
            });

            return {
                error: null,
                code: 0,
                stdout,
                stderr
            };
        } catch (error) {
            const { code, stdout, stderr } = error;

            return {
                error,
                code,
                stdout,
                stderr
            };
        }
    }

    /**
     * Run the Mix and build in assertions
     *
     * @param {string[]} args
     */
    async function testRun(args = []) {
        const result = await run(args);

        return {
            ...result
        };
    }

    return testRun;
}
