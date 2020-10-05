import test from 'ava';
import path from 'path';
import webpack from '../helpers/webpack';

import '../helpers/mix';

test('it handles resolution aliases', async t => {
    mix.alias({
        '@': './foobar'
    });

    let { config } = await webpack.compile();

    t.deepEqual(
        {
            '@': path.resolve(__dirname, '../../foobar')
        },
        config.resolve.alias
    );
});
