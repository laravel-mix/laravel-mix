#!/usr/bin/env node

const { Command, command } = require('commander');
const { spawn } = require('child_process');

run();

/**
 * Run the progran.
 */
async function run() {
    const program = new Command();

    program.name('mix');
    program.version('0.0.1');
    program.option(
        '--mix-config <path>',
        'The path to your Mix configuration file.',
        'webpack.mix'
    );

    program
        .command('watch')
        .description('Build and watch files for changes.')
        .option('--hmr', 'Enable hot reloading.', false)
        .action(cmd =>
            executeScript(
                'watch',
                { ...program.opts(), ...cmd.opts() },
                cmd.args
            )
        );

    program
        .command('build', { isDefault: true })
        .description('Compile Mix.')
        .option('-p, --production', 'Run Mix in production mode.', false)
        .action(cmd =>
            executeScript(
                'build',
                { ...program.opts(), ...cmd.opts() },
                cmd.args
            )
        );

    await program.parseAsync(process.argv);
}

/**
 * Execute the script.
 *
 * @param {"build"|"watch"} cmd
 * @param {{[key: string]: any}} opts
 * @param {string[]} args
 */
async function executeScript(cmd, opts, args = []) {
    let script = [
        `cross-env NODE_ENV=${opts.production ? 'production' : 'development'}`,
        `MIX_FILE=${opts.mixConfig}`,
        commandScript(cmd, opts),
        `--config=${require.resolve('../setup/webpack.config.js')}`,
        ...args
    ].join(' ');

    if (process.env.TESTING) {
        return process.stdout.write(script);
    }

    spawn(script, {
        stdio: 'inherit',
        shell: true
    });
}

/**
 * Get the command-specific portion of the script.
 *
 * @param {"build"|"watch"} cmd
 * @param {{[key: string]: any}} opts
 */
function commandScript(cmd, opts) {
    if (cmd === 'build') {
        return 'npx webpack --progress';
    } else if (cmd === 'watch' && !opts.hmr) {
        return 'npx webpack --progress --watch';
    } else if (cmd === 'watch' && opts.hmr) {
        return 'npx webpack-dev-server --inline --hot';
    }
}
