import test from 'ava';

import { mix, Mix } from '../helpers/mix.js';

test('mix.options()', t => {
    mix.options({
        foo: 'bar'
    });

    t.is('bar', Mix.config.foo);
});
