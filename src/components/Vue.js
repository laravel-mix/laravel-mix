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
     * webpack rules to be appended to the master config.
     */
    webpackRules() {
        let vueLoaderOptions = this.vueLoaderOptions();

        return {
            test: /\.vue$/,
            loader: 'vue-loader',
            exclude: /bower_components/,
            options: vueLoaderOptions
        };
    }

    /**
     * webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        return this.extractPlugin;
    }

    /**
     * vue-loader-specific options.
     */
    vueLoaderOptions() {
        if (Config.extractVueStyles) {
            let fileName =
                typeof Config.extractVueStyles === 'string'
                    ? Config.extractVueStyles
                    : 'vue-styles.css';

            let filePath = fileName
                .replace(Config.publicPath, '')
                .replace(/^\//, '');

            this.extractPlugin = new ExtractTextPlugin(filePath);

            var sassLoader = this.extractPlugin.extract({
                use: 'css-loader!sass-loader?indentedSyntax',
                fallback: 'vue-style-loader'
            });

            var scssLoader = this.extractPlugin.extract({
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

        return Object.assign(
            {
                loaders: Config.extractVueStyles
                    ? {
                          js: {
                              loader: 'babel-loader',
                              options: Config.babel()
                          },

                          scss: scssLoader,

                          sass: sassLoader,

                          css: this.extractPlugin.extract({
                              use: 'css-loader',
                              fallback: 'vue-style-loader'
                          }),

                          stylus: this.extractPlugin.extract({
                              use:
                                  'css-loader!stylus-loader?paths[]=node_modules',
                              fallback: 'vue-style-loader'
                          }),

                          less: this.extractPlugin.extract({
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
    }
}

module.exports = Vue;
