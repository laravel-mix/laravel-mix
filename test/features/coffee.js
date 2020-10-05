import test from 'ava';
import assert from '../helpers/assertions';
import { fakeApp } from '../helpers/paths';
import File from '../../src/File';
import webpack from '../helpers/webpack';

import '../helpers/mix';

test('it returns the mix instance', t => {
    t.deepEqual(mix, mix.coffee('resources/assets/js/app.coffee', 'public/js'));
});

test('it applies the correct webpack rules', t => {
    mix.coffee('resources/assets/js/app.coffee', 'public/js');

    t.truthy(
        webpack
            .buildConfig()
            .module.rules.find(rule => rule.test.toString() === '/\\.coffee$/')
    );
});

test('it compiles', async t => {
    // Setup.
    new File(`${fakeApp}/resources/assets/js/app.coffee`).write(
        'module Foobar'
    );

    mix.coffee(`${fakeApp}/resources/assets/js/app.coffee`, 'js');

    await webpack.compile();

    t.true(File.exists(`${fakeApp}/public/js/app.js`));

    assert.manifestEquals(
        {
            '/js/app.js': '/js/app.js'
        },
        t
    );

    // Cleanup.
    File.find(`${fakeApp}/resources/assets/js/app.coffee`).delete();
});
