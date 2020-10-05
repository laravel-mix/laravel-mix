import test from 'ava';

import '../helpers/mix';

test('mix.when()', t => {
    let called = false;

    mix.when(false, () => (called = true));

    t.false(called);

    mix.when(true, () => (called = true));

    t.true(called);
});
