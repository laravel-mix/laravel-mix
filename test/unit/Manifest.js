import test from 'ava';
import { promises as fs } from 'fs';
import path from 'path';

import File from '../../src/File.js';
import Manifest from '../../src/Manifest.js';
import assertions from '../helpers/assertions.js';
import { mix, Mix } from '../helpers/mix.js';
import webpack from '../helpers/webpack.js';

test.beforeEach(() => {
    Mix.manifest = new Manifest();
});

test('that it can fetch the underlying manifest object', t => {
    Mix.manifest.add('file/path.js');

    t.deepEqual({ '/file/path.js': '/file/path.js' }, Mix.manifest.get());
});

test('that it can fetch a single versioned path from the underlying manifest', t => {
    Mix.config.publicPath = 'public';

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
    t.is(path.join(Mix.config.publicPath, 'mix-manifest.json'), Mix.manifest.path());
});

test('it can be refreshed', async t => {
    mix.setPublicPath(__dirname);

    new File(Mix.manifest.path()).write('{}');
    new File(path.resolve(__dirname, 'js/app.js')).makeDirectories().write('var foo;');

    // The initial state of the manifest file should be an empty object.
    t.deepEqual({}, Mix.manifest.read());

    // But after we add to the manifest, and then refresh it...
    Mix.manifest.add('js/app.js').refresh();

    // Then the manifest file should be updated on the fs.
    t.deepEqual({ '/js/app.js': '/js/app.js' }, Mix.manifest.read());

    // Cleanup.
    File.find(Mix.manifest.path()).delete();
    await fs.rmdir(path.resolve(__dirname, 'js'), { recursive: true });
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

test('A manifest is created by default ', async t => {
    await webpack.compile();

    assertions.fileExists('test/fixtures/app/dist/mix-manifest.json', t);
});

test('The name of the manifest can be changed', async t => {
    mix.options({ manifest: 'manifest.json' });

    await webpack.compile();

    assertions.fileExists('test/fixtures/app/dist/manifest.json', t);
    assertions.fileDoesNotExist('test/fixtures/app/dist/mix-manifest.json', t);
});

test('You can change the manfest path to a relative path', async t => {
    mix.options({ manifest: '../manifest.json' });

    await webpack.compile();

    assertions.fileExists('test/fixtures/app/manifest.json', t);
    assertions.fileDoesNotExist('test/fixtures/app/dist/mix-manifest.json', t);
});

test('Manifest generation can be disabled', async t => {
    mix.options({
        manifest: false
    });

    await webpack.compile();

    assertions.fileDoesNotExist('test/fixtures/app/dist/mix-manifest.json', t);
});

test('Overwriting the manifest plugin with a custom name preserves old behavior', async t => {
    mix.options({ manifest: 'foo.json' });
    Mix.manifest.name = 'bar.json';

    await webpack.compile();

    assertions.fileDoesNotExist('test/fixtures/app/dist/mix-manifest.json', t);
    assertions.fileDoesNotExist('test/fixtures/app/dist/foo.json', t);
    assertions.fileExists('test/fixtures/app/dist/bar.json', t);
});
