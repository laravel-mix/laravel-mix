import test, { beforeEach } from 'ava';
import File from '../../src/File';
import webpack from '../helpers/webpack';
import { recordBabelConfigs } from '../helpers/babel';

import '../helpers/mix';

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

    Config.babelConfig = { configFile };

    await webpack.compile();

    t.true(seeBabelPlugin('@babel/plugin-syntax-dynamic-import'));

    // Cleanup.
    File.find(configFile).delete();
});

test.only('Babel config files can be read from the project root', async t => {
    Mix.paths.setRootPath(__dirname + '/../');

    const configs = {
        [Mix.paths.root(
            'babel.config.js'
        )]: 'module.exports = { "plugins": ["@babel/plugin-syntax-json-strings"] }'

        // TODO: Figure out how to fix this
        // [Mix.paths.root('.babelrc')]: '{ "plugins": ["@babel/plugin-transform-sticky-regex"] }'
    };

    for (const [path, content] of Object.entries(configs)) {
        new File(path).write(content);
    }

    await webpack.compile();

    t.true(seeBabelPlugin('@babel/plugin-syntax-json-strings'));

    // TODO: Figure out how to fix this
    // t.true(seeBabelPlugin('@babel/plugin-transform-sticky-regex'));

    for (const [path, _] of Object.entries(configs)) {
        File.find(path).delete();
    }
});

test('Values from duplicate keys in the .babelrc file override the defaults entirely.', async t => {
    // Setup a test .babelrc file.
    const configFile = __dirname + '/.testbabelrc';

    Config.babelConfig = { configFile };

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
