const Verify = require('../Verify');

module.exports = (Config, vueExtractPlugin) => {
    const vueRule = {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /bower_components/,
        options: Object.assign(
            {
                // extractCSS: Config.extractVueStyles,
                loaders: Config.extractVueStyles
                    ? {
                        js: {
                            loader: 'babel-loader',
                            options: Config.babel()
                        },

                        scss: vueExtractPlugin.extract({
                            use: 'css-loader!sass-loader',
                            fallback: 'vue-style-loader'
                        }),

                        sass: vueExtractPlugin.extract({
                            use: 'css-loader!sass-loader?indentedSyntax',
                            fallback: 'vue-style-loader'
                        }),

                        css: vueExtractPlugin.extract({
                            use: 'css-loader',
                            fallback: 'vue-style-loader'
                        }),

                        stylus: vueExtractPlugin.extract({
                            use:
                                'css-loader!stylus-loader?paths[]=node_modules',
                            fallback: 'vue-style-loader'
                        }),

                        less: vueExtractPlugin.extract({
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
        )
    };
    // If we want to import a global styles file in every component,
    // use sass resources loader
    if (Config.extractVueStyles && Config.globalVueStyles) {
        Verify.dependency('sass-resources-loader', ['sass-resources-loader']);
        tap(vueRule.options.loaders, vueLoaders => {
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
    return vueRule;
};