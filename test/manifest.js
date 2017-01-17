import test from 'ava';
import path from 'path';
import Manifest from '../src/Manifest';
import File from '../src/File';
import ObjectValues from 'lodash/values';

let manifestPath = null;
let manifestFile = null;
let manifest = null;

let json = '{"/js/app.js":"/js/app.js","/css/app.css":"/css/app.css","/css/forum.css":"/css/forum.css","/js/admin.js":"/js/admin.js"}';

test.before(t => {
    manifestPath = path.resolve(__dirname, 'mix-manifest.json');
    manifestFile = new File(manifestPath).write(json);

    new File(path.resolve(__dirname, 'fixtures/app.css')).write('css file');
    new File(path.resolve(__dirname, 'fixtures/app.js')).write('js file');

    manifest = new Manifest(manifestFile.file);
});


test.after.always(t => {
    manifestFile.delete();
});


test('that the mix-manifest.json path is set', t => {
    t.is(manifest.path, manifestPath);
});


test('that the mix-manifest.json file exists', t => {
    t.is(manifest.exists(), true);
});


test('that it reads parses the JSON from the manifest', t => {
    t.deepEqual(manifest.read(), JSON.parse(json));
});


test('that it transforms the Webpack stats to a format we require', t => {
    let transformed = manifest.transform({
        assetsByChunkName: {
            app: [
                '/js/app.js',
                '/css/app.css',
                '/css/forum.css'
            ],

            admin: '/js/admin.js'
        }
    });

    t.deepEqual({
        '/js/app.js': '/js/app.js',
        '/css/app.css': '/css/app.css',
        '/css/forum.css': '/css/forum.css',
        '/js/admin.js': '/js/admin.js'
    }, JSON.parse(transformed));
});


test('that it can remove the manifest file', t => {
    let filesToDelete = ObjectValues(manifest.read());

    filesToDelete.forEach(f => {
        manifest.remove(path.resolve(__dirname, f));
    });
});
