let webpack = require('webpack');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let Verify = require('../Verify');

module.exports = function() {
    const {
        jsx,
        conditional,
        css,
        sass,
        less,
        html,
        images,
        fonts,
        cursors,
        vue,
    } = Config.webpackRules;
    let rules = [];
    let extractPlugins = [];

    // Babel Compilation.
    rules.push(jsx(Config));

    // TypeScript Compilation.
    if (Mix.isUsing('typeScript')) {
        rules.push(conditional.typeScript(Config));
    }

    // CSS Compilation.
    rules.push(css(Config));

    // Recognize .scss Imports.
    rules.push(sass(Config));

    // Recognize .less Imports.
    rules.push(less(Config));

    // Add support for loading HTML files.
    rules.push(html(Config));

    // Add support for loading images.
    rules.push(images(Config));

    // Add support for loading fonts.
    rules.push(fonts(Config));

    // Add support for loading cursor files.
    rules.push(cursors(Config));

    // Here, we'll filter through all CSS preprocessors that the user has requested.
    // For each one, we'll add a new Webpack rule and then prepare the necessary
    // extract plugin to extract the CSS into its file.
    Object.keys(Config.preprocessors).forEach(type => {
        if (type === 'fastSass') return;

        Config.preprocessors[type].forEach(preprocessor => {
            let outputPath = preprocessor.output.filePath
                .replace(Config.publicPath + path.sep, path.sep)
                .replace(/\\/g, '/');

            tap(new ExtractTextPlugin(outputPath), extractPlugin => {
                let loaders = [
                    {
                        loader: 'css-loader',
                        options: {
                            url: Config.processCssUrls,
                            sourceMap: Mix.isUsing('sourcemaps'),
                            importLoaders: 1
                        }
                    },

                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap:
                                type === 'sass' && Config.processCssUrls
                                    ? true
                                    : Mix.isUsing('sourcemaps'),
                            ident: 'postcss',
                            plugins: (function() {
                                let plugins = Config.postCss;

                                if (
                                    preprocessor.postCssPlugins &&
                                    preprocessor.postCssPlugins.length
                                ) {
                                    plugins = preprocessor.postCssPlugins;
                                }

                                if (
                                    Config.autoprefixer &&
                                    Config.autoprefixer.enabled
                                ) {
                                    plugins.push(
                                        require('autoprefixer')(
                                            Config.autoprefixer.options
                                        )
                                    );
                                }

                                return plugins;
                            })()
                        }
                    }
                ];

                if (type === 'sass' && Config.processCssUrls) {
                    loaders.push({
                        loader: 'resolve-url-loader',
                        options: {
                            sourceMap: true,
                            root: Mix.paths.root('node_modules')
                        }
                    });
                }

                if (type !== 'postCss') {
                    loaders.push({
                        loader: `${type}-loader`,
                        options: Object.assign(preprocessor.pluginOptions, {
                            sourceMap:
                                type === 'sass' && Config.processCssUrls
                                    ? true
                                    : Mix.isUsing('sourcemaps')
                        })
                    });
                }

                rules.push({
                    test: preprocessor.src.path(),
                    use: extractPlugin.extract({
                        fallback: 'style-loader',
                        use: loaders
                    })
                });

                extractPlugins.push(extractPlugin);
            });
        });
    });

    // Vue Compilation.
    let vueExtractPlugin;

    if (Config.extractVueStyles) {
        let fileName =
            typeof Config.extractVueStyles === 'string'
                ? Config.extractVueStyles
                : 'vue-styles.css';
        let filePath = fileName
            .replace(Config.publicPath, '')
            .replace(/^\//, '');
        vueExtractPlugin = extractPlugins.length
            ? extractPlugins[0]
            : new ExtractTextPlugin(filePath);
    }

    rules.push(vue(Config, vueExtractPlugin));

    // If there were no existing extract text plugins to add our
    // Vue styles extraction too, we'll push a new one in.
    if (Config.extractVueStyles && !extractPlugins.length) {
        extractPlugins.push(vueExtractPlugin);
    }

    // If we want to import a global styles file in every component,
    // use sass resources loader
    if (Config.extractVueStyles && Config.globalVueStyles) {
        Verify.dependency('sass-resources-loader', ['sass-resources-loader']);
        tap(rules[rules.length - 1].options.loaders, vueLoaders => {
            vueLoaders.scss.push({
                loader: 'sass-resources-loader',
                options: {
                    resources: Mix.paths.root(Config.globalVueStyles)
                }
            });
            vueLoaders.sass.push({
                loader: 'sass-resources-loader',
                options: {
                    resources: Mix.paths.root(Config.globalVueStyles)
                }
            });
        });
    }

    return { rules, extractPlugins };
};
