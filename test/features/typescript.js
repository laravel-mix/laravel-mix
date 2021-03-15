import test from 'ava';

import '../helpers/mix';
import File from '../../src/File';
import webpack from '../helpers/webpack';
import assert from '../helpers/assertions';

test('mix.ts()', t => {
    let response = mix.ts('src/app.ts', 'dist');

    t.deepEqual(mix, response);

    t.deepEqual(
        [
            {
                entry: [new File('src/app.ts')],
                output: new File('dist')
            }
        ],
        Mix.components.get('ts').toCompile
    );

    // There's also a mix.typeScript() alias.
    t.deepEqual(mix, mix.typeScript('src/app.ts', 'dist'));
});

test('it applies the correct extensions and aliases to the webpack config', async t => {
    mix.ts(`test/fixtures/app/src/js/app.js`, 'dist');

    let { config } = await webpack.compile();

    t.true(config.resolve.extensions.includes('.ts'));
    t.true(config.resolve.extensions.includes('.tsx'));
});

test('it applies Babel transformation', async t => {
    mix.ts('js/app.js', 'dist');

    t.true(
        (await webpack.buildConfig()).module.rules
            .find(rule => {
                return rule.test.test('foo.tsx');
            })
            .use.some(loader => loader.loader === 'babel-loader')
    );
});

test('it is able to apply options to ts-loader', async t => {
    mix.ts('js/app.js', 'dist', { transpileOnly: true });

    t.truthy(
        (await webpack.buildConfig()).module.rules.find(
            rule => rule.loader === 'ts-loader'
        ).options.transpileOnly
    );
});

test.only('it compiles TypeScript with dynamic import', async t => {
    mix.ts(`test/fixtures/app/src/dynamic-ts/dynamic.ts`, 'js', {
        transpileOnly: true,

        // These would normally be in tsconfig.json but are here because
        // we'll eventually have one and the options won't match these
        compilerOptions: {
            target: 'esnext',
            module: 'esnext',
            moduleResolution: 'node',
            noEmit: false
        }
    });

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/js/dynamic.js`));

    assert.manifestEquals(
        {
            '/js/absolute.js': '/js/absolute.js',
            '/js/dynamic.js': '/js/dynamic.js',
            '/js/named.js': '/js/named.js'
        },
        t
    );
});
