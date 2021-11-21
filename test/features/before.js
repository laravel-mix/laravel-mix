import test from 'ava';
import sinon from 'sinon';

import { mix, Mix } from '../helpers/test.js';

test('it waits for all before/init hooks to complete', async t => {
    const spy = sinon.spy();

    mix.before(async () => {
        return new Promise(resolve => {
            setTimeout(() => {
                spy();
                resolve();
            }, 100);
        });
    });

    t.false(spy.called);

    await Mix.init();

    t.true(spy.called);
});

test('a throwing before hook stops the build', async t => {
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
