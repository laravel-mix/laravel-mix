let File = require('../File');
let mapValues = require('lodash').mapValues;
let AutomaticComponent = require('./AutomaticComponent');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');

class Css extends AutomaticComponent {
    /**
     * webpack rules to be appended to the master config.
     */
    webpackRules() {
        return [
            {
                test: /\.css$/,
                use: [
                    ...Css.afterLoaders(),
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    {
                        loader: 'postcss-loader',
                        options: this.postCssOptions()
                    },
                    ...Css.beforeLoaders({
                        type: 'css',
                        injectGlobalStyles: true
                    })
                ]
            },

            {
                test: /\.scss$/,
                exclude: this.excludePathsFor('sass'),
                use: [
                    ...Css.afterLoaders(),
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
                    },
                    ...Css.beforeLoaders({
                        type: 'scss',
                        injectGlobalStyles: true
                    })
                ]
            },

            {
                test: /\.sass$/,
                exclude: this.excludePathsFor('sass'),
                use: [
                    ...Css.afterLoaders(),
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
                    },
                    ...Css.beforeLoaders({
                        type: 'sass',
                        injectGlobalStyles: true
                    })
                ]
            },

            {
                test: /\.less$/,
                exclude: this.excludePathsFor('less'),
                use: [
                    ...Css.afterLoaders(),
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: this.postCssOptions()
                    },
                    { loader: 'less-loader' },
                    ...Css.beforeLoaders({
                        type: 'less',
                        injectGlobalStyles: true
                    })
                ]
            },

            {
                test: /\.styl(us)?$/,
                exclude: this.excludePathsFor('stylus'),
                use: [
                    ...Css.afterLoaders(),
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: this.postCssOptions()
                    },
                    { loader: 'stylus-loader' },
                    ...Css.beforeLoaders({
                        type: 'stylus',
                        injectGlobalStyles: true
                    })
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
                postcssOptions: {
                    plugins: Mix.components.get('postCss').details[0]
                        .postCssPlugins
                }
            };
        }

        // If the user has a postcss.config.js file in their project root,
        // postcss-loader will automatically read and fetch the plugins.
        if (File.exists(Mix.paths.root('postcss.config.js'))) {
            return {};
        }

        return {
            postcssOptions: { plugins: Config.postCss }
        };
    }

    /**
     * webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        return [
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
    static afterLoaders({ method = 'auto' } = {}) {
        const loaders = [];

        if (method === 'auto') {
            // TODO: Fix
            if (Mix.extractingStyles !== false) {
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

    /**
     * Gets a list of loaders to run
     *
     * This handles inlining or extraction of CSS based on context.
     * The default is to inline styles
     *
     * @param {object} [options]
     * @param {string} options.type The file type
     * @param {boolean} options.injectGlobalStyles Whether or not to inject global styles
     */
    static beforeLoaders({ type, injectGlobalStyles }) {
        const loaders = [];

        if (Mix.globalStyles && injectGlobalStyles) {
            let resources =
                Css.normalizeGlobalStyles(Mix.globalStyles)[type] || [];

            if (resources.length) {
                loaders.push({
                    loader: 'sass-resources-loader',
                    options: {
                        resources
                    }
                });
            }
        }

        return loaders;
    }

    static normalizeGlobalStyles(styles) {
        // Backwards compat with existing Vue globalStyles:
        // A string only is supported for sass / scss.
        if (typeof styles !== 'object') {
            styles = {
                sass: styles,
                scss: styles
            };
        }

        return mapValues(styles, files => {
            return Array.wrap(files).map(file => Mix.paths.root(file));
        });
    }
}

module.exports = Css;
