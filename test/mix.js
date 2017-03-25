import test from 'ava';
import mix from '../src/index';
var Mix = mix.config;
import sinon from 'sinon';

let entry = path.resolve('src/mock-entry.js');

test.afterEach('cleanup', t => {
    Mix.entryBuilder.reset();
});


test('that it uses a default entry, if mix.js() is never called', t => {
    t.deepEqual(
        { mix: [entry] },
        Mix.entry()
    );
});


test('that you can use mix.sass() without mix.js()', t => {
    mix.sass('sass/stub.scss', 'dist');

    t.deepEqual(
        {
            mix: [
                entry,
                path.resolve('sass/stub.scss')
            ]
        },
        Mix.entry()
    );
});


test('that it determines the JS paths', t => {
    mix.js('js/stub.js', 'dist')
       .js('js/another.js', 'dist');

    let js = global.scripts.get();
    let root = path.resolve(__dirname, '../');

    t.is(path.resolve(root, 'js/stub.js'), js[0].entry[0].path);
    t.is(path.resolve(root, 'js/another.js'), js[1].entry[0].path);
    t.is('dist/stub.js', js[0].output.path);
    t.falsy(js[0].vendor);

    // reset
    global.scripts.reset();

    // We can also pass an array of entry scripts, to be bundled together.
    mix.js(['js/stub.js', 'js/another.js'], 'dist/bundle.js');

    js = global.scripts.get();
    t.is('dist/bundle.js', js[0].output.path);
    t.is(2, js[0].entry.length);
});


test('that it calculates the output correctly', t => {
    mix.js('js/stub.js', 'dist')
       .sass('sass/stub.scss', 'dist');

    t.deepEqual({
        path: path.resolve(''),
        filename: '[name].js',
        chunkFilename: "dist/[name].js",
        publicPath: ''
    }, mix.config.output());


    // Enabling Hot Reloading should change this output.
    Mix.options.hmr = true;

    t.deepEqual({
        path: path.resolve('/'),
        filename: '[name].js',
        chunkFilename: "dist/[name].js",
        publicPath: 'http://localhost:8080'
    }, mix.config.output());


    // Extracting vendor libraries should change this output.
    Mix.options.hmr = false;
    mix.extract(['some-lib']);

    t.deepEqual({
        path: path.resolve(''),
        filename: '[name].js',
        chunkFilename: "dist/[name].js",
        publicPath: ''
    }, mix.config.output());
});


test('that it calculates versioned output correctly', t => {
    mix.js('js/stub.js', 'dist')
       .sass('sass/stub.scss', 'dist');

    // turn on versioning and fake production env
    // since versioninig only works in production
    mix.version();
    mix.config.inProduction = true;

    t.deepEqual({
        path: path.resolve(''),
        filename: '[name].[chunkhash].js',
        chunkFilename: "dist/[name].[chunkhash].js",
        publicPath: ''
    }, Mix.output());

    // // Enabling Hot Reloading should change this output.
    Mix.options.hmr = true;

    t.deepEqual({
        path: path.resolve('/'),
        filename: '[name].[chunkhash].js',
        chunkFilename: "dist/[name].[chunkhash].js",
        publicPath: 'http://localhost:8080'
    }, Mix.output());

    Mix.options.hmr = false;
    mix.extract(['some-lib']);

    t.deepEqual({
        path: path.resolve(''),
        filename: '[name].[chunkhash].js',
        chunkFilename:"dist/[name].[chunkhash].js",
        publicPath: ''
    }, Mix.output());
});


test('that it knows if it is running within a Laravel project', t => {
    t.falsy(mix.config.isUsingLaravel());

    // If an ./artisan file exists in the root, it's a Laravel app.
    let artisan = new File('./artisan').write('I am Laravel');

    t.truthy(Mix.isUsingLaravel());

    artisan.delete();
});


test('that it detects hmr correctly', t => {
    let hmrFile = path.resolve(__dirname, Mix.options.publicPath + '/hot');

    Mix.detectHotReloading(); // normal
    t.false(Mix.options.hmr);

    Mix.detectHotReloading(true); // force hmr mode
    t.true(Mix.options.hmr);
    t.true(File.exists(hmrFile));
    Mix.options.hmr = false; // reset

    Mix.detectHotReloading(); // run it again in normal mode to delete the file
    t.false(Mix.options.hmr);
    t.false(File.exists(hmrFile));
});


// test all methods that all they do is set a value
test('that the setter methods work properly', t => {
    let root = path.resolve(__dirname);

    mix.disableNotifications();
    t.false(Mix.options.notifications);

    // // Source maps
    Mix.inProduction = false;
    mix.sourceMaps();
    t.is(Mix.options.sourcemaps, '#inline-source-map');

    Mix.inProduction = true;
    mix.sourceMaps();
    t.is(Mix.options.sourcemaps, false);

    mix.copy('fake/*.txt', path.resolve(__dirname, 'fixtures'));
    Mix.Paths.setRootPath(root);
    t.deepEqual(Mix.copy,
        [{ from: 'fake/*.txt', to: Mix.Paths.root('fixtures'), flatten: true }]);
});
