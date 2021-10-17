import test from 'ava';
import path from 'path';

import { mix } from '../helpers/mix.js';
import webpack, { setupVueAliases } from '../helpers/webpack.js';

test('it can build multiple configs at once', async t => {
    setupVueAliases(2);

    mix.group('one', mix => {
        mix.js('test/fixtures/app/src/js/app.js', 'js/app1.js');
        mix.alias({
            '@': './foobar'
        });
    });

    mix.group('two', mix => {
        setupVueAliases(2);

        mix.js('test/fixtures/app/src/extract/app.js', 'js/app2.js');
        mix.alias({
            '@': './foobaz'
        });
        mix.vue({ version: 2 });
    });

    const { configs } = await webpack.compile();

    t.deepEqual(configs[0].resolve && configs[0].resolve.alias, {
        '@': path.resolve(__dirname, '../../foobar')
    });

    t.deepEqual(configs[1].resolve && configs[1].resolve.alias, {
        '@': path.resolve(__dirname, '../../foobaz'),
        vue: path.resolve(
            __dirname,
            '../../node_modules/vue2/dist/vue.runtime.common.js'
        ),
        vue$: 'vue/dist/vue.esm.js'
    });
});
