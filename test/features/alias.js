import test from 'ava';
import path from 'path';

import { mix } from '../helpers/mix.js';
import webpack from '../helpers/webpack.js';

test('it handles resolution aliases', async t => {
    mix.alias({
        '@': './foobar'
    });

    let { config } = await webpack.compile();

    t.deepEqual(config.resolve && config.resolve.alias, {
        '@': path.resolve(__dirname, '../../foobar')
    });
});
