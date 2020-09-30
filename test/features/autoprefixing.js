import mix from './helpers/setup';
import webpack from '../helpers/webpack';

test('Autoprefixer should always be applied after all other postcss plugins', t => {
    mix.sass('resources/assets/sass/sass.scss', 'public/css').options({
        postCss: [require('postcss-custom-properties')]
    });

    let plugins = webpack
        .buildConfig()
        .module.rules.find(rule =>
            rule.test
                .toString()
                .includes(path.normalize('/resources/assets/sass/sass.scss'))
        )
        .use.find(loader => loader.loader === 'postcss-loader')
        .options.postcssOptions.plugins.map(
            plugin => plugin.postcssPlugin || plugin().postcssPlugin
        );

    t.deepEqual(['postcss-custom-properties', 'autoprefixer'], plugins);
});
