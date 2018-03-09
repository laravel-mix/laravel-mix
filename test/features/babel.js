import mix from './helpers/setup';

test.serial('mix.babelConfig()', t => {
    mix.babelConfig({
        plugins: ['some-babel-plugin']
    });

    t.true(Config.babel().plugins.includes('some-babel-plugin'));
});
