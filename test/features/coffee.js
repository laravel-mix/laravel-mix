import mix from './helpers/setup';
import assert from '../helpers/assertions';
import { fakeApp } from '../helpers/paths';
import File from '../../src/File';

test.serial('it returns the mix instance', t => {
    t.is(mix, mix.coffee('resources/assets/js/app.coffee', 'public/js'));
});

test.serial('it applies the correct webpack rules', t => {
    mix.coffee('resources/assets/js/app.coffee', 'public/js');

    t.truthy(
        buildConfig().module.rules.find(
            rule => rule.test.toString() === '/\\.coffee$/'
        )
    );
});

test.serial('it compiles', async t => {
    // Setup.
    new File(`${fakeApp}/resources/assets/js/app.coffee`).write(
        'module Foobar'
    );

    mix.coffee(`${fakeApp}/resources/assets/js/app.coffee`, 'js');

    await compile();

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
