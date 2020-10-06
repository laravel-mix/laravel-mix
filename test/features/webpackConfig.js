import test from 'ava';

import '../helpers/mix';
import { buildConfig } from '../helpers/webpack';

test('mix.webpackConfig()', t => {
    // Test config passed as an object.
    let config = { context: 'changed' };
    let response = mix.webpackConfig(config);

    t.deepEqual(mix, response);

    t.deepEqual(config, Config.webpackConfig);

    // Test config passed via a callback.
    config = { context: 'changed again' };
    response = mix.webpackConfig(webpack => config);

    t.deepEqual(mix, response);

    t.deepEqual(config, Config.webpackConfig);
});

test('Custom user config can be merged', t => {
    mix.webpackConfig({ context: 'changed' });

    t.is('changed', buildConfig().context);
});

test('Custom user config can be merged as a callback function', t => {
    mix.webpackConfig(webpack => {
        return {
            context: 'changed'
        };
    });

    t.is('changed', buildConfig().context);
});
