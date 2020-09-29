import mix from './helpers/setup';
import File from '../../src/File';

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

test.serial(
    'it applies the correct extensions and aliases to the webpack config',
    async t => {
        mix.ts(
            'test/fixtures/fake-app/resources/assets/js/app.js',
            'public/js'
        );

        let { config } = await compile();

        t.true(config.resolve.extensions.includes('.ts'));
        t.true(config.resolve.extensions.includes('.tsx'));
    }
);

test.serial('it applies Babel transformation', t => {
    mix.ts('resources/assets/js/app.js', 'public/js');

    t.true(
        buildConfig()
            .module.rules.find(rule => {
                return rule.test.test('foo.tsx');
            })
            .use.some(loader => loader.loader === 'babel-loader')
    );
});

test.serial('it is able to apply options to ts-loader', t => {
    mix.ts('resources/assets/js/app.js', 'public/js', { transpileOnly: true });

    t.truthy(
        buildConfig().module.rules.find(rule => rule.loader === 'ts-loader')
            .options.transpileOnly
    );
});
