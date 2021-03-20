import test from 'ava';

import buildConfig from '../../src/config.js';
import Mix from '../../src/Mix.js';

test('that it can merge config', t => {
    let config = buildConfig(new Mix());

    config.merge({
        versioning: true,
        foo: 'bar'
    });

    // @ts-ignore
    t.is('bar', config.foo);

    // @ts-ignore
    t.true(config.versioning);
});
