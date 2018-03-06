import test from 'ava';
import mix from '../src/index';
import Manifest from '../src/Manifest';
import fs from 'fs-extra';

test.beforeEach(() => (Mix.manifest = new Manifest()));

test('that it can fetch the underlying manifest object', t => {
    Mix.manifest.add('file/path.js');

    t.deepEqual({ '/file/path.js': '/file/path.js' }, Mix.manifest.get());
});

test('that it can get fetch a single versioned path from the underlying manifest', t => {
    Config.publicPath = 'public';

    Mix.manifest.add('file/path.js');

    t.is('public/file/path.js', Mix.manifest.get('file/path.js'));
});

test('it transforms the generated stats assets to the appropriate format', t => {
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

test('it can get the underlying manifest object', t => {
    t.deepEqual({}, Mix.manifest.get());
});

test('it knows the path to the underlying file', t => {
    t.is(
        path.join(Config.publicPath, 'mix-manifest.json'),
        Mix.manifest.path()
    );
});

test('it can be refreshed', t => {
    mix.setPublicPath(__dirname);

    new File(Mix.manifest.path()).write('{}');
    new File(path.resolve(__dirname, 'js/app.js'))
        .makeDirectories()
        .write('var foo;');

    // The initial state of the manifest file should be an empty object.
    t.deepEqual({}, Mix.manifest.read());

    // But after we add to the manifest, and then refresh it...
    Mix.manifest.add('js/app.js').refresh();

    // Then the manifest file should be updated on the fs.
    t.deepEqual({ '/js/app.js': '/js/app.js' }, Mix.manifest.read());

    // Cleanup.
    File.find(Mix.manifest.path()).delete();
    fs.removeSync(path.resolve(__dirname, 'js'));
});

test('it sorts files on the underlying manifest object', t => {
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
