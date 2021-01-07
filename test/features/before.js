import test from 'ava';
import '../helpers/mix';

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
