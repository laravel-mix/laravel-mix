import test from 'ava';

import { mix, Mix } from '../helpers/mix.js';

test('it waits for all before/init hooks to complete', async t => {
    let called = false;

    mix.before(async () => {
        return new Promise(resolve => {
            setTimeout(() => {
                called = true;

                resolve();
            }, 100);
        });
    });

    t.false(called);

    await Mix.init();

    t.true(called);
});

test('a throwing before hook stops the build', async t => {
    mix.before(async () => {
        throw new Error('error 123');
    });

    await t.throwsAsync(() => Mix.init(), { message: 'error 123' });
});
