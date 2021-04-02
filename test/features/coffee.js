import test from 'ava';
import assert from '../helpers/assertions';
import File from '../../src/File';
import webpack from '../helpers/webpack';

import { mix } from '../helpers/mix';

test('it returns the mix instance', t => {
    t.deepEqual(mix, mix.coffee('resources/assets/js/app.coffee', 'dist/js'));
});

test('it applies the correct webpack rules', async t => {
    mix.coffee('resources/assets/js/app.coffee', 'dist/js');

    t.truthy(
        (await webpack.buildConfig()).module.rules.find(
            rule => rule.test.toString() === '/\\.coffee$/'
        )
    );
});

test('it compiles', async t => {
    // Setup.
    new File(`test/fixtures/app/src/js/app.coffee`).write('module Foobar');

    mix.coffee(`test/fixtures/app/src/js/app.coffee`, 'js');

    await webpack.compile();

    t.true(File.exists(`test/fixtures/app/dist/js/app.js`));

    assert.manifestEquals(
        {
            '/js/app.js': '/js/app.js'
        },
        t
    );

    // Cleanup.
    File.find(`test/fixtures/app/src/js/app.coffee`).delete();
});
