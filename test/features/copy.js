import test from 'ava';
import File from '../../src/File';
import assert from '../helpers/assertions';
import { fakeApp } from '../helpers/paths';
import webpack from '../helpers/webpack';

import '../helpers/mix';

test('it adds to the tasks array', t => {
    mix.copy('this/file.js', 'this/other/location.js');

    t.is(1, Mix.tasks.length);

    mix.copyDirectory('this/folder', 'this/other/folder');

    t.is(2, Mix.tasks.length);
});

test('it compiles JavaScript and copies the output to a new location.', async t => {
    mix.js(`${fakeApp}/resources/assets/js/app.js`, 'js').copy(
        `${fakeApp}/public/js/app.js`,
        `${fakeApp}/public/somewhere`
    );

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/somewhere/app.js`));

    assert.manifestEquals(
        {
            '/js/app.js': '/js/app.js',
            '/somewhere/app.js': '/somewhere/app.js'
        },
        t
    );
});
