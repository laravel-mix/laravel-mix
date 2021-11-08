let semver = require('semver');
let { concat, mapValues } = require('lodash');
let { Component } = require('./Component');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let PostCssPluginsFactory = require('../PostCssPluginsFactory');

class CssWebpackConfig extends Component {
    passive = true;

    /** @returns {import('../Dependencies').DependencyObject[]} */
    dependencies() {
        this.requiresReload = true;

        return [
            {
                package: 'postcss@^8.3.1',
                check: name =>
                    semver.satisfies(require(`${name}/package.json`).version, '^8.3.1')
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
                    loader: this.context.resolve('sass-loader'),
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
                    loader: this.context.resolve('sass-loader'),
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
                loader: { loader: this.context.resolve('less-loader') }
            },
            {
                command: 'stylus',
                type: 'stylus',
                test: /\.styl(us)?$/,
                loader: { loader: this.context.resolve('stylus-loader') }
            }
        ].map(rule => this.createRule(rule));
    }

    /**
     * Build up the appropriate loaders for the given rule.
     *
     * @param  {import('webpack').RuleSetRule & {test: RegExp, command: string, type: string}} rule
     * @returns {import('webpack').RuleSetRule}
     */
    createRule(rule) {
        return {
            test: rule.test,
            exclude: this.excludePathsFor(rule.command),
            oneOf: [
                {
                    // Ex: foo.css?module
                    resourceQuery: /module/,
                    use: this.createLoaderList(rule, {
                        mode: 'local',
                        auto: undefined,
                        localIdentName:
                            this.context.config.cssModuleIdentifier || '[hash:base64]'
                    })
                },
                {
                    // Ex: foo.css
                    // Ex: foo.module.css
                    use: this.createLoaderList(rule, {
                        mode: 'local',
                        auto: true,
                        localIdentName:
                            this.context.config.cssModuleIdentifier || '[hash:base64]'
                    })
                }
            ]
        };
    }

    /**
     * Build up the appropriate loaders for the given rule.
     *
     * @param  {import('webpack').RuleSetRule & {test: RegExp, command: string, type: string}} rule
     * @param  {object} useCssModules
     * @returns {any[]}
     */
    createLoaderList(rule, useCssModules) {
        return [
            ...CssWebpackConfig.afterLoaders({
                method: 'auto',
                location: 'default',
                context: this.context
            }),
            {
                loader: this.context.resolve('css-loader'),
                options: {
                    /**
                     * @param {string} url
                     **/
                    url: url => {
                        if (url.startsWith('/')) {
                            return false;
                        }

                        return this.context.config.processCssUrls;
                    },
                    modules: useCssModules
                }
            },
            {
                loader: this.context.resolve('postcss-loader'),
                options: {
                    postcssOptions: {
                        plugins: new PostCssPluginsFactory(this.context).load(),
                        hideNothingWarning: true
                    }
                }
            },
            rule.loader,
            ...CssWebpackConfig.beforeLoaders({
                context: this.context,
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
        let exclusions = this.context.components.get(command);

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
     * @param {object} options
     * @param {import('../Mix')} options.context The method to use when handling CSS.
     * @param {"auto" | "inline" | "extract"} options.method The method to use when handling CSS.
     * @param {"default" | "per-file"} options.location Where these loaders are applied. The `default` set or on a per-file basis (used by preprocessors).
     */
    static afterLoaders({ context, method, location }) {
        const loaders = [];

        if (method === 'auto') {
            // TODO: Fix
            if (context.extractingStyles !== false) {
                method = 'extract';
            } else {
                method = 'inline';
            }
        }

        if (method === 'inline') {
            if (this.wantsVueStyleLoader(context) && location === 'default') {
                loaders.push({ loader: context.resolve('vue-style-loader') });
            } else {
                loaders.push({ loader: context.resolve('style-loader') });
            }
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
     * @private
     * @param {import('../Mix')} context
     **/
    static wantsVueStyleLoader(context) {
        const VueFeature = context.components.get('vue');

        return VueFeature && VueFeature.options && VueFeature.options.useVueStyleLoader;
    }

    /**
     * Gets a list of loaders to run
     *
     * This handles inlining or extraction of CSS based on context.
     * The default is to inline styles
     *
     * @param {object} options
     * @param {import('../Mix')} options.context
     * @param {string} options.type The file type
     * @param {boolean} options.injectGlobalStyles Whether or not to inject global styles
     */
    static beforeLoaders({ context, type, injectGlobalStyles }) {
        const loaders = [];

        if (context.globalStyles && injectGlobalStyles) {
            let resources =
                CssWebpackConfig.normalizeGlobalStyles(context, context.globalStyles)[
                    type
                ] || [];

            if (resources.length) {
                loaders.push({
                    loader: context.resolve('sass-resources-loader'),
                    options: {
                        hoistUseStatements: true,
                        resources
                    }
                });
            }
        }

        return loaders;
    }

    /**
     *
     * @param {import('../Mix')} context
     * @param {string | Record<string, string|string[]>} styles
     */
    static normalizeGlobalStyles(context, styles) {
        // Backwards compat with existing Vue globalStyles:
        // A string only is supported for sass / scss.
        if (typeof styles !== 'object') {
            styles = {
                sass: styles,
                scss: styles
            };
        }

        return mapValues(styles, files => {
            files = concat([], files);

            return files.map(file => context.paths.root(file));
        });
    }
}

module.exports = CssWebpackConfig;
