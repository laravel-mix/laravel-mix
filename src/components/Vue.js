let { VueLoaderPlugin } = require('vue-loader');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');

class Vue {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        if (Config.extractVueStyles && Config.globalVueStyles) {
            return ['sass-resources-loader']; // Required for importing global styles into every component.
        }
    }

    /**
     * Override the generated webpack configuration.
     *
     * @param {Object} webpackConfig
     */
    webpackConfig(webpackConfig) {
        webpackConfig.module.rules.push({
            test: /\.vue$/,
            loader: 'vue-loader'
        });

        this.vueLoaders(webpackConfig);

        webpackConfig.plugins.push(new VueLoaderPlugin());

        if (Config.extractVueStyles) {
            // TODO - https://github.com/webpack-contrib/mini-css-extract-plugin/issues/45 , until this gets resolved, we cannot do 2 mini extract plugins
            let extractPlugin = this.extractPlugin();
            if (extractPlugin) {
                webpackConfig.plugins.push(extractPlugin);
            }
        }
    }

    /**
     * vue-loader-specific options.
     */
    vueLoaders(webpackConfig) {
        let loaders = [];

        this._updateRuleLoaders(webpackConfig, 'css', [
            {
                use: [
                    Mix.components.get('css') || Config.extractVueStyles
                        ? MiniCssExtractPlugin.loader
                        : 'vue-style-loader',
                    'css-loader'
                ]
            }
        ]);

        this._updateRuleLoaders(webpackConfig, 'less', [
            {
                use: [
                    Mix.components.get('less') || Config.extractVueStyles
                        ? MiniCssExtractPlugin.loader
                        : 'vue-style-loader',
                    'css-loader',
                    'less-loader'
                ]
            }
        ]);

        let sassLoader = {
            loader: 'sass-loader'
        };

        if (Config.globalVueStyles) {
            sassLoader.options = {
                resources: Mix.paths.root(Config.globalVueStyles)
            };
        }

        this._updateRuleLoaders(webpackConfig, 's[ac]ss', [
            {
                use: [
                    Mix.components.get('sass') || Config.extractVueStyles
                        ? MiniCssExtractPlugin.loader
                        : 'vue-style-loader',
                    'css-loader',
                    sassLoader
                ]
            }
        ]);

        webpackConfig.module.rules.push({
            test: /\.stylus$/,
            oneOf: [
                {
                    use: [
                        Mix.components.get('stylus') || Config.extractVueStyles
                            ? MiniCssExtractPlugin.loader
                            : 'vue-style-loader',
                        'css-loader',
                        'stylus-loader'
                    ]
                }
            ]
        });

        return loaders;
    }

    extractPlugin() {
        if (typeof Config.extractVueStyles === 'string') {
            return new MiniCssExtractPlugin({
                filename: this.extractFileName(),
                chunkFilename: this.extractFileName()
            });
        }

        let preprocessorName = Object.keys(Mix.components.all())
            .reverse()
            .find(componentName => {
                return ['sass', 'less', 'stylus', 'postCss'].includes(
                    componentName
                );
            });

        if (!preprocessorName) {
            return new MiniCssExtractPlugin({
                filename: this.extractFileName(),
                chunkFilename: this.extractFileName()
            });
        }
        return false;
    }

    /**
     * vue-loader-specific options.
     */
    _updateRuleLoaders(webpackConfig, loader, loaders) {
        let rule = webpackConfig.module.rules.find(
            rule => rule.test.toString() === `/\\.${loader}$/`
        );
        rule.oneOf = loaders;
        rule.oneOf.push({ use: rule.loaders });
        delete rule.loaders;
    }

    extractFileName() {
        let fileName =
            typeof Config.extractVueStyles === 'string'
                ? Config.extractVueStyles
                : '/css/vue-styles.css';

        return fileName.replace(Config.publicPath, '').replace(/^\//, '');
    }
}

module.exports = Vue;
