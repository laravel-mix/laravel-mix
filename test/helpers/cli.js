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
 * @typedef {(process: import("child_process").ChildProcess) => Promise<void>} CliRunCallback
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
     * @param {CliRunCallback} onRun
     * @returns {Promise<CliResult>}
     */
    async function run(args, onRun) {
        let cmd = [`node ${path.resolve('./bin/cli')}`, ...args];

        const promise = execAsync(cmd.join(' '), {
            cwd,
            env: {
                ...process.env,
                ...env,
                TESTING: testing ? '1' : undefined
            }
        });

        await onRun(promise.child);

        try {
            const { stdout, stderr } = await promise;

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
                code: code === null || code === undefined ? 1 : code,
                stdout,
                stderr
            };
        }
    }

    /**
     * Run the Mix and build in assertions
     *
     * @param {string[]} args
     * @param {CliRunCallback} [onRun]
     */
    async function testRun(args = [], onRun = undefined) {
        const result = await run(args, onRun || (async () => {}));
        const stdout = testing ? JSON.parse(result.stdout) : { script: null, env: {} };

        return {
            ...result,

            /**
             * @param {import("ava").Assertions} t
             * @param {string} script
             **/
            assertScript(t, script) {
                t.is(stdout.script, script);
            },

            /**
             * @param {import("ava").Assertions} t
             * @param {Record<string, string>} env
             **/
            assertEnv(t, env) {
                t.deepEqual(stdout.env, env);
            }
        };
    }

    return testRun;
}
