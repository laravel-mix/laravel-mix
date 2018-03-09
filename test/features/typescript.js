import mix from './helpers/setup';

test.serial('mix.ts()', t => {
    let response = mix.ts('resources/assets/js/app.ts', 'public/js');

    t.is(mix, response);

    t.deepEqual(
        [
            {
                entry: [new File('resources/assets/js/app.ts')],
                output: new File('public/js')
            }
        ],
        Mix.components.get('ts').toCompile
    );

    // There's also a mix.typeScript() alias.
    t.is(mix, mix.typeScript('resources/assets/js/app.ts', 'public/js'));
});

test.cb.serial(
    'it applies the correct extensions and aliases to the webpack config',
    t => {
        mix.ts(
            'test/fixtures/fake-app/resources/assets/js/app.js',
            'public/js'
        );

        compile(t, webpackConfig => {
            t.true(webpackConfig.resolve.extensions.includes('.ts'));
            t.true(webpackConfig.resolve.extensions.includes('.tsx'));

            t.is('vue/dist/vue.esm.js', webpackConfig.resolve.alias['vue$']);
        });
    }
);

test.serial('it applies the correct webpack rules', t => {
    mix.ts('resources/assets/js/app.js', 'public/js');

    t.truthy(
        buildConfig().module.rules.find(
            rule => rule.test.toString() === '/\\.tsx?$/'
        )
    );
});
