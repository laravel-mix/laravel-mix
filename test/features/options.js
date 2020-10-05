import test from 'ava';

import '../helpers/mix';

test('mix.options()', t => {
    mix.options({
        foo: 'bar'
    });

    t.is('bar', Config.foo);
});
