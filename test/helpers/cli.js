import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
     */
    return async function (args = []) {
        let cmd = [
            `cross-env`,
            ...Object.entries(env).map(env => `${env[0]}=${env[1]}`),
            testing ? 'TESTING=1' : '',
            `node ${path.resolve('./bin/cli')}`,
            ...args
        ];

        try {
            const { stdout, stderr } = await execAsync(cmd.join(' '), { cwd });

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
    };
}
