import test from 'ava';
import path from 'path';

import { mix, Mix, fs, webpack, babel } from '../helpers/test.js';

/** @type {ReturnType<babel.recordConfigs>} */
let babelConfig;

test.beforeEach(() => {
    babelConfig = babel.recordConfigs();

    mix.js(`test/fixtures/app/src/js/app.js`, 'js');
});

test('mix.babelConfig() can be used to merge custom Babel options.', async t => {
    mix.babelConfig({
        plugins: ['@babel/plugin-proposal-unicode-property-regex']
    });

    await webpack.compile();

    t.true(babelConfig.hasPlugin('@babel/plugin-proposal-unicode-property-regex'));
});

test('Default Babel plugins/presets are set', async t => {
    await webpack.compile();

    t.true(babelConfig.hasPlugin('@babel/plugin-proposal-object-rest-spread'));
    t.true(babelConfig.hasPreset('@babel/preset-env'));
});

test('Babel reads the project .babelrc / config files', async t => {
    // Setup a test .babelrc file.
    const configFile = __dirname + '/.testbabelrc';

    await fs(t).stub({
        [configFile]: '{ "plugins": ["@babel/plugin-syntax-dynamic-import"] }'
    });

    mix.options({
        babelConfig: { configFile }
    });

    await webpack.compile();

    t.true(babelConfig.hasPlugin('@babel/plugin-syntax-dynamic-import'));
});

test('Babel config files can be read from the project root', async t => {
    // .babelrc files are relative-location based on the location / ancestor of the compiled source file
    // As such the root path needs to be the tests directory as it is an ancestor of the file being compiled
    // The config file doesn't have this restriction but we'll treat it the same for simplicity
    Mix.paths.setRootPath(path.resolve(__dirname + '/../'));

    await fs(t).stub({
        [Mix.paths.root('babel.config.js')]:
            'module.exports = { "plugins": ["@babel/plugin-syntax-json-strings"] }',
        [Mix.paths.root('.babelrc')]:
            '{ "plugins": ["@babel/plugin-transform-sticky-regex"] }'
    });

    await webpack.compile();

    t.true(babelConfig.hasPlugin('@babel/plugin-syntax-json-strings'));
    t.true(babelConfig.hasPlugin('@babel/plugin-transform-sticky-regex'));
});

test('Values from duplicate keys in the .babelrc file override the defaults entirely.', async t => {
    // Setup a test .babelrc file.
    const configFile = __dirname + '/.testbabelrc';

    await fs(t).stub({
        [configFile]:
            '{ "presets": [ ["@babel/preset-env", {"useBuiltIns": "usage", "corejs": 3}] ] }'
    });

    mix.options({
        babelConfig: { configFile }
    });

    await webpack.compile();

    const presets = babelConfig.getPresets();

    t.is(1, presets.length);
    t.true(babelConfig.hasPreset('@babel/preset-env'));
    t.deepEqual({ useBuiltIns: 'usage', corejs: 3 }, presets[0].options);
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

    t.true(babelConfig.hasPlugin('@babel/plugin-proposal-object-rest-spread'));
    t.true(babelConfig.hasPlugin('@babel/plugin-proposal-unicode-property-regex'));
});
