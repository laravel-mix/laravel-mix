import mix from './helpers/setup';

test.serial('Custom vue-loader options may be specified', t => {
    mix.js('resources/assets/js/app.js', 'public/js').options({
        vue: {
            camelCase: true,
            postLoaders: { stub: 'foo' }
        }
    });

    let vueOptions = buildConfig().module.rules.find(
        rule => rule.loader === 'vue-loader'
    ).options;

    t.true(vueOptions.camelCase);
    t.deepEqual({}, vueOptions.preLoaders);
    t.deepEqual({ stub: 'foo' }, vueOptions.postLoaders);
    t.false(vueOptions.esModule);
});
