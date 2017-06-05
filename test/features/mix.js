import test from 'ava';
import mix from '../../src/index';
import webpack from 'webpack';
import WebpackConfig from '../../src/builder/WebpackConfig';
import fs from 'fs-extra';

test.beforeEach(t => {
    // Reset state.
    global.Config = require('../../src/config')();
    global.Mix = new (require('../../src/Mix'))();

    fs.ensureDirSync('test/fake-app/public');

    mix.setPublicPath('test/fake-app/public');
});


test.afterEach.always(t => {
    fs.removeSync('test/fake-app/public');
});


test.cb.serial('it compiles JavaScript', t => {
    mix.js('test/fake-app/resources/assets/js/app.js', 'js');

    compile(t, () => {
        t.true(File.exists('test/fake-app/public/js/app.js'));

        t.deepEqual({
            "/js/app.js": "/js/app.js"
        }, readManifest());
    });
});


test.cb.serial('it compiles JavaScript and Sass', t => {
    mix.js('test/fake-app/resources/assets/js/app.js', 'js')
       .sass('test/fake-app/resources/assets/sass/app.scss', 'css');

    compile(t, () => {
        t.true(File.exists('test/fake-app/public/js/app.js'));
        t.true(File.exists('test/fake-app/public/css/app.css'));

        t.deepEqual({
            "/js/app.js": "/js/app.js",
            "/css/app.css": "/css/app.css"
        }, readManifest());
    });
});


test.cb('it compiles Sass without JS', t => {
    mix.sass('test/fake-app/resources/assets/sass/app.scss', 'css');

    compile(t, () => {
        t.true(File.exists('test/fake-app/public/css/app.css'));

        t.deepEqual({
            "/css/app.css": "/css/app.css"
        }, readManifest());
    });
});


test.cb.serial('it compiles JavaScript and Sass with versioning', t => {
    mix.js('test/fake-app/resources/assets/js/app.js', 'js')
       .sass('test/fake-app/resources/assets/sass/app.scss', 'css')
       .version();

    compile(t, () => {
        t.deepEqual({
            "/js/app.js": "/js/app.js?id=786e6a43e57e664408b4",
            "/css/app.css": "/css/app.css?id=b6452d8fa43c7cb57e6b"
        }, readManifest());
    });
});


test.cb.serial('it compiles JavaScript and copies the output to a new location.', t => {
    mix.js('test/fake-app/resources/assets/js/app.js', 'js')
       .copy('test/fake-app/public/js/app.js', 'test/fake-app/public/somewhere');

    compile(t, () => {
        t.true(File.exists('test/fake-app/public/somewhere/app.js'));

        t.deepEqual({
            "/js/app.js": "/js/app.js",
            "/somewhere/app.js": "/somewhere/app.js"
        }, readManifest());
    });
});


test.cb.serial('it compiles JS and then combines the bundles files.', t => {
    mix.js('test/fake-app/resources/assets/js/app.js', 'js')
       .js('test/fake-app/resources/assets/js/another.js', 'js')
       .scripts([
            'test/fake-app/public/js/app.js',
            'test/fake-app/public/js/another.js'
        ], 'test/fake-app/public/js/all.js');

    compile(t, () => {
        t.true(File.exists('test/fake-app/public/js/all.js'));

        t.deepEqual({
            "/js/app.js": "/js/app.js",
            "/js/another.js": "/js/another.js",
            "/js/all.js": "/js/all.js"
        }, readManifest());
    });
});


test.cb.serial('the kitchen sink', t => {
    new File('test/fake-app/public/file.js').write('var foo');

    mix.js('test/fake-app/resources/assets/js/app.js', 'js')
       .extract(['vue'])
       .js('test/fake-app/resources/assets/js/another.js', 'js')
       .copy('test/fake-app/public/js/app.js', 'test/fake-app/public/somewhere')
       .scripts([
            'test/fake-app/public/somewhere/app.js',
            'test/fake-app/public/js/another.js'
        ], 'test/fake-app/public/js/all.js')
       .version([
            'test/fake-app/public/file.js'
        ]);

    compile(t, () => {
        t.true(File.exists('test/fake-app/public/js/all.js'));

        t.deepEqual({
            "/file.js": "/file.js?id=6535b4d330f12366c3f7",
            "/js/all.js": "/js/all.js?id=4f9300e3abb827e70ebf",
            "/js/another.js": "/js/another.js?id=6ca23176ce8cedc7e9af",
            "/js/app.js": "/js/app.js?id=a425752dcbde5ea4a988",
            "/js/manifest.js": "/js/manifest.js?id=3e7b4ac4423a5c2a8584",
            "/js/vendor.js": "/js/vendor.js?id=abc1071b11e4e709b38a",
            "/somewhere/app.js": "/somewhere/app.js?id=a425752dcbde5ea4a988",
        }, readManifest());
    });
});



function compile(t, callback) {
    let config = new WebpackConfig().build();

    webpack(config, function (err, stats) {
        callback();

        t.end();
    });
}


function readManifest() {
    return JSON.parse(File.find('test/fake-app/public/mix-manifest.json').read());
}

