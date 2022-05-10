import test from 'ava';
import path from 'path';
import { fileURLToPath } from 'url';

import { context } from '../helpers/test.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('that it can fetch the underlying manifest object', async t => {
    const { Mix } = context(t);

    Mix.manifest.add('file/path.js');

    t.deepEqual({ '/file/path.js': '/file/path.js' }, Mix.manifest.get());
});

test('that it can fetch a single versioned path from the underlying manifest', async t => {
    const { Mix } = context(t);

    Mix.config.publicPath = 'public';

    Mix.manifest.add('file/path.js');

    t.is('public/file/path.js', Mix.manifest.get('file/path.js'));
});

test('it transforms the generated stats assets to the appropriate format', async t => {
    const { Mix } = context(t);

    let stats = {
        assetsByChunkName: { '/js/app': ['/js/app.js', 'css/app.css'] }
    };

    Mix.manifest.transform(stats);

    t.deepEqual(
        {
            '/js/app.js': '/js/app.js',
            '/css/app.css': '/css/app.css'
        },
        Mix.manifest.get()
    );
});

test('it can get the underlying manifest object', async t => {
    const { Mix } = context(t);

    t.deepEqual({}, Mix.manifest.get());
});

test('it knows the path to the underlying file', async t => {
    const { Mix } = context(t);

    t.is(path.join(Mix.config.publicPath, 'mix-manifest.json'), Mix.manifest.path());
});

test.serial('it can be refreshed', async t => {
    const { fs, mix, Mix } = context(t);

    mix.setPublicPath(__dirname);

    await fs().stub({
        [Mix.manifest.path()]: '{}',
        [path.resolve(__dirname, 'js/app.js')]: 'var foo;'
    });

    // The initial state of the manifest file should be an empty object.
    t.deepEqual({}, Mix.manifest.read());

    // But after we add to the manifest, and then refresh it...
    Mix.manifest.add('js/app.js').refresh();

    // Then the manifest file should be updated on the fs.
    t.deepEqual({ '/js/app.js': '/js/app.js' }, Mix.manifest.read());
});

test('it sorts files on the underlying manifest object', async t => {
    const { Mix } = context(t);

    Mix.manifest.add('/path2.js');
    Mix.manifest.add('/path3.js');
    Mix.manifest.add('/path1.js');
    Mix.manifest.add('/path4.js');

    let manifest = Mix.manifest.get();

    t.is(
        ['/path1.js', '/path2.js', '/path3.js', '/path4.js'].join(),
        Object.keys(manifest).join()
    );
});

test.serial('A manifest is created by default ', async t => {
    const { assert, webpack } = context(t);

    await webpack.compile();

    assert().file('test/fixtures/app/dist/mix-manifest.json').exists();
});

test.serial('The name of the manifest can be changed', async t => {
    const { assert, mix, webpack } = context(t);

    mix.options({ manifest: 'manifest.json' });

    await webpack.compile();

    assert().file('test/fixtures/app/dist/manifest.json').exists();
    assert().file('test/fixtures/app/dist/mix-manifest.json').absent();
});

test.serial('You can change the manfest path to a relative path', async t => {
    const { assert, mix, webpack } = context(t);

    mix.options({ manifest: '../manifest.json' });

    await webpack.compile();

    assert().file('test/fixtures/app/manifest.json').exists();
    assert().file('test/fixtures/app/dist/mix-manifest.json').absent();
});

test.serial('Manifest generation can be disabled', async t => {
    const { assert, mix, webpack } = context(t);

    mix.options({
        manifest: false
    });

    await webpack.compile();

    assert().file('test/fixtures/app/dist/mix-manifest.json').absent();
});

test.serial(
    'Overwriting the manifest plugin with a custom name preserves old behavior',
    async t => {
        const { assert, mix, Mix, webpack } = context(t);

        mix.options({ manifest: 'foo.json' });
        Mix.manifest.name = 'bar.json';

        await webpack.compile();

        assert().file('test/fixtures/app/dist/mix-manifest.json').absent();
        assert().file('test/fixtures/app/dist/foo.json').absent();
        assert().file('test/fixtures/app/dist/bar.json').exists();
    }
);
