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
    t.true(
        Config.babel().presets.find(preset => {
            return preset.find(p => p.includes(path.normalize('@babel/preset-env')));
        }) !== undefined
    );
});

test('Babel reads the project .babelrc file', t => {
    // Setup a test .babelrc file.
    new File(__dirname + '/.testbabelrc').write(
        '{ "plugins": ["@babel/plugin-syntax-dynamic-import"] }'
    );

    t.true(
        Config.babel(__dirname + '/.testbabelrc').plugins.find(plugin =>
            plugin.includes(path.normalize('@babel/plugin-syntax-dynamic-import'))
        ) !== undefined
    );

    // Cleanup.
    File.find(__dirname + '/.testbabelrc').delete();
});

test('Values from duplicate keys in the .babelrc file override the defaults entirely.', t => {
    // Setup a test .babelrc file.
    let babelRcPath = __dirname + '/.testbabelrc';

    Config.babelConfigPath = babelRcPath;

    new File(babelRcPath).write(
        '{ "presets": [ ["@babel/preset-env", {"useBuiltIns": "usage"}] ] }'
    );

    let babelConfig = Config.babel();

    t.is(1, babelConfig.presets.length);

    t.deepEqual({ useBuiltIns: 'usage' }, babelConfig.presets[0][1]);

    // Cleanup.
    File.find(babelRcPath).delete();
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
let seeBabelPlugin = name => {
    return (
        Config.babel().plugins.find(plugin => plugin.includes(path.normalize(name))) !==
        undefined
    );
};
