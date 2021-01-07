import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Return a helper function appropriately configured to run the Mix CLI
 *
 * @param {{testing?: boolean, cwd?: string}} opts
 */
export function cli(opts) {
    const { cwd, testing } = {
        cwd: '.',
        testing: true,
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
