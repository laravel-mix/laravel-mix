import test from 'ava';
import path from 'path';

import { context } from '../helpers/test.js';

test.serial('it does not process absolute urls', async t => {
    const { mix, webpack } = context(t);

    mix.postCss(`test/fixtures/app/src/css/app.css`, 'css');

    await t.notThrowsAsync(
        () => webpack.compile(),
        'CSS failed to compile due to incorrect URL processing.'
    );
});

test.serial('it compiles PostCSS without JS', async t => {
    const { assert, mix, webpack } = context(t);

    mix.postCss(`test/fixtures/app/src/css/app.css`, 'css');

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/css/app.css`).exists();

    assert().manifestEquals({
        '/css/app.css': '/css/app.css'
    });
});

test.serial('it compiles .pcss files without JS', async t => {
    const { assert, mix, webpack } = context(t);

    mix.postCss(`test/fixtures/app/src/css/app.pcss`, 'css');

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/css/app.css`).exists();

    assert().manifestEquals({
        '/css/app.css': '/css/app.css'
    });
});

test.serial('it compiles Sass without JS', async t => {
    const { assert, mix, webpack } = context(t);

    mix.sass(`test/fixtures/app/src/sass/app.scss`, 'css');

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/css/app.css`).exists();

    assert().manifestEquals({
        '/css/app.css': '/css/app.css'
    });
});

test.serial('JS and Sass + Less + Stylus compilation config', async t => {
    const { mix, webpack } = context(t);

    mix.js('js/app.js', 'js')
        .sass('src/sass.scss', 'css')
        .less('src/less.less', 'css')
        .stylus('src/stylus.styl', 'css');

    const config = await webpack.buildConfig();

    t.deepEqual(
        {
            '/js/app': [
                path.resolve('js/app.js'),
                path.resolve('src/less.less'),
                path.resolve('src/sass.scss'),
                path.resolve('src/stylus.styl')
            ]
        },
        config.entry
    );
});

test('Generic Sass rules are applied', async t => {
    const { assert, mix, webpack } = context(t);

    mix.js('js/app.js', 'js');

    const config = await webpack.buildConfig();

    assert()
        .rule(config, rule => String(rule.test).toString() === '/\\.scss$/')
        .exists();
});

test('Generic Less rules are applied', async t => {
    const { assert, mix, webpack } = context(t);

    mix.js('js/app.js', 'js');

    const config = await webpack.buildConfig();

    assert()
        .rule(config, rule => String(rule.test).toString() === '/\\.less$/')
        .exists();
});

test('Generic CSS rules are applied', async t => {
    const { assert, mix, webpack } = context(t);

    mix.js('js/app.js', 'js');

    const config = await webpack.buildConfig();

    assert()
        .rule(config, rule => String(rule.test).toString() === '/\\.p?css$/')
        .exists();
});

test('Generic Stylus rules are applied', async t => {
    const { assert, mix, webpack } = context(t);

    mix.js('js/app.js', 'js');

    const config = await webpack.buildConfig();

    assert()
        .rule(config, rule => String(rule.test).toString() === '/\\.styl(us)?$/')
        .exists();
});

test('Unique PostCSS plugins can be applied for each mix.sass/less/stylus() call.', async t => {
    const { assert, mix, webpack } = context(t);

    mix.sass(`test/fixtures/app/src/sass/app.scss`, 'css', {}, [
        { postcssPlugin: 'postcss-plugin-stub' }
    ]);

    mix.sass(`test/fixtures/app/src/sass/app2.scss`, 'css', {}, [
        { postcssPlugin: 'second-postcss-plugin-stub' }
    ]);

    const config = await webpack.buildConfig();

    /**
     *
     * @param {string} file
     * @param {string} pluginName
     */
    function seePostCssPluginFor(file, pluginName) {
        const loader = assert()
            .rule(config, rule => String(rule.test).includes(file))
            .loader(/postcss-loader/)
            .get();

        /** @type {import('postcss').AcceptedPlugin[]} */
        const plugins =
            (loader &&
                loader.options &&
                loader.options.postcssOptions &&
                loader.options.postcssOptions.plugins) ||
            [];

        // @ts-ignore
        t.true(plugins.some(plugin => plugin.postcssPlugin === pluginName));
    }

    seePostCssPluginFor('app.scss', 'postcss-plugin-stub');
    seePostCssPluginFor('app2.scss', 'second-postcss-plugin-stub');
});

test.serial('Sass is extracted properly', async t => {
    const { assert, mix, webpack } = context(t);

    mix.sass(`test/fixtures/app/src/sass/app.sass`, 'css/app.css');

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/css/app.css`).exists();

    assert().manifestEquals({ '/css/app.css': '/css/app.css' });
});

test.serial('Stylus is extracted properly', async t => {
    const { assert, mix, webpack } = context(t);

    mix.stylus(`test/fixtures/app/src/stylus/app.styl`, 'css/app.css');

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/css/app.css`).exists();
    assert().manifestEquals({ '/css/app.css': '/css/app.css' });
});

test.serial('CSS output paths are normalized', async t => {
    const { assert, mix, webpack } = context(t);

    mix.js(`test/fixtures/app/src/js/app.js`, 'dist/js');
    mix.sass(`test/fixtures/app/src/sass/app.scss`, 'dist/css');

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/css/app.css`).exists();
    assert().file(`test/fixtures/app/dist/dist/css/app.css`).absent();

    assert().file(`test/fixtures/app/dist/js/app.js`).exists();
    assert().file(`test/fixtures/app/dist/dist/js/app.js`).absent();

    assert().manifestEquals({
        '/js/app.js': '/js/app.js',
        '/css/app.css': '/css/app.css'
    });
});

test.serial(
    'Compiling multiple CSS assets places CSS in the correct location',
    async t => {
        const { assert, mix, webpack } = context(t);

        mix.js(`test/fixtures/app/src/js/app.js`, 'dist/js');
        mix.sass(`test/fixtures/app/src/sass/app.scss`, 'dist/css');
        mix.postCss(`test/fixtures/app/src/css/app.css`, 'dist/css');

        await webpack.compile();

        assert().file(`test/fixtures/app/dist/css/app.css`).exists();
        assert().file(`test/fixtures/app/dist/dist/css/app.css`).absent();
        assert().file(`test/fixtures/app/dist/js/app.css`).absent();

        assert().file(`test/fixtures/app/dist/js/app.js`).exists();
        assert().file(`test/fixtures/app/dist/dist/js/app.js`).absent();

        assert().manifestEquals({
            '/js/app.js': '/js/app.js',
            '/css/app.css': '/css/app.css'
        });

        assert()
            .file(`test/fixtures/app/dist/css/app.css`)
            .matchesCss(
                `body{color:red;}.app{color:red;background:url('/absolute/image.jpg');}`
            );
    }
);

test.serial(
    'SASS/SCSS with imports does not place files in the wrong output dir',
    async t => {
        const { assert, mix, webpack } = context(t);

        mix.js(`test/fixtures/app/src/js/app.js`, 'dist/js');
        mix.sass(`test/fixtures/app/src/sass/import.scss`, 'dist/css');
        mix.options({
            processCssUrls: false
        });

        await webpack.compile();

        assert().file(`test/fixtures/app/dist/css/import.css`).exists();
        assert().file(`test/fixtures/app/dist/js/import.css`).absent();

        assert().manifestEquals({
            '/js/app.js': '/js/app.js',
            '/css/import.css': '/css/import.css'
        });

        assert().file(`test/fixtures/app/dist/css/import.css`).notEmpty();
    }
);

test.serial('Sass url resolution can be configured per-file', async t => {
    const { assert, mix, webpack } = context(t);

    mix.sass(`test/fixtures/app/src/sass/font-and-image.scss`, 'css', {
        processUrls: false
    });

    mix.sass(`test/fixtures/app/src/sass/image.scss`, 'css', {
        processUrls: true
    });

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/css/font-and-image.css`).exists();
    assert().file(`test/fixtures/app/dist/css/image.css`).exists();

    assert().file(`test/fixtures/app/dist/images/img.svg`).absent();
    assert().file(`test/fixtures/app/dist/images/img2.svg`).exists();

    assert().file(`test/fixtures/app/dist/fonts/font.svg`).absent();
    assert().file(`test/fixtures/app/dist/fonts/awesome.svg`).absent();
});

test.serial('Sass url resolution can be disabled: globally (before)', async t => {
    const { assert, mix, webpack } = context(t);

    mix.options({ processCssUrls: false });
    mix.sass(`test/fixtures/app/src/sass/image.scss`, 'css');

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/images/img.svg`).absent();
    assert().file(`test/fixtures/app/dist/images/img2.svg`).absent();
});

test.serial('Sass url resolution can be disabled: globally (after)', async t => {
    const { assert, mix, webpack } = context(t);

    mix.sass(`test/fixtures/app/src/sass/image.scss`, 'css');
    mix.options({ processCssUrls: false });

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/images/img.svg`).absent();
    assert().file(`test/fixtures/app/dist/images/img2.svg`).absent();
});

test.serial('CSS url resolution can be disabled for PostCSS: individually', async t => {
    const { assert, mix, webpack } = context(t);

    mix.postCss(`test/fixtures/app/src/css/app-and-image.css`, 'css', {
        processUrls: false
    });

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/css/app-and-image.css`).exists();
    assert().file(`test/fixtures/app/dist/images/img.svg`).absent();
    assert().file(`test/fixtures/app/dist/images/img2.svg`).absent();
});

test.serial(
    'CSS url resolution can be disabled for PostCSS: globally (before)',
    async t => {
        const { assert, mix, webpack } = context(t);

        mix.options({ processCssUrls: false });
        mix.postCss(`test/fixtures/app/src/css/app-and-image.css`, 'css');

        await webpack.compile();

        assert().file(`test/fixtures/app/dist/css/app-and-image.css`).exists();
        assert().file(`test/fixtures/app/dist/images/img.svg`).absent();
        assert().file(`test/fixtures/app/dist/images/img2.svg`).absent();
    }
);

test.serial(
    'CSS url resolution can be disabled for PostCSS: globally (after)',
    async t => {
        const { assert, mix, webpack } = context(t);

        mix.postCss(`test/fixtures/app/src/css/app-and-image.css`, 'css');
        mix.options({ processCssUrls: false });

        await webpack.compile();

        assert().file(`test/fixtures/app/dist/css/app-and-image.css`).exists();
        assert().file(`test/fixtures/app/dist/images/img.svg`).absent();
        assert().file(`test/fixtures/app/dist/images/img2.svg`).absent();
    }
);

test.serial(
    'CSS imported in JS does not result in separate files by default',
    async t => {
        const { assert, mix, webpack } = context(t);

        mix.js('test/fixtures/app/src/js/import-css-module.js', 'js');

        await webpack.compile();

        assert().file(`test/fixtures/app/dist/js/import-css-module.js`).exists();
        assert().file(`test/fixtures/app/dist/js/import-css-module.css`).absent();
    }
);
