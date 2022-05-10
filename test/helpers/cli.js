import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @typedef {object} CliResult
 * @property {Error|null} error
 * @property {number} code
 * @property {string} stdout
 * @property {string} stderr
 */

/**
 * @typedef {object} CliHookHelpers
 * @property {import("child_process").ChildProcess} child
 * @property {() => Promise<void>} kill
 */

/**
 * @typedef {(helpers: CliHookHelpers) => Promise<void>} CliHook
 */

/**
 * @typedef {object} CliHooks
 * @property {CliHook} [onRun]
 * @property {CliHook} [onFirstOutput]
 */

/**
 * @param {import("child_process").ChildProcess} child
 * @returns {Promise<void>}
 */
async function killProcessTree(child) {
    if (child.exitCode !== null || child.signalCode !== null || child.pid === undefined) {
        return;
    }

    // if (! /^win/.test(process.platform)) {
    //     process.kill(-child.pid)
    //     return
    // }

    child.kill('SIGTERM');
}

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
     * @param {CliHooks} hooks
     * @returns {Promise<CliResult>}
     */
    async function run(args, hooks) {
        let cmd = ['node', path.resolve(__dirname, '../../bin/cli.js'), ...args].join(
            ' '
        );
        let result = {
            /** @type {import('child_process').ExecException | null} */
            error: null,

            /** @type {NodeJS.Signals | null} */
            signal: null,

            code: 0,
            stdout: '',
            stderr: ''
        };

        const child = spawn(cmd, {
            shell: true,
            cwd,
            env: {
                ...process.env,
                ...env,
                DISABLE_NOTIFICATIONS: '1',
                TESTING: testing ? '1' : undefined
            }
        });

        const kill = () => killProcessTree(child);

        child.stdin.end();
        child.stdout.on('data', data => (result.stdout += data));
        child.stderr.on('data', data => (result.stderr += data));

        child.on('error', err => (result.error = err));
        child.on('close', (code, signal) => {
            result.code = code || 0;
            result.signal = signal;
        });

        const promise = new Promise((resolve, reject) => {
            child.on('error', () => reject(result));
            child.on('close', () => resolve(result));
        });

        if (hooks.onRun) {
            await hooks.onRun({ child, kill });
        }

        // Wait for some kind of output
        // eslint-disable-next-line no-constant-condition
        while (true) {
            await new Promise(resolve => setTimeout(resolve, 0));

            if (result.stdout.length > 0 || result.stderr.length > 0) {
                break;
            }

            if (result.error !== null || result.signal !== null || result.code !== 0) {
                break;
            }
        }

        if (hooks.onFirstOutput) {
            await hooks.onFirstOutput({ child, kill });
        }

        return promise;
    }

    /**
     * Run the Mix and build in assertions
     *
     * @param {string[]} args
     * @param {CliHooks} [hooks]
     */
    async function testRun(args = [], hooks = {}) {
        const result = await run(args, hooks);
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
