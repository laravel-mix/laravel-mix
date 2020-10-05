import test from 'ava';
import File from '../../src/File';
import assert from '../helpers/assertions';
import { fakeApp } from '../helpers/paths';
import webpack from '../helpers/webpack';

import '../helpers/mix';

test('it combines a folder of scripts', async t => {
    let output = `${fakeApp}/public/all.js`;

    mix.scripts(`${fakeApp}/resources/assets/js`, output);

    await webpack.compile();

    t.true(File.exists(output));

    t.is(
        "alert('another stub');\n\nalert('stub');\n",
        File.find(output).read()
    );
});

test('it can minify a file', async t => {
    mix.js(`${fakeApp}/resources/assets/js/app.js`, 'js').minify(
        `${fakeApp}/public/js/app.js`
    );

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/js/app.min.js`));

    assert.manifestEquals(
        {
            '/js/app.js': '/js/app.js',
            '/js/app.min.js': '/js/app.min.js'
        },
        t
    );
});

test('it compiles JS and then combines the bundles files.', async t => {
    mix.js(`${fakeApp}/resources/assets/js/app.js`, 'js')
        .js(`${fakeApp}/resources/assets/js/another.js`, 'js')
        .scripts(
            [`${fakeApp}/public/js/app.js`, `${fakeApp}/public/js/another.js`],
            `${fakeApp}/public/js/all.js`
        );

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/js/all.js`));

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
    t.deepEqual(mix, mix.combine([], 'public/js/combined.js'));

    t.is(1, Mix.tasks.length);

    t.deepEqual(mix, mix.scripts([], 'public/js/combined.js'));
    t.deepEqual(mix, mix.babel([], 'public/js/combined.js'));
});

test('mix.minify()', t => {
    t.deepEqual(mix, mix.minify('public/js/minify.js'));

    t.is(1, Mix.tasks.length);
});
