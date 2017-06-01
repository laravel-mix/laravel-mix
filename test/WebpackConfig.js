import test from 'ava';
import mix from  '../src/index';
import WebpackConfig from '../src/builder/WebpackConfig';
import defaultConfig from '../src/config';

test.beforeEach(t => {
    Config = defaultConfig();

    Config.publicPath = 'public';
});


test('basic JS compilation config.', t => {
    mix.js('resources/assets/js/app.js', 'public/js');

    let webpackConfig = new WebpackConfig().build();

    t.deepEqual({
        '/js/app': [
            path.resolve('resources/assets/js/app.js')
        ]
    }, webpackConfig.entry);

    t.deepEqual({
        path: path.resolve('public'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: ''
    }, webpackConfig.output);
});


test('basic JS compilation with output public directory omitted config.', t => {
    mix.js('resources/assets/js/app.js', 'js');

    let webpackConfig = new WebpackConfig().build();

    t.deepEqual({
        '/js/app': [
            path.resolve('resources/assets/js/app.js')
        ]
    }, webpackConfig.entry);
});


test('basic JS compilation with file versioning config.', t => {
    mix.js('resources/assets/js/app.js', 'public/js')
       .version();

    let webpackConfig = new WebpackConfig().build();

    t.deepEqual({
        '/js/app': [
            path.resolve('resources/assets/js/app.js')
        ]
    }, webpackConfig.entry);

    t.deepEqual({
        path: path.resolve('public'),
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
        publicPath: ''
    }, webpackConfig.output);
});


test('basic JS compilation with a different public path', t => {
    mix.js('resources/assets/js/app.js', 'public/js')
       .setPublicPath('public-html');

    let webpackConfig = new WebpackConfig().build();

    t.deepEqual({
        path: path.resolve('public-html'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: ''
    }, webpackConfig.output);
});


test('basic JS compilation with a specific output path config.', t => {
    mix.js('resources/assets/js/app.js', 'public/js/output.js');

    let webpackConfig = new WebpackConfig().build();

    t.deepEqual({
        '/js/output': [
            path.resolve('resources/assets/js/app.js')
        ]
    }, webpackConfig.entry);
});


test('JS compilation with vendor extraction config', t => {
    mix.js('resources/assets/js/app.js', 'public/js')
       .extract(['vue'], 'public/js/libraries.js');

    let webpackConfig = new WebpackConfig().build();

    t.deepEqual({
        '/js/app': [path.resolve('resources/assets/js/app.js')],
        '/js/libraries': ['vue']
    }, webpackConfig.entry);
});


test('vendor extraction with no output and no requested JS compilation throws an error', t => {
    mix.extract(['vue']);

    t.throws(() => new WebpackConfig().build(), Error);
});


test('JS compilation with vendor extraction with default config', t => {
    mix.js('resources/assets/js/app.js', 'public/js')
       .extract(['vue']);

    let webpackConfig = new WebpackConfig().build();

    t.deepEqual({
        '/js/app': [path.resolve('resources/assets/js/app.js')],
        '/js/vendor': ['vue']
    }, webpackConfig.entry);
});


test('React compilation', t => {
    mix.react('resources/assets/js/app.jsx', 'public/js');

    let webpackConfig = new WebpackConfig().build();

    t.deepEqual({
        '/js/app': [path.resolve('resources/assets/js/app.jsx')]
    }, webpackConfig.entry);
});


test('JS and Sass + Less + Stylus compilation config', t => {
    mix.js('resources/assets/js/app.js', 'public/js')
       .sass('resources/assets/sass/sass.scss', 'public/css')
       .less('resources/assets/less/less.less', 'public/css')
       .stylus('resources/assets/stylus/stylus.styl', 'public/css')

    let webpackConfig = new WebpackConfig().build();

    t.deepEqual({
        '/js/app': [
            path.resolve('resources/assets/js/app.js'),
            path.resolve('resources/assets/sass/sass.scss'),
            path.resolve('resources/assets/less/less.less'),
            path.resolve('resources/assets/stylus/stylus.styl'),
        ]
    }, webpackConfig.entry);
});


test('CSS compilation with no JS specified config.', t => {
    mix.sass('resources/assets/sass/sass.scss', 'public/css')

    let webpackConfig = new WebpackConfig().build();

    t.deepEqual({
        'mix': [
            path.resolve(__dirname, '../src/builder', 'mock-entry.js'),
            path.resolve('resources/assets/sass/sass.scss')
        ]
    }, webpackConfig.entry);
});


test('Custom user config can be merged', t => {
    mix.webpackConfig({ context: 'changed' });

    let webpackConfig = new WebpackConfig().build();

    t.is('changed', webpackConfig.context);
});
