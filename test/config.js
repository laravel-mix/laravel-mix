import mix from '../src/index';
import test from 'ava';

test('that it can merge config', t => {
    Config.merge({
        versioning: true,
        foo: 'bar'
    });

    t.is('bar', Config.foo);
    t.true(Config.versioning);
});
