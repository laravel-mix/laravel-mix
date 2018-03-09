import test from 'ava';
import path from 'path';
import mix from '../src/index';
import WebpackConfig from '../src/builder/WebpackConfig';
import defaultConfig from '../src/config';
import ComponentFactory from '../src/components/ComponentFactory';

test.beforeEach(t => {
    Config = defaultConfig();

    global.Mix = new (require('../src/Mix'))();

    Config.publicPath = 'public';

    new ComponentFactory().installAll();
});

test('basic JS compilation config.', t => {
    mix.js('resources/assets/js/app.js', 'public/js');

    Mix.dispatch('init');

    let webpackConfig = new WebpackConfig().build();

    t.deepEqual(
        {
            '/js/app': [path.resolve('resources/assets/js/app.js')]
        },
        webpackConfig.entry
    );

    t.deepEqual(
        {
            path: path.resolve('public'),
            filename: '[name].js',
            chunkFilename: '[name].js',
            publicPath: ''
        },
        webpackConfig.output
    );
});

test('basic JS compilation with output public directory omitted config.', t => {
    mix.js('resources/assets/js/app.js', 'js');

    Mix.dispatch('init');

    let webpackConfig = new WebpackConfig().build();

    t.deepEqual(
        {
            '/js/app': [path.resolve('resources/assets/js/app.js')]
        },
        webpackConfig.entry
    );
});

test('basic JS compilation with a different public path', t => {
    mix
        .js('resources/assets/js/app.js', 'public/js')
        .setPublicPath('public-html');

    let webpackConfig = new WebpackConfig().build();

    t.deepEqual(
        {
            path: path.resolve('public-html'),
            filename: '[name].js',
            chunkFilename: '[name].js',
            publicPath: ''
        },
        webpackConfig.output
    );
});

test('basic JS compilation with a specific output path config.', t => {
    mix.js('resources/assets/js/app.js', 'public/js/output.js');

    Mix.dispatch('init');

    let webpackConfig = new WebpackConfig().build();

    t.deepEqual(
        {
            '/js/output': [path.resolve('resources/assets/js/app.js')]
        },
        webpackConfig.entry
    );
});

test('JS compilation with vendor extraction config', t => {
    mix
        .js('resources/assets/js/app.js', 'public/js')
        .extract(['vue'], 'public/js/libraries.js');

    Mix.dispatch('init');

    let webpackConfig = new WebpackConfig().build();

    t.deepEqual(
        {
            '/js/app': [path.resolve('resources/assets/js/app.js')],
            '/js/libraries': ['vue']
        },
        webpackConfig.entry
    );
});

test('vendor extraction with no output and no requested JS compilation throws an error', t => {
    mix.extract(['vue']);

    Mix.dispatch('init');

    t.throws(() => new WebpackConfig().build(), Error);
});

test('JS compilation with vendor extraction with default config', t => {
    mix.js('resources/assets/js/app.js', 'public/js').extract(['vue']);

    Mix.dispatch('init');

    let webpackConfig = new WebpackConfig().build();

    t.deepEqual(
        {
            '/js/app': [path.resolve('resources/assets/js/app.js')],
            '/js/vendor': ['vue']
        },
        webpackConfig.entry
    );
});

test('React compilation', t => {
    mix.react('resources/assets/js/app.jsx', 'public/js');

    Mix.dispatch('init');

    let webpackConfig = new WebpackConfig().build();

    t.deepEqual(
        {
            '/js/app': [path.resolve('resources/assets/js/app.jsx')]
        },
        webpackConfig.entry
    );
});

test('JS and Sass + Less + Stylus compilation config', t => {
    mix
        .js('resources/assets/js/app.js', 'public/js')
        .sass('resources/assets/sass/sass.scss', 'public/css')
        .less('resources/assets/less/less.less', 'public/css')
        .stylus('resources/assets/stylus/stylus.styl', 'public/css');

    Mix.dispatch('init');

    let webpackConfig = new WebpackConfig().build();

    t.deepEqual(
        {
            '/js/app': [
                path.resolve('resources/assets/js/app.js'),
                path.resolve('resources/assets/less/less.less'),
                path.resolve('resources/assets/sass/sass.scss'),
                path.resolve('resources/assets/stylus/stylus.styl')
            ]
        },
        webpackConfig.entry
    );
});

test('TypeScript compilation', t => {
    mix.ts('resources/assets/js/app.js', 'public/js');

    Mix.dispatch('init');

    let webpackConfig = new WebpackConfig().build();

    t.true(webpackConfig.resolve.extensions.includes('.ts'));
    t.true(webpackConfig.resolve.extensions.includes('.tsx'));

    t.is('vue/dist/vue.esm.js', webpackConfig.resolve.alias['vue$']);
});

test('CSS compilation with no JS specified config.', t => {
    mix.sass('resources/assets/sass/sass.scss', 'public/css');

    Mix.dispatch('init');

    let webpackConfig = new WebpackConfig().build();

    t.deepEqual(
        {
            mix: [
                path.resolve(__dirname, '../src/builder', 'mock-entry.js'),
                path.resolve('resources/assets/sass/sass.scss')
            ]
        },
        webpackConfig.entry
    );
});

test('Custom user config can be merged', t => {
    mix.webpackConfig({ context: 'changed' });

    let webpackConfig = new WebpackConfig().build();

    t.is('changed', webpackConfig.context);
});

test('Custom user config can be merged as a callback function', t => {
    mix.webpackConfig(webpack => {
        return {
            context: 'changed'
        };
    });

    let webpackConfig = new WebpackConfig().build();

    t.is('changed', webpackConfig.context);
});

test('Custom vue-loader options may be specified', t => {
    mix.js('resources/assets/js/app.js', 'public/js').options({
        vue: {
            camelCase: true,
            postLoaders: { stub: 'foo' }
        }
    });

    Mix.dispatch('init');

    let vueOptions = new WebpackConfig()
        .build()
        .module.rules.find(rule => rule.loader === 'vue-loader').options;

    t.true(vueOptions.camelCase);
    t.deepEqual({}, vueOptions.preLoaders);
    t.deepEqual({ stub: 'foo' }, vueOptions.postLoaders);
    t.false(vueOptions.esModule);
});

test('Autoprefixer should always be applied after all other postcss plugins', t => {
    mix.sass('resources/assets/sass/sass.scss', 'public/css').options({
        postCss: [require('postcss-custom-properties')]
    });

    Mix.dispatch('init');

    let plugins = new WebpackConfig()
        .build()
        .module.rules.find(rule =>
            rule.test
                .toString()
                .includes(path.normalize('/resources/assets/sass/sass.scss'))
        )
        .use.find(loader => loader.loader == 'postcss-loader')
        .options.plugins.map(
            plugin => plugin.postcssPlugin || plugin().postcssPlugin
        );

    t.deepEqual(['postcss-custom-properties', 'autoprefixer'], plugins);
});

test('Generic Sass rules are applied', t => {
    mix.js('resources/assets/js/app.js', 'js');

    Mix.dispatch('init');

    let config = new WebpackConfig().build();

    t.truthy(
        config.module.rules.find(rule => {
            return rule.test.toString() === '/\\.s[ac]ss$/';
        })
    );
});

test('Generic Less rules are applied', t => {
    mix.js('resources/assets/js/app.js', 'js');

    Mix.dispatch('init');

    let config = new WebpackConfig().build();

    t.truthy(
        config.module.rules.find(rule => {
            return rule.test.toString() === '/\\.less$/';
        })
    );
});

test('Generic CSS rules are applied', t => {
    mix.js('resources/assets/js/app.js', 'js');

    Mix.dispatch('init');

    let config = new WebpackConfig().build();

    t.truthy(
        config.module.rules.find(rule => {
            return rule.test.toString() === '/\\.css$/';
        })
    );
});
