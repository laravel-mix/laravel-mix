import test from 'ava';
import * as mix from '../src/index';
const Mix = mix.config;
import path from 'path';
import File from '../src/File';
import sinon from 'sinon';

test.afterEach('cleanup', t => {
    Mix.reset();
});


test('that it uses a default entry, if mix.js() is never called', t => {
    let entry = path.resolve('mix-entry.js');

    t.deepEqual(
        { mix: [entry] },
        Mix.entry()
    );

    new Mix.File(entry).delete();
});


test('that you can use mix.sass() without mix.js()', t => {
    let entry = path.resolve('mix-entry.js');

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

    new Mix.File(entry).delete();
});


test('that Mix initializes properly', t => {
    let initSpy = sinon.spy(Mix, 'initialize');

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
    let artisan = new mix.config.File('./artisan').write('I am Laravel');
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

    Mix.reset();

    // We can also pass an array of entry scripts, to be bundled together.
    mix.js(['js/stub.js', 'js/another.js'], 'dist/bundle.js');
    t.is('dist/bundle.js', mix.config.js[0].output.path);
    t.is(2, mix.config.js[0].entry.length);
});


test('that it can merge a user\'s Webpack config', t => {
    mix.webpackConfig({ entry: 'override' });
    t.deepEqual(
        Mix.finalize({ entry: 'default' }),
        { entry: 'override' }
    );

    mix.webpackConfig({ entry: [1] });
    t.deepEqual(
        Mix.finalize({ entry: [2] }),
        { entry: [2, 1] }
    );

    Mix.webpackConfig = null;
    t.deepEqual(
        Mix.finalize({ entry: 'default' }),
        { entry: 'default' }
    );
});


test('that it determines the CSS output path correctly.', t => {
    mix.setPublicPath('./public')
       .js('js/stub.js', 'dist')
       .less('sass/stub.less', 'dist/stub.css');

    let segments = mix.config.preprocessors;


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
    Mix.preprocessors = false;
    t.deepEqual(Mix.entry(), {
        'dist/stub': [path.resolve(__dirname, '../js/stub.js')]
    });
});


test('that it calculates the output correctly', t => {
    mix.js('js/stub.js', 'dist')
       .sass('sass/stub.scss', 'dist');

    t.deepEqual({
        path: './',
        filename: '[name].js',
        publicPath: './'
    }, mix.config.output());


    // // Enabling Hot Reloading should change this output.
    mix.config.hmr = true;

    t.deepEqual({
        path: '/',
        filename: '[name].js',
        publicPath: 'http://localhost:8080/'
    }, mix.config.output());


    // // Extracting vendor libraries should change this output.
    mix.config.hmr = false;
    mix.extract(['some-lib']);

    t.deepEqual({
        path: './',
        filename: '[name].js',
        publicPath: './'
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
        path: './',
        filename: '[name].[chunkhash].js',
        publicPath: './'
    }, mix.config.output());

    // // Enabling Hot Reloading should change this output.
    mix.config.hmr = true;

    t.deepEqual({
        path: '/',
        filename: '[name].[chunkhash].js',
        publicPath: 'http://localhost:8080/'
    }, mix.config.output());

    mix.config.hmr = false;
    mix.extract(['some-lib']);

    t.deepEqual({
        path: './',
        filename: '[name].[chunkhash].js',
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



test('that it detects hmr correctly', t => {
    let root = path.resolve(__dirname);
    mix.setPublicPath(root);
    let hmrFile = Mix.publicPath + '/hot';

    Mix.detectHotReloading(); // normal
    t.false(Mix.hmr);
    Mix.detectHotReloading(true); // force hmr mode
    t.true(Mix.hmr);
    t.true(File.exists(hmrFile));
    Mix.detectHotReloading(); // run it again in normal mode to delete the file
    t.false(Mix.hmr);
    t.false(File.exists(hmrFile));
});


test('that it reads the Babel config properly', t => {
    // First lets test when there's no .babelrc
    let root = path.resolve(__dirname);
    Mix.Paths.setRootPath(root);
    let config = Mix.babelConfig();
    t.is(config,
        "?{\"cacheDirectory\":true,\"presets\":[[\"es2015\",{\"modules\":false}]]}");

    // Now, create a fake .babelrc
    let babel = new File(root + '/.babelrc').write(JSON.stringify({ "presets": ["react", ["es2015", { "modules": false }]] }));
    config = Mix.babelConfig();
    t.is(config, "?cacheDirectory");
    babel.delete();
});


// test all methods that all they do is set a value
test('that the setter methods work properly', t => {
    let root = path.resolve(__dirname);

    mix.disableNotifications();
    t.false(Mix.notifications);

    // Source maps
    mix.config.inProduction = false;
    mix.sourceMaps();
    t.is(Mix.sourcemaps, '#inline-source-map');

    mix.config.inProduction = true;
    mix.sourceMaps();
    t.is(Mix.sourcemaps, false);

    mix.copy('fake/*.txt', path.resolve(__dirname, 'fixtures'));
    Mix.Paths.setRootPath(root);
    t.deepEqual(Mix.copy,
        [{ from: 'fake/*.txt', to: Mix.Paths.root('fixtures'), flatten: true }]);
});
