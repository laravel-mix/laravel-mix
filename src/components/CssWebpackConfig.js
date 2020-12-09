let semver = require('semver');
let mapValues = require('lodash').mapValues;
let AutomaticComponent = require('./AutomaticComponent');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let PostCssPluginsFactory = require('../PostCssPluginsFactory');

class CssWebpackConfig extends AutomaticComponent {
    dependencies() {
        this.requiresReload = true;

        return [
            {
                package: 'postcss@^8.1',
                check: postcss => semver.satisfies(postcss().version, '^8.1')
            }
        ];
    }

    /**
     * webpack rules to be appended to the master config.
     */
    webpackRules() {
        return [
            {
                command: 'css',
                type: 'css',
                test: /\.p?css$/
            },
            {
                command: 'sass',
                type: 'scss',
                test: /\.scss$/,
                loader: {
                    loader: 'sass-loader',
                    options: {
                        sassOptions: {
                            precision: 8,
                            outputStyle: 'expanded'
                        }
                    }
                }
            },
            {
                command: 'sass',
                type: 'sass',
                test: /\.sass$/,
                loader: {
                    loader: 'sass-loader',
                    options: {
                        sassOptions: {
                            precision: 8,
                            outputStyle: 'expanded',
                            indentedSyntax: true
                        }
                    }
                }
            },
            {
                command: 'less',
                type: 'less',
                test: /\.less$/,
                loader: { loader: 'less-loader' }
            },
            {
                command: 'stylus',
                type: 'stylus',
                test: /\.styl(us)?$/,
                loader: { loader: 'stylus-loader' }
            }
        ].map(rule => this.createRule(rule));
    }

    /**
     * Build up the appropriate loaders for the given rule.
     *
     * @param  {Object} rule
     * @returns {{test: *, use: *[], exclude: (*[]|[])}}
     */
    createRule(rule) {
        return {
            test: rule.test,
            exclude: this.excludePathsFor(rule.command),
            oneOf: [
                {
                    // Ex: foo.css?module
                    resourceQuery: /module/,
                    use: this.createLoaderList(rule, true)
                },
                {
                    // Ex: foo.css
                    // Ex: foo.module.css
                    use: this.createLoaderList(rule, { auto: true })
                }
            ]
        };
    }

    /**
     * Build up the appropriate loaders for the given rule.
     *
     * @param  {Object} rule
     * @param  {string|boolean} useCssModules
     * @returns {any[]}
     */
    createLoaderList(rule, useCssModules) {
        return [
            ...CssWebpackConfig.afterLoaders(),
            {
                loader: 'css-loader',
                options: {
                    url: Config.processCssUrls,
                    modules: useCssModules
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: new PostCssPluginsFactory({}, Config).load(),
                        hideNothingWarning: true
                    }
                }
            },
            rule.loader,
            ...CssWebpackConfig.beforeLoaders({
                type: rule.type,
                injectGlobalStyles: true
            })
        ].filter(Boolean);
    }

    /**
     * Paths to be excluded from the loader.
     *
     * @param {string} command
     */
    excludePathsFor(command) {
        let exclusions = Mix.components.get(command);

        if (command === 'css' || !exclusions) {
            return [];
        }

        return exclusions.details.map(preprocessor => preprocessor.src.path());
    }

    /**
     * webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        return [
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[name].css'
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
                CssWebpackConfig.normalizeGlobalStyles(Mix.globalStyles)[type] || [];

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

module.exports = CssWebpackConfig;
