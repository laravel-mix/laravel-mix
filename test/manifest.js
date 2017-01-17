import test from 'ava';
import path from 'path';
import Manifest from '../src/Manifest';
import File from '../src/File';
import ObjectValues from 'lodash/values';

let manifestPath = null;
let manifestFile = null;
let manifest = null;
let json = `{"app.js":"fixtures/app.js","app.css":"fixtures/app.css"}`;
test.before(t => {

    manifestPath = path.resolve(__dirname, 'manifest.json');
    // We gotta fake creation
    // since ManifestPlugin() takes care of creating this file
    manifestFile = new File(manifestPath).write(json);
    new File(path.resolve(__dirname, 'fixtures/app.css')).write('css file');
    new File(path.resolve(__dirname, 'fixtures/app.js')).write('js file');
});
test.after.always(t => {
    manifestFile.delete();
});
test('that manifest.json is created', t => {
    manifest = new Manifest(manifestFile.file);
    t.is(manifest.path, manifestPath);
});
test('that manifest.json exists', t => {
    t.is(manifest.exists(), true);
});
test('that it reads json from manifest', t => {
    t.deepEqual(manifest.read(), JSON.parse(json));
});
test('that it can remove manifest files', t => {
    const filesToDelete = ObjectValues(manifest.read());
    filesToDelete.forEach(f => {
        manifest.remove(path.resolve(__dirname, f));
    });
});
