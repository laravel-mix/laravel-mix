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
    const result = await mix();

    result.assertScript(t, `npx webpack --progress --config="${configPath}"`);
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'development' });
});

test('it calls webpack in production mode', async t => {
    const result = await mix(['--production']);

    result.assertScript(t, `npx webpack --progress --config="${configPath}"`);
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'production' });
});

test('it calls webpack with watch mode', async t => {
    const result = await mix(['watch']);

    result.assertScript(t, `npx webpack --progress --watch --config="${configPath}"`);
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'development' });
});

test('it calls webpack with watch mode using polling', async t => {
    const result = await mix(['watch', '--', '--watch-poll']);

    result.assertScript(
        t,
        `npx webpack --progress --watch --config="${configPath}" --watch-poll`
    );
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'development' });
});

test('it calls webpack with hot reloading', async t => {
    const result = await mix(['watch', '--hot']);

    result.assertScript(t, `npx webpack serve --hot --config="${configPath}"`);
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'development' });
});

test('it calls webpack with hot reloading using polling', async t => {
    const result = await mix(['watch', '--hot', '--', '--watch-poll']);

    result.assertScript(
        t,
        `npx webpack serve --hot --config="${configPath}" --watch-poll`
    );
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'development' });
});

test('it calls webpack with quoted key value pair command arguments', async t => {
    const result = await mix(['--', '--env', 'foo="bar baz"', 'foo="bar=baz"']);

    result.assertScript(
        t,
        `npx webpack --progress --config="${configPath}" --env foo="bar baz" foo="bar=baz"`
    );
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'development' });
});

test('it calls webpack with custom node_env', async t => {
    const oldEnv = process.env.NODE_ENV;

    process.env.NODE_ENV = 'foobar';

    const result = await mix();

    process.env.NODE_ENV = oldEnv;

    result.assertScript(t, `npx webpack --progress --config="${configPath}"`);
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'foobar' });
});

test('it disables progress reporting when not using a terminal', async t => {
    process.env.IS_TTY = '0';

    const result = await mix();

    delete process.env.IS_TTY;

    result.assertScript(t, `npx webpack --config="${configPath}"`);
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'development' });
});

test('it disables progress reporting when requested', async t => {
    const result = await mix(['--no-progress']);

    result.assertScript(t, `npx webpack --config="${configPath}"`);
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'development' });
});
