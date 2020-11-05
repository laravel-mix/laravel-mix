import test from 'ava';
import path from 'path';
import File from '../../src/File';

import assert from '../helpers/assertions';
import webpack from '../helpers/webpack';

import '../helpers/mix';

test('it compiles Sass without JS', async t => {
    mix.sass(`test/fixtures/app/src/sass/app.scss`, 'css');

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/css/app.css`));

    assert.manifestEquals(
        {
            '/css/app.css': '/css/app.css'
        },
        t
    );
});

test('JS and Sass + Less + Stylus compilation config', async t => {
    mix.js('js/app.js', 'js')
        .sass('src/sass.scss', 'css')
        .less('src/less.less', 'css')
        .stylus('src/stylus.styl', 'css');

    t.deepEqual(
        {
            '/js/app': [
                path.resolve('js/app.js'),
                path.resolve('src/less.less'),
                path.resolve('src/sass.scss'),
                path.resolve('src/stylus.styl')
            ]
        },
        (await webpack.buildConfig()).entry
    );
});

test('Generic Sass rules are applied', async t => {
    mix.js('js/app.js', 'js');

    t.truthy(
        (await webpack.buildConfig()).module.rules.find(rule => {
            return rule.test.toString() === '/\\.scss$/';
        })
    );
});

test('Generic Less rules are applied', async t => {
    mix.js('js/app.js', 'js');

    t.truthy(
        (await webpack.buildConfig()).module.rules.find(rule => {
            return rule.test.toString() === '/\\.less$/';
        })
    );
});

test('Generic CSS rules are applied', async t => {
    mix.js('js/app.js', 'js');

    t.truthy(
        (await webpack.buildConfig()).module.rules.find(rule => {
            return rule.test.toString() === '/\\.css$/';
        })
    );
});

test('Generic Stylus rules are applied', async t => {
    mix.js('js/app.js', 'js');

    t.truthy(
        (await webpack.buildConfig()).module.rules.find(rule => {
            return rule.test.toString() === '/\\.styl(us)?$/';
        })
    );
});

test('Unique PostCSS plugins can be applied for each mix.sass/less/stylus() call.', async t => {
    mix.sass(`test/fixtures/app/src/sass/app.scss`, 'css', {}, [
        { postcssPlugin: 'postcss-plugin-stub' }
    ]);

    mix.sass(`test/fixtures/app/src/sass/app2.scss`, 'css', {}, [
        { postcssPlugin: 'second-postcss-plugin-stub' }
    ]);

    let config = await webpack.buildConfig();

    let seePostCssPluginFor = (file, pluginName) => {
        t.true(
            config.module.rules
                .find(rule => rule.test.toString().includes(file))
                .use.find(loader => loader.loader === 'postcss-loader')
                .options.postcssOptions.plugins.find(
                    plugin => plugin.postcssPlugin === pluginName
                ) !== undefined
        );
    };

    seePostCssPluginFor('app.scss', 'postcss-plugin-stub');
    seePostCssPluginFor('app2.scss', 'second-postcss-plugin-stub');
});

test('Sass is extracted properly', async t => {
    mix.sass(`test/fixtures/app/src/sass/app.sass`, 'css/app.css');

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/css/app.css`));

    assert.manifestEquals({ '/css/app.css': '/css/app.css' }, t);
});

test('Stylus is extracted properly', async t => {
    mix.stylus(`test/fixtures/app/src/stylus/app.styl`, 'css/app.css');

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/css/app.css`));
    assert.manifestEquals({ '/css/app.css': '/css/app.css' }, t);
});

test('CSS output paths are normalized', async t => {
    mix.js(`test/fixtures/app/src/js/app.js`, 'dist/js');
    mix.sass(`test/fixtures/app/src/sass/app.scss`, 'dist/css');

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/css/app.css`));
    t.false(File.exists(`test/fixtures/app/dist/dist/css/app.css`));

    t.true(File.exists(`test/fixtures/app/dist/js/app.js`));
    t.false(File.exists(`test/fixtures/app/dist/dist/js/app.js`));

    assert.manifestEquals(
        {
            '/js/app.js': '/js/app.js',
            '/css/app.css': '/css/app.css'
        },
        t
    );
});

test('Compiling multiple CSS assets places CSS in the correct location', async t => {
    mix.js(`test/fixtures/app/src/js/app.js`, 'dist/js');
    mix.sass(`test/fixtures/app/src/sass/app.scss`, 'dist/css');
    mix.postCss(`test/fixtures/app/src/css/app.css`, 'dist/css');

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/css/app.css`));
    t.false(File.exists(`test/fixtures/app/dist/dist/css/app.css`));
    t.false(File.exists(`test/fixtures/app/dist/js/app.css`));

    t.true(File.exists(`test/fixtures/app/dist/js/app.js`));
    t.false(File.exists(`test/fixtures/app/dist/dist/js/app.js`));

    assert.manifestEquals(
        {
            '/js/app.js': '/js/app.js',
            '/css/app.css': '/css/app.css'
        },
        t
    );

    assert.fileMatchesCss(
        `test/fixtures/app/dist/css/app.css`,
        `body{color:red;}.app{color:red;}`,
        t
    );
});

test('SASS/SCSS with imports does not place files in the wrong output dir', async t => {
    mix.js(`test/fixtures/app/src/js/app.js`, 'dist/js');
    mix.sass(`test/fixtures/app/src/sass/import.scss`, 'dist/css');
    mix.options({
        processCssUrls: false
    });

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/css/import.css`));
    t.false(File.exists(`test/fixtures/app/dist/js/import.css`));

    assert.manifestEquals(
        {
            '/js/app.js': '/js/app.js',
            '/css/import.css': '/css/import.css'
        },
        t
    );

    assert.fileNotEmpty(`test/fixtures/app/dist/css/import.css`, t);
});

test('CSS url resolution can be configured per-file', async t => {
    mix.sass(`test/fixtures/app/src/sass/font-and-image.scss`, 'css', {
        processUrls: false
    });

    mix.sass(`test/fixtures/app/src/sass/image.scss`, 'css', {
        processUrls: true
    });

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/css/font-and-image.css`));
    t.true(File.exists(`test/fixtures/app/dist/css/image.css`));

    t.false(File.exists(`test/fixtures/app/dist/images/img.svg`));
    t.true(File.exists(`test/fixtures/app/dist/images/img2.svg`));

    t.false(File.exists(`test/fixtures/app/dist/fonts/font.svg`));
    t.false(File.exists(`test/fixtures/app/dist/fonts/awesome.svg`));
});
