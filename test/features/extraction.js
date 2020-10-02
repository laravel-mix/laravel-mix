import mix from './helpers/setup';
import File from '../../src/File';
import { fakeApp } from '../helpers/paths';
import webpack from '../helpers/webpack';

test.beforeEach(() => setupVueAliases(2));

test('JS compilation with vendor extraction config', async t => {
    mix.js(`${fakeApp}/resources/assets/extract/app.js`, 'js')
        .vue({ version: 2 })
        .extract(['vue'], 'js/libraries.js');

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/js/manifest.js`));
    t.true(File.exists(`${fakeApp}/public/js/libraries.js`));
    t.true(File.exists(`${fakeApp}/public/js/app.js`));

    t.true(
        new File(`${fakeApp}/public/js/libraries.js`).read().includes('vue')
    );
});

test('vendor extraction with no requested JS compilation will still extract vendor libraries', async t => {
    mix.extract(['vue']);

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/manifest.js`));
    t.true(File.exists(`${fakeApp}/public/vendor.js`));

    t.true(new File(`${fakeApp}/public/vendor.js`).read().includes('vue'));
});

test('JS compilation with vendor extraction with default config', async t => {
    mix.js(`${fakeApp}/resources/assets/extract/app.js`, 'js')
        .vue({ version: 2 })
        .extract(['vue']);

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/js/manifest.js`));
    t.true(File.exists(`${fakeApp}/public/js/vendor.js`));
    t.true(File.exists(`${fakeApp}/public/js/app.js`));

    t.true(new File(`${fakeApp}/public/js/vendor.js`).read().includes('vue'));
});

test('JS compilation with total vendor extraction', async t => {
    mix.js(`${fakeApp}/resources/assets/extract/app.js`, 'js')
        .vue({ version: 2 })
        .extract();

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/js/manifest.js`));
    t.true(File.exists(`${fakeApp}/public/js/vendor.js`));
    t.true(File.exists(`${fakeApp}/public/js/app.js`));
});
