import test from 'ava';
import path from 'path';
import File from '../src/File';
import Versioning from '../src/Versioning';
import Manifest from '../src/Manifest';

let manifestPath = null;
let manifestFile = null;
let jsFile = null;
let cssFile = null;
let version = null;
let root = path.resolve(__dirname);
let json = `{"app.js":"fixtures/versionapp.js","app.css":"fixtures/versionapp.css"}`;


test.before(t => {
    manifestPath = path.resolve(__dirname, 'versioning.json');
    manifestFile = new File(manifestPath).write(json);
    cssFile = new File(path.resolve(__dirname, 'fixtures/versionapp.css')).write('css file');
    jsFile = new File(path.resolve(__dirname, 'fixtures/versionapp.js')).write('js file');
});


test.beforeEach(() => {
    let manifest = new Manifest(manifestPath);

    version = new Versioning(
        [], manifest, root
    );
});


test('creates a new versioning instance', t => {
    let manifestPath = root +'/versioning.json';

    t.is(version.manifest.path, manifestPath);
});

// TODO: Test version pruning.
