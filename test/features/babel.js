import test from 'ava';

import { context } from '../helpers/test.js';

test.serial('mix.babelConfig() can be used to merge custom Babel options.', async t => {
    const { mix, webpack, babelConfig } = context(t);

    mix.js(`test/fixtures/app/src/js/app.js`, 'js');
    mix.babelConfig({
        plugins: ['@babel/plugin-proposal-unicode-property-regex']
    });

    await webpack.compile();

    t.true(babelConfig.hasPlugin('@babel/plugin-proposal-unicode-property-regex'));
});

test.serial('Default Babel plugins/presets are set', async t => {
    const { mix, webpack, babelConfig } = context(t);

    mix.js(`test/fixtures/app/src/js/app.js`, 'js');

    await webpack.compile();

    t.true(babelConfig.hasPlugin('@babel/plugin-proposal-object-rest-spread'));
    t.true(babelConfig.hasPreset('@babel/preset-env'));
});

test.serial('Babel reads the project .babelrc / config files', async t => {
    const { mix, webpack, disk, fs, babelConfig } = context(t);

    // Setup a test .babelrc file.
    const configFile = disk.join('/.testbabelrc');

    await fs().stub({
        [configFile]: '{ "plugins": ["@babel/plugin-syntax-dynamic-import"] }'
    });

    mix.js(`test/fixtures/app/src/js/app.js`, 'js');
    mix.options({
        babelConfig: { configFile }
    });

    await webpack.compile();

    t.true(babelConfig.hasPlugin('@babel/plugin-syntax-dynamic-import'));
});

test.serial('Babel config files can be read from the project root', async t => {
    const { mix, Mix, webpack, fs, babelConfig } = context(t);

    // .babelrc files are relative-location based on the location / ancestor of the compiled source file
    // As such the root path needs to be the tests directory as it is an ancestor of the file being compiled
    // The config file doesn't have this restriction but we'll treat it the same for simplicity
    // The root path is _already_ set to the root of the disk during test setup
    await fs().stub({
        [Mix.paths.root('babel.config.cjs')]:
            'module.exports = { "plugins": ["@babel/plugin-syntax-json-strings"] }',
        [Mix.paths.root('.babelrc')]:
            '{ "plugins": ["@babel/plugin-transform-sticky-regex"] }'
    });

    mix.js(`test/fixtures/app/src/js/app.js`, 'js');

    await webpack.compile();

    t.true(babelConfig.hasPlugin('@babel/plugin-syntax-json-strings'));
    t.true(babelConfig.hasPlugin('@babel/plugin-transform-sticky-regex'));
});

test.serial(
    'Values from duplicate keys in the .babelrc file override the defaults entirely.',
    async t => {
        const { mix, webpack, fs, babelConfig, disk } = context(t);

        // Setup a test .babelrc file.
        const configFile = disk.join('/.testbabelrc');

        await fs().stub({
            [configFile]:
                '{ "presets": [ ["@babel/preset-env", {"useBuiltIns": "usage", "corejs": 3}] ] }'
        });

        mix.js(`test/fixtures/app/src/js/app.js`, 'js');

        mix.options({
            babelConfig: { configFile }
        });

        await webpack.compile();

        const presets = babelConfig.getPresets();

        t.is(1, presets.length);
        t.true(babelConfig.hasPreset('@babel/preset-env'));
        t.deepEqual({ useBuiltIns: 'usage', corejs: 3 }, presets[0].options);
    }
);

test.serial('Babel config from Mix extensions is merged with the defaults', async t => {
    const { mix, webpack, babelConfig } = context(t);

    mix.extend('extensionWithBabelConfig', {
        babelConfig() {
            return {
                plugins: ['@babel/plugin-proposal-unicode-property-regex']
            };
        }
    });

    // @ts-ignore - there's no way to do declaration merging with JSDoc afaik
    mix.extensionWithBabelConfig();

    mix.js(`test/fixtures/app/src/js/app.js`, 'js');

    await webpack.compile();

    t.true(babelConfig.hasPlugin('@babel/plugin-proposal-object-rest-spread'));
    t.true(babelConfig.hasPlugin('@babel/plugin-proposal-unicode-property-regex'));
});
