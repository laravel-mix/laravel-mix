#!/usr/bin/env node

const script = process.argv[2];
const spawn = require('cross-spawn');

let args = ''

switch (script) {
    case 'dev':
        args = ['NODE_ENV=development', 'webpack', '--progress', '--hide-modules'];
        break;

    case 'watch':
        args = ['NODE_ENV=development', 'webpack', '--watch', '--progress', '--hide-modules'];
        break;

    case 'hot':
        args = ['NODE_ENV=development', 'webpack-dev-server', '--inline', '--hot'];
    break;

    case 'production':
        args = ['NODE_ENV=production', 'webpack', '--progress', '--hide-modules'];
        break;

    default:
        console.log(`Unknown script "${script}".`);
        return;
}

args = args.concat(['--config=node_modules/laravel-mix/setup/webpack.config.js']);

const result = spawn.sync('cross-env', args, { stdio: 'inherit' });

process.exit(result.status);
