let AutomaticComponent = require('./AutomaticComponent');

class Css extends AutomaticComponent {
    /**
     * webpack rules to be appended to the master config.
     */
    webpackRules() {
        return [
            {
                test: /\.css$/,
                loaders: [
                    {
                        loader: 'style-loader',
                        options: { sourceMap: Mix.isUsing('sourcemaps') }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            sourceMap: Mix.isUsing('sourcemaps')
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: this.postCssOptions()
                    }
                ]
            },

            {
                test: /\.scss$/,
                exclude: this.excludePathsFor('sass'),
                loaders: [
                    {
                        loader: 'style-loader',
                        options: { sourceMap: Mix.isUsing('sourcemaps') }
                    },
                    {
                        loader: 'css-loader',
                        options: { sourceMap: Mix.isUsing('sourcemaps') }
                    },
                    {
                        loader: 'postcss-loader',
                        options: this.postCssOptions()
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            precision: 8,
                            outputStyle: 'expanded',
                            sourceMap: Mix.isUsing('sourcemaps')
                        }
                    }
                ]
            },

            {
                test: /\.sass$/,
                exclude: this.excludePathsFor('sass'),
                loaders: [
                    {
                        loader: 'style-loader',
                        options: { sourceMap: Mix.isUsing('sourcemaps') }
                    },
                    {
                        loader: 'css-loader',
                        options: { sourceMap: Mix.isUsing('sourcemaps') }
                    },
                    {
                        loader: 'postcss-loader',
                        options: this.postCssOptions()
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            precision: 8,
                            outputStyle: 'expanded',
                            indentedSyntax: true,
                            sourceMap: Mix.isUsing('sourcemaps')
                        }
                    }
                ]
            },

            {
                test: /\.less$/,
                exclude: this.excludePathsFor('less'),
                loaders: [
                    {
                        loader: 'style-loader',
                        options: { sourceMap: Mix.isUsing('sourcemaps') }
                    },
                    {
                        loader: 'css-loader',
                        options: { sourceMap: Mix.isUsing('sourcemaps') }
                    },
                    {
                        loader: 'postcss-loader',
                        options: this.postCssOptions()
                    },
                    {
                        loader: 'less-loader',
                        options: { sourceMap: Mix.isUsing('sourcemaps') }
                    }
                ]
            },

            {
                test: /\.styl(us)?$/,
                exclude: this.excludePathsFor('stylus'),
                loaders: [
                    {
                        loader: 'style-loader',
                        options: { sourceMap: Mix.isUsing('sourcemaps') }
                    },
                    {
                        loader: 'css-loader',
                        options: { sourceMap: Mix.isUsing('sourcemaps') }
                    },
                    {
                        loader: 'postcss-loader',
                        options: this.postCssOptions()
                    },
                    {
                        loader: 'stylus-loader',
                        options: { sourceMap: Mix.isUsing('sourcemaps') }
                    }
                ]
            }
        ];
    }

    /**
     * Paths to be excluded from the loader.
     *
     * @param {string} preprocessor
     */
    excludePathsFor(preprocessor) {
        let exclusions = Mix.components.get(preprocessor);

        return exclusions
            ? exclusions.details.map(preprocessor => preprocessor.src.path())
            : [];
    }

    /**
     * Fetch the appropriate postcss plugins for the compile.
     */
    postCssOptions() {
        if (Mix.components.get('postCss')) {
            return {
                sourceMap: Mix.isUsing('sourcemaps'),
                plugins: Mix.components.get('postCss').details[0].postCssPlugins
            };
        }

        // If the user has a postcss.config.js file in their project root,
        // postcss-loader will automatically read and fetch the plugins.
        if (File.exists(Mix.paths.root('postcss.config.js'))) {
            return {};
        }

        return { plugins: Config.postCss };
    }
}

module.exports = Css;
