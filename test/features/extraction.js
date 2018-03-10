import mix from './helpers/setup';

test.serial('JS compilation with vendor extraction config', t => {
    mix
        .js('resources/assets/js/app.js', 'js')
        .extract(['vue'], 'js/libraries.js');

    t.deepEqual(
        {
            '': ['vue'],
            '/js/app': [path.resolve('resources/assets/js/app.js')],
        },
        buildConfig().entry
    );
});

test.serial(
    'vendor extraction with no output and no requested JS compilation throws an error',
    t => {
        mix.extract(['vue']);

        Mix.dispatch('init');

        t.throws(() => new WebpackConfig().build(), Error);
    }
);

test.serial('JS compilation with vendor extraction with default config', t => {
    mix.js('resources/assets/js/app.js', 'js').extract(['vue']);

    t.deepEqual(
        {
            '': ['vue'],
            '/js/app': [path.resolve('resources/assets/js/app.js')],
        },
        buildConfig().entry
    );
});
