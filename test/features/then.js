import test from 'ava';

import { mix, Mix } from '../helpers/mix.js';

test('mix.then()', t => {
    let called = false;

    // mix.then() registers a "build" event listener.
    let response = mix.then(() => {
        called = true;
    });

    t.deepEqual(mix, response);

    // Let's fire a "build" event, and make sure that
    // our callback handler is called, as expected.
    Mix.dispatch('build');

    t.true(called);
});
