import test from 'ava';
import path from 'path';
import { createRequire } from 'module';

import { cli } from '../helpers/cli.js';

const mix = cli({ testing: true });

/** @type {string} */
let configPath = '';

/** @type {string} */
let rspackBin = '';

test.before(() => {
    const require = createRequire(import.meta.url);

    configPath = require.resolve('../../setup/webpack.config.js');

    rspackBin = path.join(
        path.dirname(require.resolve('@rspack/cli/package.json')),
        'bin',
        'rspack.js'
    );
});

test('it calls webpack in development mode', async t => {
    const result = await mix();

    result.assertScript(t, `node "${rspackBin}" --config="${configPath}"`);
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'development' });
});

test('it calls webpack in production mode', async t => {
    const result = await mix(['--production']);

    result.assertScript(t, `node "${rspackBin}" --config="${configPath}"`);
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'production' });
});

test('it calls webpack with watch mode', async t => {
    const result = await mix(['watch']);

    result.assertScript(t, `node "${rspackBin}" --watch --config="${configPath}"`);
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'development' });
});

test('it calls webpack with watch mode using polling', async t => {
    const result = await mix(['watch', '--', '--watch-poll']);

    result.assertScript(
        t,
        `node "${rspackBin}" --watch --config="${configPath}" --watch-poll`
    );
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'development' });
});

test('it calls webpack with hot reloading', async t => {
    const result = await mix(['watch', '--hot']);

    result.assertScript(t, `node "${rspackBin}" serve --hot --config="${configPath}"`);
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'development' });
});

test('it calls webpack with hot reloading using polling', async t => {
    const result = await mix(['watch', '--hot', '--', '--watch-poll']);

    result.assertScript(
        t,
        `node "${rspackBin}" serve --hot --config="${configPath}" --watch-poll`
    );
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'development' });
});

test('it calls webpack with quoted key value pair command arguments', async t => {
    const result = await mix(['--', '--env', 'foo="bar baz"', 'foo="bar=baz"']);

    result.assertScript(
        t,
        `node "${rspackBin}" --config="${configPath}" --env foo="bar baz" foo="bar=baz"`
    );
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'development' });
});

test.serial('it calls webpack with custom node_env', async t => {
    const oldEnv = process.env.NODE_ENV;

    process.env.NODE_ENV = 'foobar';

    const result = await mix();

    process.env.NODE_ENV = oldEnv;

    result.assertScript(t, `node "${rspackBin}" --config="${configPath}"`);
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'foobar' });
});

test.serial('it disables progress reporting when not using a terminal', async t => {
    process.env.IS_TTY = '0';

    const result = await mix();

    delete process.env.IS_TTY;

    result.assertScript(t, `node "${rspackBin}" --config="${configPath}"`);
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'development' });
});

test('it disables progress reporting when requested', async t => {
    const result = await mix(['--no-progress']);

    result.assertScript(t, `node "${rspackBin}" --config="${configPath}"`);
    result.assertEnv(t, { MIX_FILE: 'webpack.mix', NODE_ENV: 'development' });
});
