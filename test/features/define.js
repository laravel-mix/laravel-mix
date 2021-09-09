import test from 'ava';
import assertions from '../helpers/assertions.js';

import { mix } from '../helpers/mix.js';
import webpack from '../helpers/webpack.js';

test('Code is left alone where there are no replacements defined', async t => {
    mix.js('test/fixtures/app/src/js/app.js', 'test/fixtures/app/dist/js');

    await webpack.compile();

    assertions.fileContains(
        'test/fixtures/app/dist/js/app.js',
        'console.log(__FEATURE_1__)',
        t
    );

    assertions.fileContains(
        'test/fixtures/app/dist/js/app.js',
        'console.log(__FEATURE_2__)',
        t
    );
});

test('Code replacements can be defined', async t => {
    mix.js('test/fixtures/app/src/js/app.js', 'test/fixtures/app/dist/js');
    mix.define({
        __FEATURE_1__: true,
        __FEATURE_2__: () => '`auto`'
    });

    await webpack.compile();

    assertions.fileContains('test/fixtures/app/dist/js/app.js', 'console.log(true)', t);

    assertions.fileContains('test/fixtures/app/dist/js/app.js', 'console.log(`auto`)', t);
});
