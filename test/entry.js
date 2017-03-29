import test from 'ava';
import mix from '../src/index';

let entry = global.entry;
global.options.publicPath = 'public';

test.beforeEach(() => {
    entry = entry.reset();
});


test('that it adds to the Webpack entry', t => {
    entry.addScript('resources/assets/js/app.js', 'public/js');

    t.deepEqual({
        '/js/app': [path.resolve('resources/assets/js/app.js')]
    }, entry.get());

    entry.addScript('resources/assets/js/admin.js', 'public/js/backend.js');

    t.deepEqual({
        '/js/app': [path.resolve('resources/assets/js/app.js')],
        '/js/backend': [path.resolve('resources/assets/js/admin.js')]
    }, entry.get());
});


test('that it appends CSS compile requests to the first script entry', t => {
    entry.addScript('resources/assets/js/app.js', 'public/js')
        .addStylesheet('resources/assets/sass/app.scss', 'public/css');

    t.deepEqual({
        '/js/app': [
            path.resolve('resources/assets/js/app.js'),
            path.resolve('resources/assets/sass/app.scss')
        ]
    }, entry.get());
});


test('that it adds vendor extractions to the entry object', t => {
    entry.addScript('resources/assets/js/app.js', 'public/js')
        .addVendor(['some-library']);

    t.deepEqual({
        '/js/app': [
            path.resolve('resources/assets/js/app.js')
        ],
        '/js/vendor': ['some-library']
    }, entry.get());
});


test('that it adds vendor extractions with a custom output path', t => {
    entry.addScript('resources/assets/js/app.js', 'public/js')
        .addVendor(['some-library'], 'public/somewhere/vendor.js');

    t.deepEqual({
        '/js/app': [
            path.resolve('resources/assets/js/app.js')
        ],
        '/somewhere/vendor': ['some-library']
    }, entry.get());
});


test('that it tracks whether scripts have been registered', t => {
    t.false(entry.hasScripts());

    entry.addScript('resources/assets/js/app.js', 'public/js');

    t.true(entry.hasScripts());
});


test('that it tracks whether extractions have been registered', t => {
    entry.addScript('resources/assets/js/app.js', 'public/js');

    t.false(entry.hasExtractions());

    entry.addVendor(['some-lib']);

    t.true(entry.hasExtractions());
});


test('that it gets the extractions and includes the Webpack manifest', t => {
    entry.addScript('resources/assets/js/app.js', 'public/js')
        .addVendor(['some-lib']);

    t.deepEqual(['/js/vendor', '/js/manifest'], entry.getExtractions());
});


test('that it uses a dummy entry script if none is provided', t => {
    entry.addStylesheet('resources/assets/sass/app.scss', 'public/css');

    t.deepEqual({
        mix: [
            path.resolve('src', 'mock-entry.js'),
            path.resolve('resources/assets/sass/app.scss')
        ]
    }, entry.get());
});
