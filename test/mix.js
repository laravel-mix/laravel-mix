import test from 'ava';
import {mix, config as Mix} from '../src/index';
import path from 'path';

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
        Mix.entry();
    }, Error);    
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


test('that it determines the CSS output path correctly.', t => {
    mix.setPublicPath('./public')
       .js('js/stub.js', 'dist')
       .sass('sass/stub.scss', 'dist');

    var segments = mix.config.sass[0];
    t.is('dist/stub.css', segments.output.path);
});


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
    mix.config.versioning = true;
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
