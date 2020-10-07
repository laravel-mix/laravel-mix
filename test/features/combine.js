import test from 'ava';
import fs from 'fs-extra';
import File from '../../src/File';
import assert from '../helpers/assertions';
import webpack from '../helpers/webpack';

import '../helpers/mix';

test('it combines a folder of scripts', async t => {
    let output = `test/fixtures/app/dist/all.js`;

    mix.scripts(`test/fixtures/app/src/js`, output);

    await webpack.compile();

    t.true(File.exists(output));

    t.is(
        "alert('another stub');\n\nalert('stub');\n",
        File.find(output).read()
    );
});

test('it can minify a file', async t => {
    mix.js(`test/fixtures/app/src/js/app.js`, 'js').minify(
        `test/fixtures/app/dist/js/app.js`
    );

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/js/app.min.js`));

    assert.manifestEquals(
        {
            '/js/app.js': '/js/app.js',
            '/js/app.min.js': '/js/app.min.js'
        },
        t
    );
});

test('it compiles JS and then combines the bundles files.', async t => {
    mix.js(`test/fixtures/app/src/js/app.js`, 'js')
        .js(`test/fixtures/app/src/js/another.js`, 'js')
        .scripts(
            [
                `test/fixtures/app/dist/js/app.js`,
                `test/fixtures/app/dist/js/another.js`
            ],
            `test/fixtures/app/dist/js/all.js`
        );

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/js/all.js`));

    assert.manifestEquals(
        {
            '/js/app.js': '/js/app.js',
            '/js/another.js': '/js/another.js',
            '/js/all.js': '/js/all.js'
        },
        t
    );
});

test('it concatenates a directory of files, copies the output to a new location, and then minifies it in production mode', async t => {
    Config.production = true;

    // Setup
    new File('test/fixtures/app/src/combine/one.js')
        .makeDirectories()
        .write("alert('one')");

    new File('test/fixtures/app/src/combine/two.js').write("alert('two')");

    mix.scripts(
        [
            `test/fixtures/app/src/combine/one.js`,
            `test/fixtures/app/src/combine/two.js`
        ],
        'test/fixtures/app/dist/output/combined-scripts.js'
    );

    mix.copyDirectory(
        'test/fixtures/app/dist/output',
        'test/fixtures/app/dist/js'
    );

    await webpack.compile();

    let expected = `alert("one"),alert("two");\n`;

    t.is(
        expected,
        File.find('test/fixtures/app/dist/js/combined-scripts.js').read()
    );

    // Clean up
    fs.removeSync('test/fixtures/app/src/combine');
});

test('mix.combine/scripts/styles/babel()', t => {
    t.deepEqual(mix, mix.combine([], 'dist/js/combined.js'));

    t.is(1, Mix.tasks.length);

    t.deepEqual(mix, mix.scripts([], 'dist/js/combined.js'));
    t.deepEqual(mix, mix.babel([], 'dist/js/combined.js'));
});

test('mix.minify()', t => {
    t.deepEqual(mix, mix.minify('dist/js/minify.js'));

    t.is(1, Mix.tasks.length);
});
