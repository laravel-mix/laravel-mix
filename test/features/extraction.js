import mix from './helpers/setup';

test.serial('JS compilation with vendor extraction config', t => {
    mix.js('resources/assets/js/app.js', 'js').extract(
        ['vue'],
        'js/libraries.js'
    );

    t.deepEqual(
        {
            '/js/app': [path.resolve('resources/assets/js/app.js')],
            '/js/libraries': ['vue']
        },
        buildConfig().entry
    );
});

test.serial(
    'vendor extraction with no requested JS compilation will still extract vendor libraries',
    t => {
        mix.extract(['vue']);

        t.deepEqual(
            {
                mix: [
                    path.resolve(__dirname, '../../src/builder/mock-entry.js')
                ],
                '/vendor': ['vue']
            },
            buildConfig().entry
        );
    }
);

test.serial('JS compilation with vendor extraction with default config', t => {
    mix.js('resources/assets/js/app.js', 'js').extract(['vue']);

    t.deepEqual(
        {
            '/js/app': [path.resolve('resources/assets/js/app.js')],
            '/js/vendor': ['vue']
        },
        buildConfig().entry
    );
});
