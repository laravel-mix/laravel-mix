import test from 'ava';

import { context } from '../helpers/test.js';

test.serial(
    'it compiles JavaScript and copies the output to a new location.',
    async t => {
        const { mix, assert, webpack } = context(t);

        mix.js(`test/fixtures/app/src/js/app.js`, 'js');
        mix.copy(`test/fixtures/app/dist/js/app.js`, `test/fixtures/app/dist/somewhere`);

        await webpack.compile();

        assert().file(`test/fixtures/app/dist/somewhere/app.js`).exists();

        assert().manifestEquals({
            '/js/app.js': '/js/app.js',
            '/somewhere/app.js': '/somewhere/app.js'
        });
    }
);

test.serial('It can copy files and handle versioning.', async t => {
    const { mix, assert, webpack } = context(t);

    mix.js(`test/fixtures/app/src/js/app.js`, 'js');
    mix.copy(
        `test/fixtures/app/src/copy/file-1.txt`,
        `test/fixtures/app/dist/copy/file-1.txt`
    );
    mix.version();

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/copy/file-1.txt`).exists();

    assert().manifestEquals({
        '/copy/file-1.txt': '/copy/file-1.txt',
        '/js/app.js': '/js/app.js'
    });
});

test.serial('It can copy files multiple files at once', async t => {
    const { mix, assert, webpack } = context(t);

    mix.copy(
        [`test/fixtures/app/src/copy/dir-1`, `test/fixtures/app/src/copy/dir-2`],
        `test/fixtures/app/dist/copy`
    );

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/copy/file-1.txt`).exists();
    assert().file(`test/fixtures/app/dist/copy/file-2.txt`).exists();
    assert().file(`test/fixtures/app/dist/copy/file-3.txt`).exists();
    assert().file(`test/fixtures/app/dist/copy/file-4.txt`).exists();

    assert().manifestEquals({
        '/copy/file-1.txt': '/copy/file-1.txt',
        '/copy/file-2.txt': '/copy/file-2.txt',
        '/copy/file-3.txt': '/copy/file-3.txt',
        '/copy/file-4.txt': '/copy/file-4.txt'
    });
});

test.serial('It can copy directories and handle versioning.', async t => {
    const { mix, assert, webpack } = context(t);

    mix.js(`test/fixtures/app/src/js/app.js`, 'js');
    mix.copy(`test/fixtures/app/src/copy`, `test/fixtures/app/dist/copy`);
    mix.version();

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/copy/file-1.txt`).exists();
    assert().file(`test/fixtures/app/dist/copy/file-2.txt`).exists();
    assert().file(`test/fixtures/app/dist/copy/dir-1/file-1.txt`).exists();
    assert().file(`test/fixtures/app/dist/copy/dir-1/file-2.txt`).exists();
    assert().file(`test/fixtures/app/dist/copy/dir-2/file-3.txt`).exists();
    assert().file(`test/fixtures/app/dist/copy/dir-2/file-4.txt`).exists();

    assert().manifestEquals({
        '/copy/file-1.txt': '/copy/file-1.txt',
        '/copy/file-2.txt': '/copy/file-2.txt',
        '/copy/dir-1/file-1.txt': '/copy/dir-1/file-1.txt',
        '/copy/dir-1/file-2.txt': '/copy/dir-1/file-2.txt',
        '/copy/dir-2/file-3.txt': '/copy/dir-2/file-3.txt',
        '/copy/dir-2/file-4.txt': '/copy/dir-2/file-4.txt',
        '/js/app.js': '/js/app.js'
    });
});

test.serial('It can copy dot files.', async t => {
    const { mix, assert, webpack } = context(t);

    mix.copy(`test/fixtures/app/src/.dotfile`, `test/fixtures/app/dist/.dotfile`);

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/.dotfile`).exists();
    assert().file(`test/fixtures/app/dist/.dotfile/.dotfile`).absent();

    assert().manifestEquals({
        '/.dotfile': '/.dotfile'
    });
});

test.serial(
    'It does not list hidden files in the manifest when copying directories',
    async t => {
        const { mix, assert, webpack } = context(t);

        mix.copy(`test/fixtures/app/src/copy`, `test/fixtures/app/dist/copy`);

        await webpack.compile();

        assert().file(`test/fixtures/app/dist/copy/.hidden-1`).exists();
        assert().file(`test/fixtures/app/dist/copy/dir-1/.hidden-1`).exists();
        assert().file(`test/fixtures/app/dist/copy/dir-2/.hidden-1`).exists();

        assert().manifestEquals({
            '/copy/file-1.txt': '/copy/file-1.txt',
            '/copy/file-2.txt': '/copy/file-2.txt',
            '/copy/dir-1/file-1.txt': '/copy/dir-1/file-1.txt',
            '/copy/dir-1/file-2.txt': '/copy/dir-1/file-2.txt',
            '/copy/dir-2/file-3.txt': '/copy/dir-2/file-3.txt',
            '/copy/dir-2/file-4.txt': '/copy/dir-2/file-4.txt'
        });
    }
);

test.serial(
    'Copying files into a directory destination does not include that dir in the manifest',
    async t => {
        const { mix, assert, webpack } = context(t);

        mix.copy(`test/fixtures/app/src/js/app.js`, `test/fixtures/app/src/copy`);

        await webpack.compile();

        assert().manifestEquals({
            '/test/fixtures/app/src/copy/app.js': '/test/fixtures/app/src/copy/app.js'
        });
    }
);
