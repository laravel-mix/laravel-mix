import test from 'ava';

import { assert, mix, webpack } from '../helpers/test.js';

test('Code is left alone where there are no replacements defined', async t => {
    mix.js('test/fixtures/app/src/js/app.js', 'test/fixtures/app/dist/js');

    await webpack.compile();

    assert(t)
        .file('test/fixtures/app/dist/js/app.js')
        .contains(['console.log(__FEATURE_1__)', 'console.log(__FEATURE_2__)']);
});

test('Code replacements can be defined', async t => {
    mix.js('test/fixtures/app/src/js/app.js', 'test/fixtures/app/dist/js');
    mix.define({
        __FEATURE_1__: true,
        __FEATURE_2__: () => '`auto`'
    });

    await webpack.compile();

    assert(t)
        .file('test/fixtures/app/dist/js/app.js')
        .contains(['console.log(true)', 'console.log(`auto`)']);
});
