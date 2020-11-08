import test from 'ava';
import { exec } from 'child_process';
import path from 'path';

function mix(args = []) {
    return new Promise(resolve => {
        exec(
            `cross-env TESTING=true node ${path.resolve('./bin/cli')} ${args.join(' ')}`,
            { cwd: '.' },
            (error, stdout, stderr) => {
                resolve({
                    code: error && error.code ? error.code : 0,
                    error,
                    stdout,
                    stderr
                });
            }
        );
    });
}

test('it calls webpack in development mode', async t => {
    let { stdout } = await mix();

    t.is(
        'npx webpack --progress --env MIX_FILE=webpack.mix --env NODE_ENV=development --config=' +
            require.resolve('../../setup/webpack.config.js'),
        stdout
    );
});

test('it calls webpack in production mode', async t => {
    let { stdout } = await mix(['--production']);

    t.is(
        'npx webpack --progress --env MIX_FILE=webpack.mix --env NODE_ENV=production --config=' +
            require.resolve('../../setup/webpack.config.js'),
        stdout
    );
});

test('it calls webpack with watch mode', async t => {
    let { stdout } = await mix(['watch']);

    t.is(
        'npx webpack --progress --watch --env MIX_FILE=webpack.mix --env NODE_ENV=development --config=' +
            require.resolve('../../setup/webpack.config.js'),
        stdout
    );
});

test('it calls webpack with watch mode using polling', async t => {
    let { stdout } = await mix(['watch', '--', '--watch-poll']);

    t.is(
        'npx webpack --progress --watch --env MIX_FILE=webpack.mix --env NODE_ENV=development --config=' +
            require.resolve('../../setup/webpack.config.js') +
            ' --watch-poll',
        stdout
    );
});

test('it calls webpack with hot reloading', async t => {
    let { stdout } = await mix(['watch', '--hot']);

    t.is(
        'npx webpack serve --hot --inline --disable-host-check --env MIX_FILE=webpack.mix --env NODE_ENV=development --config=' +
            require.resolve('../../setup/webpack.config.js'),
        stdout
    );
});

test('it calls webpack with hot reloading using polling', async t => {
    let { stdout } = await mix(['watch', '--hot', '--', '--watch-poll']);

    t.is(
        'npx webpack serve --hot --inline --disable-host-check --env MIX_FILE=webpack.mix --env NODE_ENV=development --config=' +
            require.resolve('../../setup/webpack.config.js') +
            ' --watch-poll',
        stdout
    );
});
