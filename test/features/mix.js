import test from 'ava';

import { context } from '../helpers/test.js';
import { setupVueAliases } from './vue.js';

test.beforeEach(async t => {
    const { Mix } = context(t);

    await setupVueAliases(2, Mix);
});

test.serial('the kitchen sink', async t => {
    const { mix, fs, assert, webpack } = context(t);

    await fs().stub({
        'test/fixtures/app/dist/file.js': 'var foo'
    });

    mix.js(`test/fixtures/app/src/js/app.js`, 'js')
        .extract(['vue2'])
        .vue()
        .js(`test/fixtures/app/src/js/another.js`, 'js')
        .sass(`test/fixtures/app/src/sass/app.scss`, 'css')
        .postCss(`test/fixtures/app/src/css/app.css`, 'css/example.css')
        .copy(`test/fixtures/app/dist/js/app.js`, `test/fixtures/app/dist/somewhere`)
        .scripts(
            [
                `test/fixtures/app/dist/somewhere/app.js`,
                `test/fixtures/app/dist/js/another.js`
            ],
            `test/fixtures/app/dist/js/all.js`
        )
        .version([`test/fixtures/app/dist/file.js`]);

    await webpack.compile();

    assert().file(`test/fixtures/app/dist/js/all.js`).exists();

    assert().manifestEquals({
        '/js/another.js': '/js/another.js\\?id=\\w{20}',
        '/css/app.css': '/css/app.css\\?id=\\w{20}',
        '/css/example.css': '/css/example.css\\?id=\\w{20}',
        '/js/app.js': '/js/app.js\\?id=\\w{20}',
        '/js/vendor.js': '/js/vendor.js\\?id=\\w{20}',
        '/js/manifest.js': '/js/manifest.js\\?id=\\w{20}',
        '/somewhere/app.js': '/somewhere/app.js\\?id=\\w{20}',
        '/js/all.js': '/js/all.js\\?id=\\w{20}',
        '/file.js': '/file.js\\?id=\\w{20}'
    });
});

test.serial(
    'it resolves image- and font-urls and distinguishes between them even if we deal with svg',
    async t => {
        const { mix, assert, webpack } = context(t);

        // Given we have a sass file that refers to ../font.svg, ../font/awesome.svg and to ../img/img.svg
        mix.sass(`test/fixtures/app/src/sass/font-and-image.scss`, 'css');
        // When we compile it
        await webpack.compile();

        // Then we expect the css to be built
        assert().file(`test/fixtures/app/dist/css/font-and-image.css`).exists();
        // Along with the referred image in the images folder
        assert().file(`test/fixtures/app/dist/images/img.svg`).exists();
        // And the referred fonts in the fonts folder
        assert().file(`test/fixtures/app/dist/fonts/font.svg`).exists();
        assert().file(`test/fixtures/app/dist/fonts/awesome.svg`).exists();
        // And we expect the image NOT to be in the fonts folder:
        assert().file(`test/fixtures/app/dist/fonts/img.svg`).absent();
        // And the fonts NOT to be in the image folder
        assert().file(`test/fixtures/app/dist/images/font.svg`).absent();
        assert().file(`test/fixtures/app/dist/images/awesome.svg`).absent();
    }
);

test.serial(
    'it resolves image- and font-urls and distinguishes between them even if we deal with svg (using legacy file-loader)',
    async t => {
        const { mix, assert, webpack } = context(t);

        mix.options({ assetModules: false });

        // Given we have a sass file that refers to ../font.svg, ../font/awesome.svg and to ../img/img.svg
        mix.sass(`test/fixtures/app/src/sass/font-and-image.scss`, 'css');
        // When we compile it
        await webpack.compile();

        // Then we expect the css to be built
        assert().file(`test/fixtures/app/dist/css/font-and-image.css`).exists();
        // Along with the referred image in the images folder
        assert().file(`test/fixtures/app/dist/images/img.svg`).exists();
        // And the referred fonts in the fonts folder
        assert().file(`test/fixtures/app/dist/fonts/font.svg`).exists();
        assert().file(`test/fixtures/app/dist/fonts/awesome.svg`).exists();
        // And we expect the image NOT to be in the fonts folder:
        assert().file(`test/fixtures/app/dist/fonts/img.svg`).absent();
        // And the fonts NOT to be in the image folder
        assert().file(`test/fixtures/app/dist/images/font.svg`).absent();
        assert().file(`test/fixtures/app/dist/images/awesome.svg`).absent();
    }
);
