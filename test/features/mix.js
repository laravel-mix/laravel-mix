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

