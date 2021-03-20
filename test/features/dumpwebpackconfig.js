import test from 'ava';
import Log from '../../src/Log';
import webpack from '../helpers/webpack';

import { mix } from '../helpers/mix';

test('mix.dumpWebpackConfig()', async t => {
    let config;

    Log.info = webpackConfig => {
        config = JSON.parse(webpackConfig);
    };

    mix.js('test/fixtures/app/src/js/app.js', 'js').dumpWebpackConfig();

    await webpack.compile();

    // Quick test to ensure that a webpack config object was logged.
    t.truthy(config.context);
    t.true(typeof config.module === 'object');
    t.true(typeof config.plugins === 'object');
});
