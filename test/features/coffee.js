import test from 'ava';

import { context } from '../helpers/test.js';

test.serial('it compiles', async t => {
    const { mix, fs, webpack, assert } = context(t);

    await fs(t).stub({
        'test/fixtures/app/src/js/app.coffee': 'module Foobar'
    });

    mix.coffee(`test/fixtures/app/src/js/app.coffee`, 'js');

    const { config } = await webpack.compile();

    assert(t).file(`test/fixtures/app/dist/js/app.js`).exists();

    assert(t).manifestEquals({
        '/js/app.js': '/js/app.js'
    });

    assert(t)
        .rule(config, rule => String(rule.test) === '/\\.coffee$/')
        .exists();
});
