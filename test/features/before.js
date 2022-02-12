import test from 'ava';
import sinon from 'sinon';

import { context } from '../helpers/test.js';

test('it waits for all before/init hooks to complete', async t => {
    const { mix, Mix } = context(t);

    const spy = sinon.spy();

    mix.before(async () => {
        spy();
        await new Promise(resolve => setTimeout(resolve, 100));
        spy();
    });

    t.false(spy.called);

    await Mix.init();

    t.true(spy.called);
    t.is(spy.callCount, 2);
});

test('a throwing before hook stops the build', async t => {
    const { mix, Mix } = context(t);

    mix.before(async () => {
        throw new Error('error 123');
    });

    await t.throwsAsync(
        async () => {
            await Mix.init();
        },
        { message: 'error 123' }
    );
});
