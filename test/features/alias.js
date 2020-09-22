import mix from './helpers/setup';
import path from 'path';

test.serial('it handles resolution aliases', async t => {
    mix.alias({
        '@': './foobar'
    });

    const { config } = await compile();

    t.deepEqual(
        {
            '@': path.resolve(__dirname, '../../foobar'),
            vue$: 'vue/dist/vue.common.js'
        },
        config.resolve.alias
    );
});
