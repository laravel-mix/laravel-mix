let ExtractTextPlugin = require('extract-text-webpack-plugin');

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
    webpackConfig(config) {
        let { vueLoaderOptions, extractPlugin } = this.vueLoaderOptions();

        config.module.rules.push({
            test: /\.vue$/,
            loader: 'vue-loader',
            exclude: /bower_components/,
            options: vueLoaderOptions
        });

        config.plugins.push(extractPlugin);
    }

    /**
     * vue-loader-specific options.
     */
    vueLoaderOptions() {
        let extractPlugin = this.extractPlugin();

        if (Config.extractVueStyles) {
            var sassLoader = extractPlugin.extract({
                use: 'css-loader!sass-loader?indentedSyntax',
                fallback: 'vue-style-loader'
            });

            var scssLoader = extractPlugin.extract({
                use: 'css-loader!sass-loader',
                fallback: 'vue-style-loader'
            });

            if (Config.globalVueStyles) {
                scssLoader.push({
                    loader: 'sass-resources-loader',
                    options: {
                        resources: Mix.paths.root(Config.globalVueStyles)
                    }
                });

                sassLoader.push({
                    loader: 'sass-resources-loader',
                    options: {
                        resources: Mix.paths.root(Config.globalVueStyles)
                    }
                });
            }
        }

        let vueLoaderOptions = Object.assign(
            {
                loaders: Config.extractVueStyles
                    ? {
                          js: {
                              loader: 'babel-loader',
                              options: Config.babel()
                          },

                          scss: scssLoader,

                          sass: sassLoader,

                          css: extractPlugin.extract({
                              use: 'css-loader',
                              fallback: 'vue-style-loader'
                          }),

                          stylus: extractPlugin.extract({
                              use:
                                  'css-loader!stylus-loader?paths[]=node_modules',
                              fallback: 'vue-style-loader'
                          }),

                          less: extractPlugin.extract({
                              use: 'css-loader!less-loader',
                              fallback: 'vue-style-loader'
                          })
                      }
                    : {
                          js: {
                              loader: 'babel-loader',
                              options: Config.babel()
                          }
                      },
                postcss: Config.postCss
            },
            Config.vue
        );

        return { vueLoaderOptions, extractPlugin };
    }

    extractPlugin() {
        if (typeof Config.extractVueStyles === 'string') {
            return new ExtractTextPlugin(this.extractFilePath());
        }

        let preprocessorName = Object.keys(Mix.components.all())
            .reverse()
            .find(componentName => {
                return ['sass', 'less', 'stylus', 'postCss'].includes(
                    componentName
                );
            });

        if (!preprocessorName) {
            return new ExtractTextPlugin(this.extractFilePath());
        }

        return Mix.components.get(preprocessorName).extractPlugins.slice(-1)[0];
    }

    extractFilePath() {
        let fileName =
            typeof Config.extractVueStyles === 'string'
                ? Config.extractVueStyles
                : 'vue-styles.css';

        return fileName.replace(Config.publicPath, '').replace(/^\//, '');
    }
}

module.exports = Vue;
