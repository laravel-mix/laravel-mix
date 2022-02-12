import test from 'ava';

import { context } from '../helpers/test.js';

test('it handles resolution aliases', async t => {
    const { mix, webpack, disk } = context(t);

    mix.alias({
        '@': './foobar'
    });

    const config = await webpack.buildConfig();

    t.deepEqual(config.resolve && config.resolve.alias, {
        '@': disk.join('./foobar')
    });
});
