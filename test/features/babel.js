import test, { beforeEach } from 'ava';
import path from 'path';

import { recordBabelConfigs } from '../helpers/babel.js';
import File from '../../src/File.js';
import { mix, Mix } from '../helpers/mix.js';
import webpack from '../helpers/webpack.js';

/** @type {ReturnType<recordBabelConfigs>} */
let babel;

beforeEach(() => {
    babel = recordBabelConfigs();

    mix.js(`test/fixtures/app/src/js/app.js`, 'js');
});

test('mix.babelConfig() can be used to merge custom Babel options.', async t => {
    mix.babelConfig({
        plugins: ['@babel/plugin-proposal-unicode-property-regex']
    });

    await webpack.compile();

    t.true(seeBabelPlugin('@babel/plugin-proposal-unicode-property-regex'));
});

test('Default Babel plugins/presets are set', async t => {
    await webpack.compile();

    t.true(seeBabelPlugin('@babel/plugin-proposal-object-rest-spread'));
    t.true(seeBabelPreset('@babel/preset-env'));
});

test('Babel reads the project .babelrc / config files', async t => {
    // Setup a test .babelrc file.
    const configFile = __dirname + '/.testbabelrc';

    new File(configFile).write('{ "plugins": ["@babel/plugin-syntax-dynamic-import"] }');

    Mix.config.babelConfig = { configFile };

    await webpack.compile();

    t.true(seeBabelPlugin('@babel/plugin-syntax-dynamic-import'));

    // Cleanup.
    File.find(configFile).delete();
});

test('Babel config files can be read from the project root', async t => {
    // .babelrc files are relative-location based on the location / ancestor of the compiled source file
    // As such the root path needs to be the tests directory as it is an ancestor of the file being compiled
    // The config file doesn't have this restriction but we'll treat it the same for simplicity
    Mix.paths.setRootPath(path.resolve(__dirname + '/../'));

    const configs = [
        {
            path: Mix.paths.root('babel.config.js'),
            content:
                'module.exports = { "plugins": ["@babel/plugin-syntax-json-strings"] }'
        },
        {
            path: Mix.paths.root('.babelrc'),
            content: '{ "plugins": ["@babel/plugin-transform-sticky-regex"] }'
        }
    ];

    configs.forEach(config => new File(config.path).write(config.content));

    await webpack.compile();

    t.true(seeBabelPlugin('@babel/plugin-syntax-json-strings'));
    t.true(seeBabelPlugin('@babel/plugin-transform-sticky-regex'));

    configs.forEach(config => File.find(config.path).delete());
});

test('Values from duplicate keys in the .babelrc file override the defaults entirely.', async t => {
    // Setup a test .babelrc file.
    const configFile = __dirname + '/.testbabelrc';

    Mix.config.babelConfig = { configFile };

    new File(configFile).write(
        '{ "presets": [ ["@babel/preset-env", {"useBuiltIns": "usage", "corejs": 3}] ] }'
    );

    await webpack.compile();

    const presets = babel.getPresets();

    t.is(1, presets.length);
    t.true(babel.hasPreset('@babel/preset-env'));
    t.deepEqual({ useBuiltIns: 'usage', corejs: 3 }, presets[0].options);

    // Cleanup.
    File.find(configFile).delete();
});

test('Babel config from Mix extensions is merged with the defaults', async t => {
    mix.extend('extensionWithBabelConfig', {
        babelConfig() {
            return {
                plugins: ['@babel/plugin-proposal-unicode-property-regex']
            };
        }
    });

    // @ts-ignore - there's no way to do declaration merging with JSDoc afaik
    mix.extensionWithBabelConfig();

    await webpack.compile();

    t.true(seeBabelPlugin('@babel/plugin-proposal-object-rest-spread'));
    t.true(seeBabelPlugin('@babel/plugin-proposal-unicode-property-regex'));
});

/**
 *
 * @param {string} name
 */
const seeBabelPlugin = name => {
    return babel.hasPlugin(name);
};

/**
 *
 * @param {string} name
 */
const seeBabelPreset = name => {
    return babel.hasPreset(name);
};
