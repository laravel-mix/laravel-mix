import config from '../../src/config';
import test from 'ava';
import Mix from '../../src/Mix';

test('that it can merge config', t => {
    let Config = config(new Mix());

    Config.merge({
        versioning: true,
        foo: 'bar'
    });

    t.is('bar', Config.foo);
    t.true(Config.versioning);
});
