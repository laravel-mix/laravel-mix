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

    assert().manifestEquals({
        '/copy/file-1.txt': '/copy/file-1.txt',
        '/copy/file-2.txt': '/copy/file-2.txt',
        '/js/app.js': '/js/app.js'
    });
});

test.serial('It can copy dot files.', async t => {
    const { mix, assert, webpack } = context(t);

    mix.copy(`test/fixtures/app/src/.dotfile`, `test/fixtures/app/dist/.dotfile`);

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/.dotfile`).exists();
});
