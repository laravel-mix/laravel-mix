import test from 'ava';

import Log from '../../src/Log.js';
import { mix, webpack } from '../helpers/test.js';

test('mix.dumpWebpackConfig()', async t => {
    let config;

    Log.info = webpackConfig => {
        config = JSON.parse(webpackConfig);
    };

    mix.js('test/fixtures/app/src/js/app.js', 'js').dumpWebpackConfig();

    await webpack.buildConfig();

    // Quick test to ensure that a webpack config object was logged.
    t.truthy(config.context);
    t.true(typeof config.module === 'object');
    t.true(typeof config.plugins === 'object');
});
