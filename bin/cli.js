#!/usr/bin/env node

const { Command } = require('commander');
const { spawn } = require('child_process');

const program = createProgram();

executeScript();

function createProgram() {
    const program = new Command();

    program.name('mix');
    program.version('0.0.1');

    program
        .option('-d, --dev', 'Run Mix in development mode.', true)
        .option('-p, --production', 'Run Mix in production mode.', false)
        .option('-w, --watch', 'Watch files for changes', false);

    program.parse(process.argv);

    if (program.production && program.watch) {
        program.production = false;
    }

    return program;
}

function executeScript() {
    let script = `NODE_ENV=${
        program.production ? 'production' : 'development'
    } npx webpack ${
        program.watch ? '--watch' : ''
    } --progress --config=node_modules/laravel-mix/setup/webpack.config.js`;

    console.log(script);

    spawn(script, {
        stdio: 'inherit',
        shell: true
    });
}
