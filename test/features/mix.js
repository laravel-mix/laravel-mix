import test from 'ava';
import assert from '../helpers/assertions';
import { fakeApp } from '../helpers/paths';
import File from '../../src/File';
import webpack from '../helpers/webpack';

import '../helpers/mix';

test.beforeEach(() => webpack.setupVueAliases(2));

test('the kitchen sink', async t => {
    new File(`${fakeApp}/public/file.js`).write('var foo');

    mix.js(`${fakeApp}/resources/assets/js/app.js`, 'js')
        .extract(['vue'])
        .vue({ version: 2 })
        .js(`${fakeApp}/resources/assets/js/another.js`, 'js')
        .sass(`${fakeApp}/resources/assets/sass/app.scss`, 'css')
        .postCss(`${fakeApp}/resources/assets/css/app.css`, 'css/example.css')
        .copy(`${fakeApp}/public/js/app.js`, `${fakeApp}/public/somewhere`)
        .scripts(
            [
                `${fakeApp}/public/somewhere/app.js`,
                `${fakeApp}/public/js/another.js`
            ],
            `${fakeApp}/public/js/all.js`
        )
        .version([`${fakeApp}/public/file.js`]);

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/js/all.js`));

    assert.manifestEquals(
        {
            '/js/another.js': '/js/another.js\\?id=\\w{20}',
            '/css/app.css': '/css/app.css\\?id=\\w{20}',
            '/css/example.css': '/css/example.css\\?id=\\w{20}',
            '/js/app.js': '/js/app.js\\?id=\\w{20}',
            '/js/manifest.js': '/js/manifest.js\\?id=\\w{20}',
            '/js/vendor.js': '/js/vendor.js\\?id=\\w{20}',
            '/somewhere/app.js': '/somewhere/app.js\\?id=\\w{20}',
            '/js/all.js': '/js/all.js\\?id=\\w{20}',
            '/file.js': '/file.js\\?id=\\w{20}'
        },
        t
    );
});

test('it resolves image- and font-urls and distinguishes between them even if we deal with svg', async t => {
    // Given we have a sass file that refers to ../font.svg, ../font/awesome.svg and to ../img/img.svg
    mix.sass(`${fakeApp}/resources/assets/sass/font-and-image.scss`, 'css');
    // When we compile it
    await webpack.compile();

    // Then we expect the css to be built
    t.true(File.exists(`${fakeApp}/public/css/font-and-image.css`));
    // Along with the referred image in the images folder
    t.true(File.exists(`${fakeApp}/public/images/img.svg`));
    // And the referred fonts in the fonts folder
    t.true(File.exists(`${fakeApp}/public/fonts/font.svg`));
    t.true(File.exists(`${fakeApp}/public/fonts/awesome.svg`));
    // And we expect the image NOT to be in the fonts folder:
    t.false(File.exists(`${fakeApp}/public/fonts/img.svg`));
    // And the fonts NOT to be in the image folder
    t.false(File.exists(`${fakeApp}/public/images/font.svg`));
    t.false(File.exists(`${fakeApp}/public/images/awesome.svg`));
});
