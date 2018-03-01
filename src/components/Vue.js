let ExtractTextPlugin = require('extract-text-webpack-plugin');

class Vue {
    dependencies() {
        if (Config.extractVueStyles && Config.globalVueStyles) {
            return ['sass-resources-loader']; // Required for importing global styles into every component.
        }
    }

    webpackRules() {
        if (Config.extractVueStyles) {
            let fileName =
                typeof Config.extractVueStyles === 'string'
                    ? Config.extractVueStyles
                    : 'vue-styles.css';

            let filePath = fileName
                .replace(Config.publicPath, '')
                .replace(/^\//, '');

            Config.extractPlugins.push(new ExtractTextPlugin(filePath));
        }

        let vueLoaderOptions = this.vueLoaderOptions();

        if (Config.extractVueStyles && Config.globalVueStyles) {
            vueLoaderOptions.scss.push({
                loader: 'sass-resources-loader',
                options: {
                    resources: Mix.paths.root(Config.globalVueStyles)
                }
            });

            vueLoaderOptions.sass.push({
                loader: 'sass-resources-loader',
                options: {
                    resources: Mix.paths.root(Config.globalVueStyles)
                }
            });
        }

        return {
            test: /\.vue$/,
            loader: 'vue-loader',
            exclude: /bower_components/,
            options: vueLoaderOptions
        };
    }

    vueLoaderOptions() {
        let extractPlugin =
            Config.extractPlugins[Config.extractPlugins.length - 1];

        return Object.assign(
            {
                loaders: Config.extractVueStyles
                    ? {
                          js: {
                              loader: 'babel-loader',
                              options: Config.babel()
                          },

                          scss: extractPlugin.extract({
                              use: 'css-loader!sass-loader',
                              fallback: 'vue-style-loader'
                          }),

                          sass: extractPlugin.extract({
                              use: 'css-loader!sass-loader?indentedSyntax',
                              fallback: 'vue-style-loader'
                          }),

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
    }
}

module.exports = Vue;
