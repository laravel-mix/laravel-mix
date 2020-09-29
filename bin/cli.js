#!/usr/bin/env node

const { Command } = require('commander');
const { spawn } = require('child_process');
const debug = require('debug')('laravel-mix');

run();

async function run() {
    // TODO: This really shouldn't be here I don't think
    require('../src/index');

    const mixConfigPath = Mix.paths.mix();

    const program = new Command();

    program.name('mix');
    program.version('0.0.1');
    program.option(
        '--mix-config <path>',
        'Specify mix config file',
        mixConfigPath
    );

    program
        .command('watch')
        .description('Watch files for changes')
        .option('--hmr', 'Run hot reload server', false)
        .action(cmd =>
            executeScript('watch', { ...program.opts(), ...cmd.opts() })
        );

    program
        .command('build', { isDefault: true })
        .description('Build')
        .option('-p, --production', 'Run Mix in production mode.', false)
        .action(cmd =>
            executeScript('build', {
                ...program.opts(),
                ...cmd.opts()
            })
        );

    await program.parseAsync(process.argv);
}

/**
 * @param {"build"|"watch"} cmd
 * @param {{[key: string]: any}} opts
 */
async function executeScript(cmd, opts) {
    let script = [];

    script.push(`NODE_ENV=${opts.production ? 'production' : 'development'}`);

    if (opts.mixConfig) {
        script.push(`MIX_FILE=${opts.mixConfig}`);
    }

    if (cmd === 'build') {
        script.push(`npx webpack`);
        script.push(`--progress`);
    } else if (cmd === 'watch' && !opts.hmr) {
        script.push(`npx webpack`);
        script.push(`--progress`);
        script.push(`--watch`);
    } else if (cmd === 'watch' && opts.hmr) {
        script.push(`npx webpack-dev-server`);
        script.push(`--inline --hot`);
    }

    script.push(`--config=${require.resolve('../setup/webpack.config.js')}`);

    script = script.join(' ');

    debug('Running script %s', script);

    spawn(script, {
        stdio: 'inherit',
        shell: true
    });
}
