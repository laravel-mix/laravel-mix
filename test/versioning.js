import test from 'ava';
import path from 'path';
import File from '../src/File';
import Versioning from '../src/Versioning';
import Manifest from '../src/Manifest';

let manifestPath = null;
let manifestFile = null;
let json = `{"app.js":"fixtures/versionapp.js","app.css":"fixtures/versionapp.css"}`;
let jsFile = null;
let cssFile = null;
let version = null;
let root = path.resolve(__dirname);

test.before(t => {

    manifestPath = path.resolve(__dirname, 'versioning.json');
    // We gotta fake creation
    // since ManifestPlugin() takes care of creating this file
    manifestFile = new File(manifestPath).write(json);
    cssFile = new File(path.resolve(__dirname, 'fixtures/versionapp.css')).write('css file');
    jsFile = new File(path.resolve(__dirname, 'fixtures/versionapp.js')).write('js file');
});
test.after.always('cleanup', t => {
    manifestFile.delete();
    cssFile.delete();
    jsFile.delete();
});
test('creates a new versioning instance', t => {
    version = new Versioning(
        new Manifest(root + '/versioning.json')
    );
    t.is(version.manifest.path, root + '/versioning.json');
    t.deepEqual(version.files, []);
});

test('it records versioned files', t => {
    version.record();
    t.deepEqual(version.files, ["fixtures/versionapp.js","fixtures/versionapp.css"]);
});

test('it resets versioned files', t => {
    version.reset();
    t.deepEqual(version.files, []);
});
test('that it replaces all old hashed files with new version', t => {
    // Make sure file exists
    t.true(File.exists(cssFile.file));
    t.true(File.exists(jsFile.file));

    // Prune with nothing updated
    version.prune(root);
    t.deepEqual(version.files, ["fixtures/versionapp.js","fixtures/versionapp.css"]);
    // Fake a manifest.json update
    const updatedJson = JSON.parse(json);
    delete updatedJson['app.css'];
    manifestFile.write(JSON.stringify(updatedJson));
    // See if prune works...
    version.prune(root);
    t.deepEqual(version.files, ["fixtures/versionapp.js"]);
});
test('that it fails without a manifest.json', t => {
    manifestFile.delete();
    version.reset();
    version.prune(root);
    t.deepEqual(version.files, []);
});
