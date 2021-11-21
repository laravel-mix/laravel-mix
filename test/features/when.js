import test from 'ava';
import sinon from 'sinon';

import { mix } from '../helpers/test.js';

test('it executes the callback based on the condition', t => {
    const spy = sinon.spy();

    mix.when(false, spy);
    t.false(spy.called);

    mix.when(true, spy);
    t.true(spy.called);
});

test('it passes the mix instance to the callback', t => {
    mix.when(true, _mix => t.is(mix, _mix));
});
