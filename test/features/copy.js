import test from 'ava';
import File from '../../src/File';
import assert from '../helpers/assertions';
import webpack from '../helpers/webpack';

import { mix, Mix } from '../helpers/mix';

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

test('It can copy files and handle versioning.', async t => {
    mix.js(`test/fixtures/app/src/js/app.js`, 'js');
    mix.copy(
        `test/fixtures/app/src/copy/file-1.txt`,
        `test/fixtures/app/dist/copy/file-1.txt`
    );
    mix.version();

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/copy/file-1.txt`));

    assert.manifestEquals(
        {
            '/copy/file-1.txt': '/copy/file-1.txt',
            '/js/app.js': '/js/app.js'
        },
        t
    );
});

test('It can copy directories and handle versioning.', async t => {
    mix.js(`test/fixtures/app/src/js/app.js`, 'js');
    mix.copy(`test/fixtures/app/src/copy`, `test/fixtures/app/dist/copy`);
    mix.version();

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/copy/file-1.txt`));
    t.true(File.exists(`test/fixtures/app/dist/copy/file-2.txt`));
    t.true(File.exists(`test/fixtures/app/dist/copy/dir-1/file-1.txt`));
    t.true(File.exists(`test/fixtures/app/dist/copy/dir-1/file-2.txt`));

    assert.manifestEquals(
        {
            '/copy/file-1.txt': '/copy/file-1.txt',
            '/copy/file-2.txt': '/copy/file-2.txt',
            '/js/app.js': '/js/app.js'
        },
        t
    );
});
