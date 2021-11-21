import test from 'ava';

import File from '../../src/File.js';
import { assert, mix, Mix, webpack } from '../helpers/test.js';

test('it accepts a src directory', async t => {
    mix.scripts(
        'test/fixtures/app/src/combine/foo',
        'test/fixtures/app/dist/js/combined-scripts.js'
    );

    await webpack.compile();

    assert(t)
        .file('test/fixtures/app/dist/js/combined-scripts.js')
        .matchesCss("alert('foo1');alert('foo2');");
});

test('it accepts a src wildcard', async t => {
    mix.scripts(
        'test/fixtures/app/src/combine/foo/*.js',
        'test/fixtures/app/dist/js/combined-scripts.js'
    );

    await webpack.compile();

    assert(t)
        .file('test/fixtures/app/dist/js/combined-scripts.js')
        .matchesCss("alert('foo1');alert('foo2');");
});

test('it accepts a src array of wildcards', async t => {
    mix.scripts(
        [
            'test/fixtures/app/src/combine/foo/*.js',
            `test/fixtures/app/src/combine/bar/*.js`
        ],
        'test/fixtures/app/dist/js/combined-scripts.js'
    );

    await webpack.compile();

    assert(t)
        .file('test/fixtures/app/dist/js/combined-scripts.js')
        .matchesCss("alert('foo1');alert('foo2');alert('bar1');alert('bar2');");
});

test('it compiles JS and then combines the bundles files.', async t => {
    mix.js(`test/fixtures/app/src/js/app.js`, 'js')
        .js(`test/fixtures/app/src/js/another.js`, 'js')
        .scripts(
            [`test/fixtures/app/dist/js/app.js`, `test/fixtures/app/dist/js/another.js`],
            `test/fixtures/app/dist/js/all.js`
        );

    await webpack.compile();

    assert(t).file(`test/fixtures/app/dist/js/all.js`).exists();

    assert(t).manifestEquals({
        '/js/app.js': '/js/app.js',
        '/js/another.js': '/js/another.js',
        '/js/all.js': '/js/all.js'
    });
});

test('it concatenates a directory of files, copies the output to a new location, and then minifies it in production mode', async t => {
    Mix.config.production = true;

    mix.scripts(
        [
            `test/fixtures/app/src/combine/foo/one.js`,
            `test/fixtures/app/src/combine/foo/two.js`
        ],
        'test/fixtures/app/dist/output/combined-scripts.js'
    );

    mix.copyDirectory('test/fixtures/app/dist/output', 'test/fixtures/app/dist/js');

    await webpack.compile();

    assert(t)
        .file('test/fixtures/app/dist/js/combined-scripts.js')
        .matchesCss('alert("foo1"),alert("foo2");');
});

test('it minifies a file', async t => {
    mix.js(`test/fixtures/app/src/js/app.js`, 'js').minify(
        `test/fixtures/app/dist/js/app.js`
    );

    await webpack.compile();

    assert(t).file(`test/fixtures/app/dist/js/app.min.js`).exists();

    assert(t).manifestEquals({
        '/js/app.js': '/js/app.js',
        '/js/app.min.js': '/js/app.min.js'
    });
});

test('it minifies an array of files', async t => {
    mix.minify([
        `test/fixtures/app/src/combine/foo/one.js`,
        `test/fixtures/app/src/combine/foo/two.js`
    ]);

    await webpack.compile();

    assert(t).file(`test/fixtures/app/src/combine/foo/one.min.js`).exists();
    assert(t).file(`test/fixtures/app/src/combine/foo/two.min.js`).exists();

    assert(t).manifestEquals({
        '/test/fixtures/app/src/combine/foo/one.min.js':
            '/test/fixtures/app/src/combine/foo/one.min.js',
        '/test/fixtures/app/src/combine/foo/two.min.js':
            '/test/fixtures/app/src/combine/foo/two.min.js'
    });

    // Clean Up
    File.find(`test/fixtures/app/src/combine/foo/one.min.js`).delete();
    File.find(`test/fixtures/app/src/combine/foo/two.min.js`).delete();
});

test('it can concat files produced by the build', async t => {
    mix.postCss(`test/fixtures/app/src/css/app.css`, `test/fixtures/app/dist/app.css`);
    mix.styles(
        [`test/fixtures/app/src/css/global.css`, `test/fixtures/app/dist/app.css`],
        `test/fixtures/app/dist/all.css`
    );

    await webpack.compile();

    assert(t).file(`test/fixtures/app/dist/all.css`).exists();
    assert(t).file(`test/fixtures/app/dist/all.css`).matchesCss(`
        :root {
            --shared-color: rebeccapurple;
        }
        .app {
            color: red;
            background: url('/absolute/image.jpg');
        }
    `);
});

test('combine with missing files throws an error', async t => {
    mix.combine(
        [`test/fixtures/app/src/css/i-do-not-exist.css`],
        `test/fixtures/app/dist/all.css`
    );

    await t.throwsAsync(() => webpack.compile(), { code: 'ENOENT' });
});
