let AutomaticComponent = require('./AutomaticComponent');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let AppendVueStylesPlugin = require('../webpackPlugins/Css/AppendVueStylesPlugin');
let RemoveCssOnlyChunksPlugin = require('../webpackPlugins/Css/RemoveCssOnlyChunksPlugin');

class Css extends AutomaticComponent {
    /**
     * webpack rules to be appended to the master config.
     */
    webpackRules() {
        return [
            {
                test: /\.css$/,
                use: [
                    ...Css.loaders(),
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    {
                        loader: 'postcss-loader',
                        options: this.postCssOptions()
                    }
                ]
            },

            {
                test: /\.scss$/,
                exclude: this.excludePathsFor('sass'),
                use: [
                    ...Css.loaders(),
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: this.postCssOptions()
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                precision: 8,
                                outputStyle: 'expanded'
                            }
                        }
                    }
                ]
            },

            {
                test: /\.sass$/,
                exclude: this.excludePathsFor('sass'),
                use: [
                    ...Css.loaders(),
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: this.postCssOptions()
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                precision: 8,
                                outputStyle: 'expanded',
                                indentedSyntax: true
                            }
                        }
                    }
                ]
            },

            {
                test: /\.less$/,
                exclude: this.excludePathsFor('less'),
                use: [
                    ...Css.loaders(),
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: this.postCssOptions()
                    },
                    { loader: 'less-loader' }
                ]
            },

            {
                test: /\.styl(us)?$/,
                exclude: this.excludePathsFor('stylus'),
                use: [
                    ...Css.loaders(),
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: this.postCssOptions()
                    },
                    { loader: 'stylus-loader' }
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

    /**
     * webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        return [
            new AppendVueStylesPlugin(),
            new RemoveCssOnlyChunksPlugin(),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[name].css',
                esModule: true
            })
        ];
    }

    /**
     * Gets a list of loaders to handle CSS
     *
     * This handles inlining or extraction of CSS based on context.
     * The default is to inline styles
     *
     * @param {object} [options]
     * @param {"auto" | "inline" | "extract"} options.method The method to use when handling CSS.
     */
    static loaders({ method = 'auto' } = {}) {
        const loaders = [];

        if (method === 'auto') {
            if (Config.extractVueStyles !== false) {
                method = 'extract';
            } else {
                method = 'inline';
            }
        }

        if (method === 'inline') {
            loaders.push({ loader: 'style-loader' });
        } else if (method === 'extract') {
            loaders.push({
                loader: MiniCssExtractPlugin.loader,
                options: {
                    hmr: Mix.isUsing('hmr'),
                    esModule: true
                }
            });
        } else {
            throw new Error(
                `Unknown css loader method '${method}'. Expected auto, inline, or extract.`
            );
        }

        return loaders;
    }
}

module.exports = Css;
