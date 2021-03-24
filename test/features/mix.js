import test from 'ava';
import assert from '../helpers/assertions';
import File from '../../src/File';
import webpack from '../helpers/webpack';

import '../helpers/mix';

test.beforeEach(() => webpack.setupVueAliases(2));

test('the kitchen sink', async t => {
    new File(`test/fixtures/app/dist/file.js`).write('var foo');

    mix.js(`test/fixtures/app/src/js/app.js`, 'js')
        .extract(['vue2'])
        .vue({ version: 2 })
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

    t.true(File.exists(`test/fixtures/app/dist/js/all.js`));

    assert.manifestEquals(
        {
            '/js/another.js': '/js/another.js\\?id=\\w{20}',
            '/css/app.css': '/css/app.css\\?id=\\w{20}',
            '/css/example.css': '/css/example.css\\?id=\\w{20}',
            '/js/app.js': '/js/app.js\\?id=\\w{20}',
            '/js/vendor.js': '/js/vendor.js\\?id=\\w{20}',
            '/js/manifest.js': '/js/manifest.js\\?id=\\w{20}',
            '/somewhere/app.js': '/somewhere/app.js\\?id=\\w{20}',
            '/js/all.js': '/js/all.js\\?id=\\w{20}',
            '/file.js': '/file.js\\?id=\\w{20}'
        },
        t
    );
});

test('it resolves image- and font-urls and distinguishes between them even if we deal with svg', async t => {
    // Given we have a sass file that refers to ../font.svg, ../font/awesome.svg and to ../img/img.svg
    mix.sass(`test/fixtures/app/src/sass/font-and-image.scss`, 'css');
    // When we compile it
    await webpack.compile();

    // Then we expect the css to be built
    t.true(File.exists(`test/fixtures/app/dist/css/font-and-image.css`));
    // Along with the referred image in the images folder
    t.true(File.exists(`test/fixtures/app/dist/images/img.66162863.svg`));
    // And the referred fonts in the fonts folder
    t.true(File.exists(`test/fixtures/app/dist/fonts/font.svg`));
    t.true(File.exists(`test/fixtures/app/dist/fonts/awesome.svg`));
    // And we expect the image NOT to be in the fonts folder:
    t.false(File.exists(`test/fixtures/app/dist/fonts/img.svg`));
    // And the fonts NOT to be in the image folder
    t.false(File.exists(`test/fixtures/app/dist/images/font.svg`));
    t.false(File.exists(`test/fixtures/app/dist/images/awesome.svg`));
});
