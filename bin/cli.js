#!/usr/bin/env node

const { Command } = require('commander');
const { spawn } = require('child_process');

run();

/**
 * Run the program.
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
        .option('--hot', 'Enable hot reloading.', false)
        .action(cmd =>
            executeScript('watch', { ...program.opts(), ...cmd.opts() }, cmd.args)
        );

    program
        .command('build', { isDefault: true })
        .description('Compile Mix.')
        .option('-p, --production', 'Run Mix in production mode.', false)
        .action(cmd =>
            executeScript('build', { ...program.opts(), ...cmd.opts() }, cmd.args)
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
    const env =
        (isTesting() && process.env.NODE_ENV === 'test') || !process.env.NODE_ENV
            ? opts.production
                ? 'production'
                : 'development'
            : process.env.NODE_ENV;

    let script = [
        `cross-env NODE_ENV=${env}`,
        `MIX_FILE="${opts.mixConfig}"`,
        commandScript(cmd, opts),
        `--config="${require.resolve('../setup/webpack.config.js')}"`,
        ...quoteArgs(args)
    ].join(' ');

    if (isTesting()) {
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
        if (isTTY()) {
            return 'npx webpack --progress';
        }

        return 'npx webpack';
    } else if (cmd === 'watch' && !opts.hot) {
        if (isTTY()) {
            return 'npx webpack --progress --watch';
        }

        return 'npx webpack --watch';
    } else if (cmd === 'watch' && opts.hot) {
        return 'npx webpack serve --hot';
    }
}

/**
 * Get the command arguments with quoted values.
 *
 * @param {string[]} args
 */
function quoteArgs(args) {
    return args.map(arg => {
        // Split string at first = only
        const pattern = /^([^=]+)=(.*)$/;
        const keyValue = arg.includes('=') ? pattern.exec(arg).slice(1) : [];

        if (keyValue.length === 2) {
            return `${keyValue[0]}="${keyValue[1]}"`;
        }

        return arg;
    });
}

function isTesting() {
    return process.env.TESTING;
}

function isTTY() {
    if (isTesting() && process.env.IS_TTY !== undefined) {
        return process.env.IS_TTY === 'true';
    }

    if (isTesting() && process.stdout.isTTY === undefined) {
        return true;
    }

    return process.stdout.isTTY;
}
