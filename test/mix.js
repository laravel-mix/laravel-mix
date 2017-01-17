import test from 'ava';
import { mix, config as Mix } from '../src/index';
import path from 'path';
import File from '../src/File';
import sinon from 'sinon';

test.afterEach('cleanup', t => {
    mix.reset();
});

test('that it throws exception if mix.js() was not called', t => {
    const error = t.throws(() => {
        mix.sass('sass/stub.scss', 'dist');
        Mix.entry();
    }, Error);

    t.is(error.message, 'Laravel Mix: You must call "mix.js()" once or more.');

    mix.reset();

    t.notThrows(() => {
        mix.js('js/stub.js', 'dist');
        mix.sass('css/stub.css', 'dist');
        Mix.entry();
    }, Error);
});

test('initializes properly', t => {
    const initSpy = sinon.spy(Mix, 'initialize');
    // Test if (rootPath) branch
    Mix.initialize(path.resolve(__dirname, 'fixtures'));
    t.true(initSpy.called);
    // Test rootPath = '' branch
    Mix.initialize();
    t.true(initSpy.called);
    // Test if (this.versioning) branch
    Mix.versioning = true;
    Mix.initialize();
    t.true(initSpy.called);
    Mix.versioning = false;
    // Test if (this.isUsingLaravel()) branch
    const artisan = new mix.config.File('./artisan').write('I am Laravel');
    Mix.initialize();
    t.true(initSpy.called);
    t.is(Mix.publicPath, 'public');
    artisan.delete();
    t.is(initSpy.callCount, 4);
});

test('that it determines the JS paths', t => {
    mix.js('js/stub.js', 'dist')
       .js('js/another.js', 'dist');

    let js = mix.config.js;
    let root = path.resolve(__dirname, '../');

    t.is(path.resolve(root, 'js/stub.js'), js[0].entry[0].path);
    t.is(path.resolve(root, 'js/another.js'), js[1].entry[0].path);
    t.is('dist/stub.js', js[0].output.path);
    t.falsy(js[0].vendor);

    // We can also pass an array of entry scripts, to be bundled together.
    mix.reset();

    mix.js(['js/stub.js', 'js/another.js'], 'dist/bundle.js');
    t.is('dist/bundle.js', mix.config.js[0].output.path);
    t.is(2, mix.config.js[0].entry.length);
});

test('that it merges webpack configs', t => {
    mix.webpackConfig({ entry: 'stub' });
    Mix.finalize({ output: 'stub' });
    t.deepEqual(Mix.webpackConfig, { entry: 'stub', output: 'stub' });
    // Test mergeWith customizer function
    mix.webpackConfig({ entry: [1] });
    Mix.finalize({ entry: [2] });
    t.deepEqual(Mix.webpackConfig, { entry: [1, 2] });
    // Now test with empty webpackConfig
    Mix.webpackConfig = null;
    Mix.finalize();
    t.is(Mix.webpackConfig, null);
});

test('that it determines the CSS output path correctly.', t => {
    mix.setPublicPath('./public')
       .js('js/stub.js', 'dist')
       .less('sass/stub.scss', 'dist/stub.css');

    const segments = mix.config.less;

    // Test the cssOutput which gets passed to ExtractTextPlugin
    segments.forEach(s => {
        t.is('dist/stub.css', Mix.cssOutput(s));
    });
    // Test to see if it returns hashedPath in production
    Mix.versioning = true;
    Mix.inProduction = true;
    segments.forEach(s => {
        t.is('dist/stub.[hash].css', Mix.cssOutput(s));
    });
    Mix.versioning = false;
    Mix.inProduction = false;

    // Test else path for this.cssPreprocessor being empty
    Mix.cssPreprocessor = false;
    t.deepEqual(Mix.entry(),
        { stub: [path.resolve(__dirname, '../js/stub.js')] }); //js/stub.js
                                                               // from above
});
// test('that the CSS output path works properly', t => {
//
// });


test('that it calculates the output correctly', t => {
    mix.js('js/stub.js', 'dist').sass('sass/stub.scss', 'dist');

    t.deepEqual({
        path: './public',
        filename: 'dist/[name].js',
        publicPath: './'
    }, mix.config.output());


    // Enabling Hot Reloading should change this output.
    mix.config.hmr = true;

    t.deepEqual({
        path: '/',
        filename: 'dist/[name].js',
        publicPath: 'http://localhost:8080/'
    }, mix.config.output());


    // Extracting vendor libraries should change this output.
    mix.config.hmr = false;
    mix.extract(['some-lib']);

    t.deepEqual({
        path: './public',
        filename: 'dist/[name].js',
        publicPath: './'
    }, mix.config.output());

});

test('that it calculates versioned output correctly', t => {

    mix.js('js/stub.js', 'dist').sass('sass/stub.scss', 'dist');

    // turn on versioning and fake production env
    // since versioninig only works in production
    mix.version();
    mix.config.inProduction = true;

    t.deepEqual({
        path: './public',
        filename: 'dist/[name].[chunkhash].js',
        publicPath: './'
    }, mix.config.output());

    // Enabling Hot Reloading should change this output.
    mix.config.hmr = true;

    t.deepEqual({
        path: '/',
        filename: 'dist/[name].[chunkhash].js',
        publicPath: 'http://localhost:8080/'
    }, mix.config.output());

    mix.config.hmr = false;
    mix.extract(['some-lib']);

    t.deepEqual({
        path: './public',
        filename: 'dist/[name].[chunkhash].js',
        publicPath: './'
    }, mix.config.output());

});


test('that it knows if it is running within a Laravel project', t => {
    t.falsy(mix.config.isUsingLaravel());

    // If an ./artisan file exists in the root, it's a Laravel app.
    let artisan = new mix.config.File('./artisan').write('I am Laravel');

    t.truthy(mix.config.isUsingLaravel());

    artisan.delete();
});
test('that it can combine and minify files', t => {
    const file1Path = path.resolve(__dirname, 'fixtures/file1.txt');
    const file2Path = path.resolve(__dirname, 'fixtures/file2.txt');
    const file1 = new File(file1Path).write('1+1');
    const file2 = new File(file2Path).write('=2');

    mix.combine([file1Path, file2Path],
        path.resolve(__dirname, 'fixtures/file3.txt'));
    mix.minify('fixtures/file3.txt');

    // First see if it does nothing without being in production
    mix.config.inProduction = false;
    Mix.concatenateAll().minifyAll();

    t.true(Array.isArray(Mix.combine));
    t.true(Array.isArray(Mix.minify));

    // fake prod since concatenateAll and minifyAll check production env
    mix.config.inProduction = true;
    Mix.concatenateAll().minifyAll();

    // finally test if minifyAll and concatenateAll fallback to empty array
    // files = files || this.combine || []; <-- third branch
    Mix.minify = null;
    Mix.combine = null;
    Mix.concatenateAll().minifyAll();

    t.deepEqual(Mix.combine, null);
    t.deepEqual(Mix.minify, null);

    const file3 = new File(path.resolve(__dirname, 'fixtures/file3.txt'));
    t.is(file3.read(), '1+1\n=2');

    file1.delete();
    file2.delete();
    file3.delete();
});
test('that it detects hmr correctly', t => {
    const root = path.resolve(__dirname);
    mix.setPublicPath(root);
    const hmrFile = Mix.publicPath + '/hot';

    Mix.detectHotReloading(); // normal
    t.false(Mix.hmr);
    Mix.detectHotReloading(true); // force hmr mode
    t.true(Mix.hmr);
    t.true(File.exists(hmrFile));
    Mix.detectHotReloading(); // run it again in normal mode to delete the file
    t.false(Mix.hmr);
    t.false(File.exists(hmrFile));
});
test('that it reads babel config properly', t => {
    // First lets test when there's no .babelrc
    const root = path.resolve(__dirname);
    Mix.Paths.setRootPath(root);
    let config = Mix.babelConfig();
    t.is(config,
        "?{\"cacheDirectory\":true,\"presets\":[[\"es2015\",{\"modules\":false}]]}");
    // Now create a fake .babelrc
    const babel = new File(root + '/.babelrc').write(JSON.stringify(
        { "presets": ["react", ["es2015", { "modules": false }]] }));
    config = Mix.babelConfig();
    t.is(config, "?cacheDirectory");
    babel.delete();
});
// test all methods that all they do is set a value
test('that setter methods work properly', t => {
    const root = path.resolve(__dirname);
    mix.setCachePath('./');
    t.is(Mix.cachePath, './');

    mix.disableNotifications();
    t.false(Mix.notifications);

    // Source maps
    mix.config.inProduction = false;
    mix.sourceMaps();
    t.is(Mix.sourcemaps, '#inline-source-map');

    mix.config.inProduction = true;
    mix.sourceMaps();
    t.is(Mix.sourcemaps, '#source-map');

    mix.copy('fake/*.txt', path.resolve(__dirname, 'fixtures'));
    Mix.Paths.setRootPath(root);
    t.deepEqual(Mix.copy,
        [{ from: 'fake/*.txt', to: Mix.Paths.root('fixtures') }]);

    Mix.minify = [];
    mix.minify('fake/test.txt');
    t.deepEqual(Mix.minify, ['fake/test.txt']);
});
