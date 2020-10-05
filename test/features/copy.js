import test from 'ava';
import File from '../../src/File';
import assert from '../helpers/assertions';
import webpack from '../helpers/webpack';

import '../helpers/mix';

test('it adds to the tasks array', t => {
    mix.copy('this/file.js', 'this/other/location.js');

    t.is(1, Mix.tasks.length);

    mix.copyDirectory('this/folder', 'this/other/folder');

    t.is(2, Mix.tasks.length);
});

test('it compiles JavaScript and copies the output to a new location.', async t => {
    mix.js(`test/fixtures/app/src/js/app.js`, 'js').copy(
        `test/fixtures/app/dist/js/app.js`,
        `test/fixtures/app/dist/somewhere`
    );

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/somewhere/app.js`));

    assert.manifestEquals(
        {
            '/js/app.js': '/js/app.js',
            '/somewhere/app.js': '/somewhere/app.js'
        },
        t
    );
});
