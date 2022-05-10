import test from 'ava';

import { context } from '../helpers/test.js';

test('mix.ts()', async t => {
    const { mix, webpack, assert } = context(t);

    mix.ts(`test/fixtures/app/src/dynamic-ts/app.ts`, 'dist');

    const config = await webpack.buildConfig();
    const extensions = (config.resolve && config.resolve.extensions) || [];

    // Proper extensions…
    t.true(extensions.includes('.ts'));
    t.true(extensions.includes('.tsx'));

    // And babel transformations…
    assert()
        .rule(config, rule => /** @type {RegExp} */ (rule.test).test('foo.tsx'))
        .loader(/babel-loader/)
        .exists();
});

test('it is able to apply options to ts-loader', async t => {
    const { mix, webpack, assert } = context(t);

    mix.ts(`test/fixtures/app/src/dynamic-ts/app.ts`, 'dist', { transpileOnly: true });

    const config = await webpack.buildConfig();
    const loader = assert()
        .loader(config, /ts-loader/)
        .get();

    t.truthy(loader && loader.options && loader.options.transpileOnly);
});

test.serial('it compiles TypeScript with dynamic import', async t => {
    const { mix, webpack, assert } = context(t);

    mix.ts(`test/fixtures/app/src/dynamic-ts/dynamic.ts`, 'js', {
        transpileOnly: true,

        // These would normally be in tsconfig.json but are here because
        // we'll eventually have one and the options won't match these
        compilerOptions: {
            // @ts-ignore
            target: 'esnext',
            // @ts-ignore
            module: 'esnext',
            // @ts-ignore
            moduleResolution: 'node',
            noEmit: false
        }
    });

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/js/dynamic.js`).exists();

    assert().manifestEquals({
        '/js/absolute.js': '/js/absolute.js',
        '/js/dynamic.js': '/js/dynamic.js',
        '/js/named.js': '/js/named.js'
    });
});
