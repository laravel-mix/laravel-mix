import test from 'ava';

import { context } from '../helpers/test.js';

test('mix.options()', t => {
    const { mix, Mix } = context(t);

    mix.options({
        foo: 'bar'
    });

    t.is('bar', Mix.config.foo);
});
