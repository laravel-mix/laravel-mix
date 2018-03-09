import mix from './helpers/setup';

test.serial('mix.webpackConfig()', t => {
    // Test config passed as an object.
    let config = { context: 'changed' };
    let response = mix.webpackConfig(config);

    t.is(mix, response);

    t.deepEqual(config, Config.webpackConfig);

    // Test config passed via a callback.
    config = { context: 'changed again' };
    response = mix.webpackConfig(webpack => config);

    t.is(mix, response);

    t.deepEqual(config, Config.webpackConfig);
});

test.serial('Custom user config can be merged', t => {
    mix.webpackConfig({ context: 'changed' });

    t.is('changed', buildConfig().context);
});

test.serial('Custom user config can be merged as a callback function', t => {
    mix.webpackConfig(webpack => {
        return {
            context: 'changed'
        };
    });

    t.is('changed', buildConfig().context);
});
