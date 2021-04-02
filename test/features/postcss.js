import test from 'ava';
import path from 'path';

import File from '../../src/File.js';
import { mix, Mix } from '../helpers/mix.js';
import Stub from '../helpers/Stub.js';
import webpack from '../helpers/webpack.js';

/** @type {File} */
let postCssConfigFile;

test.beforeEach(() => {
    // Stub a postcss.config.js file that should be read by Mix.
    postCssConfigFile = new File(path.resolve('postcss.config.js')).write(
        `module.exports = {
            plugins: [require('postcss-custom-properties')]
        };`
    );
});

test.after.always(() => {
    postCssConfigFile.delete();
});

test('basic mix.postCss() compilation', async t => {
    let css = 'body { color: red; }';

    let file = new Stub('css/basic-compilation.css', css);

    mix.postCss(file.relativePath(), 'css');

    await webpack.compile();

    t.true(file.hasCompiledContent(css));
});

test('mix.css() is an alias for mix.postCss()', async t => {
    let css = 'body { color: red; }';

    let file = new Stub('css/basic-compilation.css', css);

    mix.css(file.relativePath(), 'css');

    await webpack.compile();

    t.true(file.hasCompiledContent(css));
});

test('it applies autoprefixer to compiled CSS', async t => {
    let css = `
        @keyframes testing {
            to { color: red; }
        }`;

    let expected = `
        @-webkit-keyframes testing {
            to { color: red; }
        }
        @keyframes testing {
            to { color: red; }
        }`;

    let file = new Stub('css/autoprefixer.css', css);

    mix.postCss(file.relativePath(), 'css');

    await webpack.compile();

    t.true(file.hasCompiledContent(expected));
});

test('it applies autoprefixer with custom configuration', async t => {
    let css = `
        div {
            -webkit-box-shadow: 0 0 4px black;
            box-shadow: 0 0 4px black;
        }`;

    let file = new Stub('css/autoprefixer.css', css);

    mix.postCss(file.relativePath(), 'css');

    mix.options({
        // Don't remove outdated prefixes.
        autoprefixer: { remove: false }
    });

    await webpack.compile();

    t.true(file.hasCompiledContent(css));
});

test('it disables autoprefixer', async t => {
    let css = `
        @keyframes testing {
            to { color: red; }
        }`;

    let expected = `
        @keyframes testing {
            to { color: red; }
        }`;

    let file = new Stub('css/autoprefixer.css', css);

    mix.postCss(file.relativePath(), 'css');

    mix.options({ autoprefixer: false });

    await webpack.compile();

    t.true(file.hasCompiledContent(expected));
});

test('it disables autoprefixer but still loads postcss.config.js', async t => {
    let css = `
        :root {
            --some-color: red;
        }

        .test {
            color: var(--some-color);

        }

        @keyframes testing {
            to { color: green; }
        }`;

    let expected = `
        :root {
            --some-color: red;
        }

        .test {
            color: red;
            color: var(--some-color);

        }

        @keyframes testing {
            to { color: green; }
        }`;

    let file = new Stub('css/autoprefixer.css', css);

    mix.postCss(file.relativePath(), 'css');

    mix.options({ autoprefixer: false });

    await webpack.compile();

    t.true(file.hasCompiledContent(expected));
});

test('it applies CSSNano minification during production', async t => {
    Mix.config.production = true;

    let css = `
        body {
            color: red;
        }`;

    let expected = `body{color:red}`;

    let file = new Stub('css/cssnano.css', css);

    mix.postCss(file.relativePath(), 'css');

    await webpack.compile();

    t.true(file.hasCompiledContent(expected));
});

test('it disables CSSNano minification', async t => {
    Mix.config.production = true;

    let css = `
        @keyframes testing {
            to { color: red; }
        }`;

    // The default for production mode is to minify the output,
    // but this test will disable that. When we do so, we still
    // expect any postcss.config.js plugin to be loaded.
    let expected = `
        @-webkit-keyframes testing {
            to { color: red; }
        }
        @keyframes testing {
            to { color: red; }
        }`;

    mix.options({
        cssNano: false
    });

    let file = new Stub('css/cssnano.css', css);

    mix.postCss(file.relativePath(), 'css');

    await webpack.compile();

    t.true(file.hasCompiledContent(expected));
});

test('it applies CSSNano minification with configuration options', async t => {
    Mix.config.production = true;

    let css = `
        #empty {

        }`;

    let expected = `#empty{}`;

    let file = new Stub('css/cssnano.css', css);

    mix.postCss(file.relativePath(), 'css');

    // By default, PostCss will discard empty rules. Let's turn it
    // off to prove that custom CssNano options may be provided.
    mix.options({
        cssNano: { discardEmpty: false }
    });

    await webpack.compile();

    t.true(file.hasCompiledContent(expected));
});

test("it merge Mix's default postcss plugins with any found in the user's postcss.config.js.", async t => {
    Mix.config.production = true;

    let css = `
        :root {
            --some-color: red;
        }

        .test {
            color: var(--some-color);

        }

        @keyframes testing {
            to { color: green; }
        }`;

    // We expected to see the results of postcss-custom-properties, Autoprefixer, and CSSNano.
    let expected =
        ':root{--some-color:red}.test{color:red;color:var(--some-color)}@-webkit-keyframes testing{to{color:green}}@keyframes testing{to{color:green}}\n';

    let file = new Stub('css/minifier-example.css', css);

    mix.postCss(file.relativePath(), 'css');

    await webpack.compile();

    t.true(file.hasCompiledContent(expected));
});
