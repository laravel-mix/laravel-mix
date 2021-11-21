import test from 'ava';
import sinon from 'sinon';

import { mix, Mix } from '../helpers/test.js';

test('mix.then()', t => {
    const spy = sinon.spy();

    // mix.then() registers a "build" event listener.
    mix.then(spy);

    // Let's fire a "build" event, and make sure that
    // our callback handler is called, as expected.
    Mix.dispatch('build');

    t.true(spy.called);
});
