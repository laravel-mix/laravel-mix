import mix from './helpers/setup';
import Log from '../../src/Log';
import webpack from '../helpers/webpack';

test('mix.dumpWebpackConfig()', async t => {
    let config;

    Log.info = webpackConfig => {
        config = JSON.parse(webpackConfig);
    };

    mix.js(
        'test/fixtures/fake-app/resources/assets/js/app.js',
        'js'
    ).dumpWebpackConfig();

    await webpack.compile();

    // Quick test to ensure that a webpack config object was logged.
    t.truthy(config.context);
    t.true(typeof config.module === 'object');
    t.true(typeof config.plugins === 'object');
});
