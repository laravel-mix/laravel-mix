import mix from './helpers/setup';

test.serial(
    'mix.babelConfig() can be used to merge custom Babel options.',
    t => {
        mix.babelConfig({
            plugins: ['some-babel-plugin']
        });

        t.true(Config.babel().plugins.includes('some-babel-plugin'));
    }
);

test.serial(
    'Default Babel plugins includes plugin-proposal-object-rest-spread',
    t => {
        t.true(
            Config.babel().plugins.includes(
                '@babel/plugin-proposal-object-rest-spread'
            )
        );
    }
);

test.serial('Default Babel presets includes env', t => {
    t.true(
        Config.babel().presets.find(preset => {
            return preset.includes('@babel/preset-env');
        }) !== undefined
    );
});

test.serial('Babel reads the project .babelrc file', t => {
    // Setup a test .babelrc file.
    new File(__dirname + '/.testbabelrc').write(
        '{ "plugins": ["@babel/plugin-syntax-dynamic-import"] }'
    );

    t.true(
        Config.babel(__dirname + '/.testbabelrc').plugins.includes(
            '@babel/plugin-syntax-dynamic-import'
        )
    );

    // Cleanup.
    File.find(__dirname + '/.testbabelrc').delete();
});

test.serial(
    'Values from duplicate keys in the .babelrc file override the defaults entirely.',
    t => {
        // Setup a test .babelrc file.
        let babelRcPath = __dirname + '/.testbabelrc';

        new File(babelRcPath).write(
            '{ "presets": [ ["@babel/preset-env", {"useBuiltIns": "usage"}] ] }'
        );

        let babelConfig = Config.babel(babelRcPath);

        t.is(1, babelConfig.presets.length);

        t.deepEqual({ useBuiltIns: 'usage' }, babelConfig.presets[0][1]);

        // Cleanup.
        File.find(babelRcPath).delete();
    }
);
