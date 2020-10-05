import test from 'ava';
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
