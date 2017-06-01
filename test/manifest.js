import test from 'ava';
import mockFs from 'mock-fs';
import mix from '../src/index';
import Manifest from '../src/Manifest';

test.beforeEach(() => Mix.manifest = new Manifest());


test('that it can get fetch the underlying manifest object', t => {
    Mix.manifest.add('file/path.js');

    t.deepEqual({ '/file/path.js': '/file/path.js' }, Mix.manifest.get());
});


test('that it can get fetch a single versioned path from the underlying manifest', t => {
    Config.publicPath = 'public';

    Mix.manifest.add('file/path.js');

    t.is('public/file/path.js', Mix.manifest.get('file/path.js'));
});


test('it transforms the generated stats assets to the appropriate format', t => {
    let stats = { assetsByChunkName: { '/js/app': [ '/js/app.a218bd06338f6bc2f5ec.js', 'css/app.a77184666fc90f945bfb72e339c8dcf1.css' ] } };

    let transformed = Mix.manifest.transform(stats);

    t.deepEqual(JSON.stringify({
        '/js/app.js': '/js/app.a218bd06338f6bc2f5ec.js',
        '/css/app.css': '/css/app.a77184666fc90f945bfb72e339c8dcf1.css'
    }, null, 2), transformed);
});


test('it can get the underlying manifest object', t => {
    t.deepEqual({}, Mix.manifest.get());
});


test('it knows the path to the underlying file', t => {
    t.is(path.join(Config.publicPath, 'mix-manifest.json'), Mix.manifest.path());
});


test('it can be refreshed', t => {
    mix.setPublicPath(__dirname);

    mockFs({
        [__dirname + '/js/app.js']: 'var foo;',
        [Mix.manifest.path()]: '{}'
    });

    // The initial state of the manifest file should be an empty object.
    t.deepEqual({}, Mix.manifest.read());

    // But after we add to the manifest, and then refresh it...
    Mix.manifest.add(__dirname + '/js/app.js').refresh();

    // Then the manifest file should be updated on the fs.
    t.deepEqual({ '/js/app.js': '/js/app.js' }, Mix.manifest.read());

    mockFs.restore();
});
