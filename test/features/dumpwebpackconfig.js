import mix from './helpers/setup';

test.serial.cb('mix.dumpWebpackConfig()', t => {
    let config;

    console.log = webpackConfig => {
        config = JSON.parse(webpackConfig);
    };

    mix.js(
        'test/fixtures/fake-app/resources/assets/js/app.js',
        'js'
    ).dumpWebpackConfig();

    compile(t, () => {
        // Quick test to ensure that a webpack config object was logged.
        t.truthy(config.context);
        t.true(typeof config.module === 'object');
        t.true(typeof config.plugins === 'object');
    });
});
