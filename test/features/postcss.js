import test from 'ava';

import Stub from '../helpers/Stub.js';
import { context } from '../helpers/test.js';

test.beforeEach(async t => {
    const { mix } = context(t);

    mix.options({ autoprefixer: {} });
});

test('basic mix.postCss() compilation', async t => {
    const { assert, mix, fs, webpack } = context(t);

    await fs(t).stub({
        'postcss.config.cjs': `module.exports = { plugins: [require('postcss-custom-properties')] };`,
        'css/basic-compilation.css': 'body { color: red; }'
    });

    mix.postCss('stubs/basic-compilation.css', 'css');

    await webpack.compile();

    assert(t).file('css/basic-compilation.css').exists();
    assert(t).file('css/basic-compilation.css').matchesCss('body { color: red; }');
});

test('mix.css() is an alias for mix.postCss()', async t => {
    const { assert, mix, fs, webpack } = context(t);

    await fs(t).stub({
        'css/basic-compilation.css': 'body { color: red; }',
        'stubs/test.txt': 'test'
    });

    mix.postCss('stubs/basic-compilation.css', 'css');

    await webpack.compile();

    assert(t).file('css/basic-compilation.css').exists();
    assert(t).file('css/basic-compilation.css').matchesCss('body { color: red; }');
});

test.only('it applies autoprefixer to compiled CSS', async t => {
    const { assert, mix, fs, webpack } = context(t);

    await fs(t).stub({
        'css/autoprefixer.css': `@keyframes testing { to { color: red; } }`,
        'stubs/test.txt': 'test'
    });

    mix.postCss('stubs/autoprefixer.css', 'css');

    const { config } = await webpack.compile().catch(err => err);

    assert(t).file('css/autoprefixer.css').exists();
    assert(t).file('css/autoprefixer.css').matchesCss(`
        @-webkit-keyframes testing {
            to { color: red; }
        }
        @keyframes testing {
            to { color: red; }
        }
    `);
});

test('it applies autoprefixer with custom configuration', async t => {
    const { mix, webpack } = context(t);

    let file = new Stub(
        'css/autoprefixer.css',
        `
    div {
        -webkit-box-shadow: 0 0 4px black;
        box-shadow: 0 0 4px black;
    }`
    );

    mix.postCss(file.relativePath(), 'css');

    mix.options({
        // Don't remove outdated prefixes.
        autoprefixer: { remove: false }
    });

    await webpack.compile();

    t.true(
        file.hasCompiledContent(`
    div {
        -webkit-box-shadow: 0 0 4px black;
        box-shadow: 0 0 4px black;
    }`)
    );
});

test('it disables autoprefixer', async t => {
    const { assert, mix, fs, webpack } = context(t);

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
    const { assert, mix, fs, webpack } = context(t);

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
    const { assert, mix, fs, webpack } = context(t);

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
    const { assert, mix, fs, webpack } = context(t);

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
    const { assert, mix, fs, webpack } = context(t);

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
    const { assert, mix, fs, webpack } = context(t);

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
