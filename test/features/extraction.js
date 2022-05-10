import test from 'ava';

import { context } from '../helpers/test.js';
import { setupVueAliases } from './vue.js';

test.beforeEach(async t => {
    const { Mix } = context(t);

    await setupVueAliases(2, Mix);
});

test.serial('JS compilation with vendor extraction config', async t => {
    const { mix, assert, webpack } = context(t);

    mix.js(`test/fixtures/app/src/extract/app.js`, 'js')
        .vue()
        .extract(['vue2'], 'js/libraries.js');

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/js/manifest.js`).exists();
    assert().file(`test/fixtures/app/dist/js/libraries.js`).exists();
    assert().file(`test/fixtures/app/dist/js/app.js`).exists();

    // We extracted vue to the library file
    assert().file(`test/fixtures/app/dist/js/libraries.js`).contains('vue2');

    // But not core-js
    assert().file(`test/fixtures/app/dist/js/app.js`).contains('core-js');
    assert().file(`test/fixtures/app/dist/js/libraries.js`).doesNotContain('core-js');
});

test.serial(
    'vendor extraction with no requested JS compilation will throw an error',
    async t => {
        const { mix, webpack } = context(t);

        mix.extract(['vue']);

        await t.throwsAsync(() => webpack.compile(), {
            message: 'You must compile JS to extract vendor code'
        });
    }
);

test.serial('JS compilation with vendor extraction with default config', async t => {
    const { mix, assert, webpack } = context(t);

    mix.js(`test/fixtures/app/src/extract/app.js`, 'js').vue().extract(['vue2']);

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/js/manifest.js`).exists();
    assert().file(`test/fixtures/app/dist/js/vendor.js`).exists();
    assert().file(`test/fixtures/app/dist/js/app.js`).exists();

    assert().file(`test/fixtures/app/dist/js/vendor.js`).contains('vue2');
});

test.serial('JS compilation with total vendor extraction', async t => {
    const { mix, assert, webpack } = context(t);

    mix.js(`test/fixtures/app/src/extract/app.js`, 'js').vue().extract();

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/js/manifest.js`).exists();
    assert().file(`test/fixtures/app/dist/js/vendor.js`).exists();
    assert().file(`test/fixtures/app/dist/js/app.js`).exists();

    assert().file(`test/fixtures/app/dist/js/vendor.js`).contains('vue2');
    assert().file(`test/fixtures/app/dist/js/vendor.js`).contains('core-js');
});

test.serial('async chunk splitting works', async t => {
    const { mix, assert, webpack } = context(t);

    mix.vue();
    mix.js(`test/fixtures/app/src/extract/app.js`, 'js')
        .extract(['vue', 'lodash', 'core-js'])
        .options({
            babelConfig: {
                plugins: ['@babel/plugin-syntax-dynamic-import']
            }
        })
        .version();

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/js/app.js`).exists();

    assert().manifestEquals({
        '/js/app.js': '/js/app.js\\?id=\\w{20}',
        '/js/manifest.js': '/manifest.js\\?id=\\w{20}',
        '/js/vendor.js': '/js/vendor.js\\?id=\\w{20}',
        '/js/split.js': '/js/split.js\\?id=\\w{20}'
    });
});

test.serial('async chunks are placed in the right directory', async t => {
    const { mix, assert, webpack } = context(t);

    mix.vue();
    mix.js(`test/fixtures/app/src/extract/app.js`, 'dist/js');
    mix.extract();
    mix.options({
        babelConfig: {
            plugins: ['@babel/plugin-syntax-dynamic-import']
        }
    });

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/js/app.js`).exists();
    assert()
        .file(`test/fixtures/app/dist/js/test_fixtures_app_src_extract_dynamic_js.js`)
        .exists();
    assert()
        .file(
            `test/fixtures/app/dist/dist/js/test_fixtures_app_src_extract_dynamic_js.js`
        )
        .absent();

    assert().manifestEquals({
        '/js/app.js': '/js/app.js',
        '/js/manifest.js': '/js/manifest.js',
        '/js/vendor.js': '/js/vendor.js',
        '/js/split.js': '/js/split.js'
    });
});

test.serial('custom runtime chunk path can be provided', async t => {
    const { mix, assert, webpack } = context(t);

    mix.vue();
    mix.js(`test/fixtures/app/src/extract/app.js`, 'dist/js');
    mix.extract();
    mix.options({
        runtimeChunkPath: 'custom/runtime/chunk/path'
    });

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/js/app.js`).exists();
    assert().file(`test/fixtures/app/dist/js/vendor.js`).exists();
    assert()
        .file(`test/fixtures/app/dist/custom/runtime/chunk/path/manifest.js`)
        .exists();

    assert().manifestEquals({
        '/js/app.js': '/js/app.js',
        '/custom/runtime/chunk/path/manifest.js':
            '/custom/runtime/chunk/path/manifest.js',
        '/js/vendor.js': '/js/vendor.js',
        '/js/split.js': '/js/split.js'
    });
});

test.serial(
    'custom runtime chunk path can be placed in the public path root',
    async t => {
        const { mix, assert, webpack } = context(t);

        mix.vue();
        mix.js(`test/fixtures/app/src/extract/app.js`, 'dist/js');
        mix.extract();
        mix.options({
            runtimeChunkPath: '.'
        });

        await webpack.compile();

        assert().file(`test/fixtures/app/dist/js/app.js`).exists();
        assert().file(`test/fixtures/app/dist/js/vendor.js`).exists();
        assert().file(`test/fixtures/app/dist/manifest.js`).exists();

        assert().manifestEquals({
            '/js/app.js': '/js/app.js',
            '/manifest.js': '/manifest.js',
            '/js/vendor.js': '/js/vendor.js',
            '/js/split.js': '/js/split.js'
        });
    }
);

test.serial('multiple extractions work', async t => {
    const { mix, assert, webpack } = context(t);

    mix.vue();
    mix.js(`test/fixtures/app/src/extract/app.js`, 'js')
        .extract(['vue', 'lodash'], 'js/vendor-vue-lodash.js')
        .extract(['core-js'], 'js/vendor-core-js.js')
        .options({
            babelConfig: {
                plugins: ['@babel/plugin-syntax-dynamic-import']
            }
        })
        .version();

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/js/app.js`).exists();

    assert().manifestEquals({
        '/js/app.js': '/js/app.js\\?id=\\w{20}',
        '/js/manifest.js': '/js/manifest.js\\?id=\\w{20}',
        '/js/vendor-core-js.js': '/js/vendor-core-js.js\\?id=\\w{20}',
        '/js/vendor-vue-lodash.js': '/js/vendor-vue-lodash.js\\?id=\\w{20}',
        '/js/split.js': '/js/split.js\\?id=\\w{20}'
    });
});

test.serial('configurable extractions work', async t => {
    const { mix, assert, webpack } = context(t);

    mix.vue();
    mix.js(`test/fixtures/app/src/extract/app.js`, 'js');

    mix.extract({
        to: 'js/vendor-vue-lodash.js',
        libraries: /vue2|lodash/
    });

    mix.extract({
        to: 'js/vendor-core-js.js',
        test(mod) {
            return /core-js/.test(mod.nameForCondition());
        }
    });

    mix.extract(mod => /eol/.test(mod.nameForCondition()), 'js/vendor-eol.js');

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/js/app.js`).exists();
    assert().file(`test/fixtures/app/dist/js/vendor-core-js.js`).contains('core-js');
    assert().file(`test/fixtures/app/dist/js/vendor-vue-lodash.js`).contains('vue');
    assert().file(`test/fixtures/app/dist/js/vendor-vue-lodash.js`).contains('uniq');
    assert().file(`test/fixtures/app/dist/js/vendor-eol.js`).contains('auto');

    assert().manifestEquals({
        '/js/app.js': '/js/app.js',
        '/js/split.js': '/js/split.js',
        '/js/vendor-core-js.js': '/js/vendor-core-js.js',
        '/js/vendor-eol.js': '/js/vendor-eol.js',
        '/js/vendor-vue-lodash.js': '/js/vendor-vue-lodash.js',
        '/js/manifest.js': '/js/manifest.js'
    });
});

test.serial(
    'default vendor extractions are handled after normal extractions when given a custom name',
    async t => {
        const { mix, assert, webpack } = context(t);

        mix.vue();
        mix.js('test/fixtures/app/src/extract/app.js', 'js');
        mix.extract(['core-js'], 'js/vendor-backend.js');
        mix.extract({ to: 'js/vendor-frontend.js' });

        await webpack.compile();

        assert().file(`test/fixtures/app/dist/js/app.js`).exists();
        assert().file(`test/fixtures/app/dist/js/vendor-backend.js`).contains('core-js');
        assert().file(`test/fixtures/app/dist/js/vendor-frontend.js`).contains('uniq');

        assert().manifestEquals({
            '/js/app.js': '/js/app.js',
            '/js/split.js': '/js/split.js',
            '/js/vendor-backend.js': '/js/vendor-backend.js',
            '/js/vendor-frontend.js': '/js/vendor-frontend.js',
            '/js/manifest.js': '/js/manifest.js'
        });
    }
);
