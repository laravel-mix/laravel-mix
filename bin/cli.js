#!/usr/bin/env node

// @ts-check

const { Command } = require('commander');
const { spawn } = require('child_process');
const path = require('path');
const pkg = require('../package.json');
const { assertSupportedNodeVersion } = require('../src/Engine.js');

run().catch(err => {
    console.error(err);

    process.exitCode = process.exitCode || 1;
    process.exit();
});

/**
 * Run the program.
 */
async function run() {
    const program = new Command();

    program.name('mix');
    program.version(pkg.version);
    program.option(
        '--mix-config <path>',
        'The path to your Mix configuration file.',
        'webpack.mix'
    );
    program.option('--no-progress', 'Disable progress reporting', false);

    program
        .command('watch')
        .description('Build and watch files for changes.')
        .option('--hot', 'Enable hot reloading.', false)
        .option('--https', 'Enable https.', false)
        .action((opts, cmd) =>
            executeScript('watch', { ...program.opts(), ...opts }, cmd.args)
        );

    program
        .command('build', { isDefault: true })
        .description('Compile Mix.')
        .option('-p, --production', 'Run Mix in production mode.', false)
        .action((opts, cmd) =>
            executeScript('build', { ...program.opts(), ...opts }, cmd.args)
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
    assertSupportedNodeVersion();

    const env = getEffectiveEnv(opts);

    // We MUST use a relative path because the files
    // created by npm dont correctly handle paths
    // containg spaces on Windows (yarn does)
    const configPath = path.relative(
        process.cwd(),
        require.resolve('../setup/webpack.config.js')
    );

    const script = [
        commandScript(cmd, opts),
        `--config="${configPath}"`,
        ...quoteArgs(args)
    ].join(' ');

    const scriptEnv = {
        NODE_ENV: env,
        MIX_FILE: opts.mixConfig
    };

    const nodeEnv = requiresLegacyOpenSSLProvider()
        ? { NODE_OPTIONS: process.env.NODE_OPTIONS || `--openssl-legacy-provider` }
        : {};

    if (isTesting()) {
        process.stdout.write(
            JSON.stringify({
                script,
                env: scriptEnv
            })
        );

        return;
    }

    function restart() {
        let child = spawn(script, {
            stdio: 'inherit',
            shell: true,
            env: {
                ...process.env,
                ...nodeEnv,
                ...scriptEnv
            }
        });

        let shouldOverwriteExitCode = true;

        child.on('exit', (code, signal) => {
            // Note adapted from cross-env:
            // https://github.com/kentcdodds/cross-env/blob/3edefc7b450fe273655664f902fd03d9712177fe/src/index.js#L30-L31

            // The process exit code can be null when killed by the OS (like an out of memory error) or sometimes by node
            // SIGINT means the _user_ pressed Ctrl-C to interrupt the process execution
            // Return the appropriate error code in that case
            if (code === null) {
                code = signal === 'SIGINT' ? 130 : 1;
            }

            if (shouldOverwriteExitCode) {
                process.exitCode = code;
            }
        });

        process.on('SIGINT', () => {
            shouldOverwriteExitCode = false;
            child.kill('SIGINT');
        });

        process.on('SIGTERM', () => {
            shouldOverwriteExitCode = false;
            child.kill('SIGTERM');
        });
    }

    restart();
}

/**
 * Get the command-specific portion of the script.
 *
 * @param {"build"|"watch"} cmd
 * @param {{[key: string]: any}} opts
 */
function commandScript(cmd, opts) {
    const showProgress = isTTY() && opts.progress;
    const script = ['webpack'];

    if (cmd === 'build' && showProgress) {
        script.push('--progress');
    } else if (cmd === 'watch' && !opts.hot) {
        script.push('--watch');

        if (showProgress) {
            script.push('--progress');
        }
    } else if (cmd === 'watch' && opts.hot) {
        script.push('serve', '--hot');

        if (opts.https) {
            script.push('--https');
        }
    }

    return script.join(' ');
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

/**
 * Get the effective envirnoment to run in
 *
 ** @param {{[key: string]: any}} opts
 */
function getEffectiveEnv(opts) {
    // If we've requested a production compile we enforce use of the production env
    // If we don't a user's global NODE_ENV may override and prevent minification of assets
    if (opts.production) {
        return 'production';
    }

    // We use `development` by default or under certain specific conditions when testing
    if (!process.env.NODE_ENV || (isTesting() && process.env.NODE_ENV === 'test')) {
        return 'development';
    }

    // Otherwsise defer to the current value of NODE_ENV
    return process.env.NODE_ENV;
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

function requiresLegacyOpenSSLProvider() {
    if (!process.version.startsWith('v17.')) {
        return false;
    }

    try {
        require('crypto').createHash('md4').update('test').digest('hex');

        return false;
    } catch (err) {
        return true;
    }
}
