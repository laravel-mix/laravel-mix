import mix from './helpers/setup';
import { fakeApp } from '../helpers/paths';
import assert from '../helpers/assertions';
import webpack from '../helpers/webpack';

test('it compiles Sass without JS', async t => {
    mix.sass(`${fakeApp}/resources/assets/sass/app.scss`, 'css');

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/css/app.css`));

    assert.manifestEquals(
        {
            '/css/app.css': '/css/app.css'
        },
        t
    );
});

test('JS and Sass + Less + Stylus compilation config', t => {
    mix.js('resources/assets/js/app.js', 'js')
        .sass('resources/assets/sass/sass.scss', 'css')
        .less('resources/assets/less/less.less', 'css')
        .stylus('resources/assets/stylus/stylus.styl', 'css');

    t.deepEqual(
        {
            '/js/app': [
                path.resolve('resources/assets/js/app.js'),
                path.resolve('resources/assets/less/less.less'),
                path.resolve('resources/assets/sass/sass.scss'),
                path.resolve('resources/assets/stylus/stylus.styl')
            ]
        },
        webpack.buildConfig().entry
    );
});

test('Generic Sass rules are applied', t => {
    mix.js('resources/assets/js/app.js', 'js');

    t.truthy(
        webpack.buildConfig().module.rules.find(rule => {
            return rule.test.toString() === '/\\.scss$/';
        })
    );
});

test('Generic Less rules are applied', t => {
    mix.js('resources/assets/js/app.js', 'js');

    t.truthy(
        webpack.buildConfig().module.rules.find(rule => {
            return rule.test.toString() === '/\\.less$/';
        })
    );
});

test('Generic CSS rules are applied', t => {
    mix.js('resources/assets/js/app.js', 'js');

    t.truthy(
        webpack.buildConfig().module.rules.find(rule => {
            return rule.test.toString() === '/\\.css$/';
        })
    );
});

test('Generic Stylus rules are applied', t => {
    mix.js('resources/assets/js/app.js', 'js');

    t.truthy(
        webpack.buildConfig().module.rules.find(rule => {
            return rule.test.toString() === '/\\.styl(us)?$/';
        })
    );
});

test('Unique PostCSS plugins can be applied for each mix.sass/less/stylus() call.', t => {
    mix.sass(`${fakeApp}/resources/assets/sass/app.scss`, 'css', {}, [
        { postcssPlugin: 'postcss-plugin-stub' }
    ]);

    mix.sass(`${fakeApp}/resources/assets/sass/app2.scss`, 'css', {}, [
        { postcssPlugin: 'second-postcss-plugin-stub' }
    ]);

    let seePostCssPluginFor = (file, pluginName) => {
        t.true(
            webpack
                .buildConfig()
                .module.rules.find(rule => rule.test.toString().includes(file))
                .use.find(loader => loader.loader === 'postcss-loader')
                .options.postcssOptions.plugins.find(
                    plugin => plugin.postcssPlugin === pluginName
                ) !== undefined
        );
    };

    seePostCssPluginFor('app.scss', 'postcss-plugin-stub');
    seePostCssPluginFor('app2.scss', 'second-postcss-plugin-stub');
});

test('cssnano minifier options may be specified', async t => {
    Config.production = true;

    let file = new File(
        `${fakeApp}/resources/assets/sass/minifier-example.scss`
    );

    file.write(`
        .test {
            font-family: 'Font Awesome 5 Free';
        }
    `);

    mix.sass(file.relativePath(), 'css');

    mix.options({
        cssNano: { minifyFontValues: false }
    });

    await webpack.compile();

    t.is(
        '.test{font-family:"Font Awesome 5 Free"}\n',
        File.find(`${fakeApp}/public/css/minifier-example.css`).read()
    );

    // Clean up.
    file.delete();
});

test('Sass is extracted properly', async t => {
    mix.sass(`${fakeApp}/resources/assets/sass/app.sass`, 'css/app.css');

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/css/app.css`));

    assert.manifestEquals({ '/css/app.css': '/css/app.css' }, t);
});

test('Stylus is extracted properly', async t => {
    mix.stylus(`${fakeApp}/resources/assets/stylus/app.styl`, 'css/app.css');

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/css/app.css`));
    assert.manifestEquals({ '/css/app.css': '/css/app.css' }, t);
});

test('CSS output paths are normalized', async t => {
    mix.js(`${fakeApp}/resources/assets/js/app.js`, 'public/js');
    mix.sass(`${fakeApp}/resources/assets/sass/app.scss`, 'public/css');

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/css/app.css`));
    t.false(File.exists(`${fakeApp}/public/public/css/app.css`));

    t.true(File.exists(`${fakeApp}/public/js/app.js`));
    t.false(File.exists(`${fakeApp}/public/public/js/app.js`));

    assert.manifestEquals(
        {
            '/js/app.js': '/js/app.js',
            '/css/app.css': '/css/app.css'
        },
        t
    );
});
