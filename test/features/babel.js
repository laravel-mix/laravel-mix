import test from 'ava';
import File from '../../src/File';
import path from 'path';
import webpack from '../helpers/webpack';

import '../helpers/mix';

test('mix.babelConfig() can be used to merge custom Babel options.', t => {
    mix.babelConfig({
        plugins: ['@babel/plugin-proposal-unicode-property-regex']
    });

    t.true(seeBabelPlugin('@babel/plugin-proposal-unicode-property-regex'));
});

test('Default Babel plugins includes plugin-proposal-object-rest-spread', t => {
    t.true(seeBabelPlugin('@babel/plugin-proposal-object-rest-spread'));
});

test('Default Babel presets includes env', t => {
    t.true(seeBabelPreset('@babel/preset-env'));
});

test('Babel reads the project .babelrc file', t => {
    // Setup a test .babelrc file.
    const configFile = __dirname + '/.testbabelrc';

    new File(configFile).write('{ "plugins": ["@babel/plugin-syntax-dynamic-import"] }');

    Config.babelConfig = { configFile };

    t.true(seeBabelPlugin('@babel/plugin-syntax-dynamic-import'));

    // Cleanup.
    File.find(configFile).delete();
});

test('Values from duplicate keys in the .babelrc file override the defaults entirely.', t => {
    Config.babelConfig = { configFile: false };

    // Setup a test .babelrc file.
    const configFile = __dirname + '/.testbabelrc';

    Config.babelConfig = { configFile };

    new File(configFile).write(
        '{ "presets": [ ["@babel/preset-env", {"useBuiltIns": "usage"}] ] }'
    );

    const babelConfig = Config.babel();

    t.is(1, babelConfig.presets.length);

    t.deepEqual({ useBuiltIns: 'usage' }, babelConfig.presets[0][1]);

    // Cleanup.
    File.find(configFile).delete();
});

test('Babel config from Mix extensions is merged with the defaults', async t => {
    mix.extend(
        'extensionWithBabelConfig',
        new (class {
            babelConfig() {
                return {
                    plugins: ['@babel/plugin-proposal-unicode-property-regex']
                };
            }
        })()
    );

    mix.extensionWithBabelConfig();

    await webpack.buildConfig();

    t.true(seeBabelPlugin('@babel/plugin-proposal-object-rest-spread'));
    t.true(seeBabelPlugin('@babel/plugin-proposal-unicode-property-regex'));
});

/**
 *
 * @param {string} name
 */
const seeBabelPlugin = name => {
    return !!Config.babel().plugins.find(
        plugin => plugin.file && plugin.file.request === name
    );
};

/**
 *
 * @param {string} name
 */
const seeBabelPreset = name => {
    return !!Config.babel().presets.find(
        plugin => plugin.file && plugin.file.request === name
    );
};
