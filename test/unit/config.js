import config from '../../src/config';
import test from 'ava';

test('that it can merge config', t => {
    let Config = config();

    Config.merge({
        versioning: true,
        foo: 'bar'
    });

    t.is('bar', Config.foo);
    t.true(Config.versioning);
});
