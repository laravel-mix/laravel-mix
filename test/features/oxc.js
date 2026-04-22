import test from 'ava';
import { context } from '../helpers/test.js';

test('it replaces babel-loader with oxc-webpack-loader when mix.oxc() is called', async t => {
    const { mix, assert, webpack } = context(t);

    mix.js('js/app.js', 'dist/js');
    mix.oxc();

    const config = await webpack.buildConfig();

    const jsRule = config.module.rules.find(
        rule => rule.test && rule.test.test('file.js')
    );

    t.truthy(jsRule, 'JS rule should exist');

    const uses = Array.isArray(jsRule.use) ? jsRule.use : [jsRule.use];
    const loader = uses[0];

    t.true(loader.loader.includes('oxc-webpack-loader'));
    t.is(loader.options.target, 'es2015');
});

test('it passes oxc options through', async t => {
    const { mix, webpack } = context(t);

    mix.js('js/app.js', 'dist/js');
    mix.oxc({ target: 'es2020', jsx: { runtime: 'automatic' } });

    const config = await webpack.buildConfig();

    const jsRule = config.module.rules.find(
        rule => rule.test && rule.test.test('file.js')
    );
    const uses = Array.isArray(jsRule.use) ? jsRule.use : [jsRule.use];
    const loader = uses[0];

    t.is(loader.options.target, 'es2020');
    t.deepEqual(loader.options.jsx, { runtime: 'automatic' });
});

test('it does not replace babel-loader when mix.oxc() is not called', async t => {
    const { mix, webpack } = context(t);

    mix.js('js/app.js', 'dist/js');

    const config = await webpack.buildConfig();

    const jsRule = config.module.rules.find(
        rule => rule.test && rule.test.test('file.js')
    );
    const uses = Array.isArray(jsRule.use) ? jsRule.use : [jsRule.use];
    const loader = uses[0];

    t.true(loader.loader.includes('babel-loader'));
});

test('it auto-detects React and sets jsx options', async t => {
    const { mix, webpack } = context(t);

    mix.js('js/app.js', 'dist/js');
    mix.react();
    mix.oxc();

    const config = await webpack.buildConfig();

    const jsRule = config.module.rules.find(
        rule => rule.test && rule.test.test('file.js')
    );
    const uses = Array.isArray(jsRule.use) ? jsRule.use : [jsRule.use];
    const loader = uses[0];

    t.true(loader.loader.includes('oxc-webpack-loader'));
    t.deepEqual(loader.options.jsx, { runtime: 'automatic' });
});

test('it allows user jsx options to override React auto-detection', async t => {
    const { mix, webpack } = context(t);

    mix.js('js/app.js', 'dist/js');
    mix.react();
    mix.oxc({ jsx: { runtime: 'classic' } });

    const config = await webpack.buildConfig();

    const jsRule = config.module.rules.find(
        rule => rule.test && rule.test.test('file.js')
    );
    const uses = Array.isArray(jsRule.use) ? jsRule.use : [jsRule.use];
    const loader = uses[0];

    t.deepEqual(loader.options.jsx, { runtime: 'classic' });
});

test('it removes ts-loader when oxc is active', async t => {
    const { mix, webpack } = context(t);

    mix.ts('js/app.ts', 'dist/js');
    mix.oxc();

    const config = await webpack.buildConfig();

    const tsLoaderRule = config.module.rules.find(
        rule => rule.loader && rule.loader.includes('ts-loader')
    );

    t.falsy(tsLoaderRule, 'ts-loader rule should be removed');

    // The JS rule should still exist and use oxc
    const jsRule = config.module.rules.find(
        rule => rule.test && rule.test.test('file.ts')
    );
    t.truthy(jsRule);
    const uses = Array.isArray(jsRule.use) ? jsRule.use : [jsRule.use];
    t.true(uses[0].loader.includes('oxc-webpack-loader'));
});

test.serial('it compiles JavaScript with oxc-webpack-loader', async t => {
    const { mix, assert, webpack } = context(t);

    mix.js(`test/fixtures/app/src/js/app.js`, 'js');
    mix.oxc();

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/js/app.js`).exists();
});
