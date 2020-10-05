import test from 'ava';
import File from '../../src/File';
import { fakeApp } from '../helpers/paths';
import webpack from '../helpers/webpack';

import '../helpers/mix';
import assert from '../helpers/assertions';

test.beforeEach(() => webpack.setupVueAliases(2));

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

    let fs = require('fs-extra');
    fs.removeSync('test/fixtures/fake-app/public');
});

test('async chunk splitting works', async t => {
    mix.vue({ version: 2 });
    mix.js(`${fakeApp}/resources/assets/extract/app.js`, 'js')
        .extract(['vue', 'lodash', 'core-js'])
        .options({
            babelConfig: {
                plugins: ['@babel/plugin-syntax-dynamic-import']
            }
        })
        .version();

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/js/app.js`));

    assert.manifestEquals(
        {
            '/js/app.js': '/js/app.js\\?id=\\w{20}',
            '/js/manifest.js': '/js/manifest.js\\?id=\\w{20}',
            '/js/vendor.js': '/js/vendor.js\\?id=\\w{20}',
            '/js/split.js': '/js/split.js\\?id=\\w{20}'
        },
        t
    );
});

test('multiple extractions work', async t => {
    mix.vue({ version: 2 });
    mix.js(`${fakeApp}/resources/assets/extract/app.js`, 'js')
        .extract(['vue', 'lodash'], 'js/vendor-vue-lodash.js')
        .extract(['core-js'], 'js/vendor-core-js.js')
        .options({
            babelConfig: {
                plugins: ['@babel/plugin-syntax-dynamic-import']
            }
        })
        .version();

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/js/app.js`));

    assert.manifestEquals(
        {
            '/js/app.js': '/js/app.js\\?id=\\w{20}',
            '/js/manifest.js': '/js/manifest.js\\?id=\\w{20}',
            '/js/vendor-core-js.js': '/js/vendor-core-js.js\\?id=\\w{20}',
            '/js/vendor-vue-lodash.js': '/js/vendor-vue-lodash.js\\?id=\\w{20}',
            '/js/split.js': '/js/split.js\\?id=\\w{20}'
        },
        t
    );
});
