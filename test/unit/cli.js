import test from 'ava';
import path from 'path';
import { cli } from '../helpers/cli';

const mix = cli({ testing: true });

/** @type {string} */
let configPath = '';

test.before(() => {
    configPath = path.relative(
        process.cwd(),
        require.resolve('../../setup/webpack.config.js')
    );
});

test('it calls webpack in development mode', async t => {
    let { stdout } = await mix();

    t.is(
        'cross-env NODE_ENV=development MIX_FILE="webpack.mix" npx webpack --progress --config="' +
            configPath +
            '"',
        stdout
    );
});

test('it calls webpack in production mode', async t => {
    let { stdout } = await mix(['--production']);

    t.is(
        'cross-env NODE_ENV=production MIX_FILE="webpack.mix" npx webpack --progress --config="' +
            configPath +
            '"',
        stdout
    );
});

test('it calls webpack with watch mode', async t => {
    let { stdout } = await mix(['watch']);

    t.is(
        'cross-env NODE_ENV=development MIX_FILE="webpack.mix" npx webpack --progress --watch --config="' +
            configPath +
            '"',
        stdout
    );
});

test('it calls webpack with watch mode using polling', async t => {
    let { stdout } = await mix(['watch', '--', '--watch-poll']);

    t.is(
        'cross-env NODE_ENV=development MIX_FILE="webpack.mix" npx webpack --progress --watch --config="' +
            configPath +
            '"' +
            ' --watch-poll',
        stdout
    );
});

test('it calls webpack with hot reloading', async t => {
    let { stdout } = await mix(['watch', '--hot']);

    t.is(
        'cross-env NODE_ENV=development MIX_FILE="webpack.mix" npx webpack serve --hot --config="' +
            configPath +
            '"',
        stdout
    );
});

test('it calls webpack with hot reloading using polling', async t => {
    let { stdout } = await mix(['watch', '--hot', '--', '--watch-poll']);

    t.is(
        'cross-env NODE_ENV=development MIX_FILE="webpack.mix" npx webpack serve --hot --config="' +
            configPath +
            '"' +
            ' --watch-poll',
        stdout
    );
});

test('it calls webpack with quoted key value pair command arguments', async t => {
    let { stdout } = await mix(['--', '--env', 'foo="bar baz"', 'foo="bar=baz"']);

    t.is(
        'cross-env NODE_ENV=development MIX_FILE="webpack.mix" npx webpack --progress --config="' +
            configPath +
            '"' +
            ' --env foo="bar baz" foo="bar=baz"',
        stdout
    );
});

test('it calls webpack with custom node_env', async t => {
    const oldEnv = process.env.NODE_ENV;

    process.env.NODE_ENV = 'foobar';

    let { stdout } = await mix();

    process.env.NODE_ENV = oldEnv;

    t.is(
        'cross-env NODE_ENV=foobar MIX_FILE="webpack.mix" npx webpack --progress --config="' +
            configPath +
            '"',
        stdout
    );
});

test('it disables progress reporting when not using a terminal', async t => {
    process.env.IS_TTY = false;

    let { stdout } = await mix();

    delete process.env.IS_TTY;

    t.is(
        'cross-env NODE_ENV=development MIX_FILE="webpack.mix" npx webpack --config="' +
            configPath +
            '"',
        stdout
    );
});

test('it disables progress reporting when requested', async t => {
    let { stdout } = await mix(['--no-progress']);

    t.is(
        'cross-env NODE_ENV=development MIX_FILE="webpack.mix" npx webpack --config="' +
            configPath +
            '"',
        stdout
    );
});
