const semver = require('semver');
let { Chunks } = require('../Chunks');

class React {
    /**
     * Create a new component instance.
     */
    constructor() {
        this.chunks = Chunks.instance();
    }

    /**
     * Required dependencies for the component.
     */
    dependencies() {
        const dependencies = ['@babel/preset-react'];

        if (this.supportsFastRefreshing()) {
            return dependencies.concat([
                {
                    package: '@pmmmwh/react-refresh-webpack-plugin@^0.5.0-rc.0',
                    check: name =>
                        semver.satisfies(
                            require(`${name}/package.json`).version,
                            '^0.5.0-rc.0'
                        )
                },
                'react-refresh'
            ]);
        }

        return dependencies;
    }

    /**
     * Register the component.
     *
     * @param {object} options
     * @param {boolean|string} [options.extractStyles] Whether or not to extract React styles. If given a string the name of the file to extract to.
     */
    register(options = {}) {
        if (
            arguments.length === 2 &&
            typeof arguments[0] === 'string' &&
            typeof arguments[1] === 'string'
        ) {
            throw new Error(
                'mix.react() is now a feature flag. Use mix.js(source, destination).react() instead'
            );
        }

        this.options = Object.assign(
            {
                extractStyles: false,
                localIdentName: '[name]_[local]__[hash:base64:5]'
            },
            options
        );

        Mix.extractingStyles = !!this.options.extractStyles;
    }

    /**
     * webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        if (!this.supportsFastRefreshing()) {
            return [];
        }

        const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

        return new ReactRefreshPlugin({ overlay: { sockPath: 'ws' } });
    }

    /**
     * Babel config to be merged with Mix's defaults.
     */
    babelConfig() {
        const plugins = this.supportsFastRefreshing()
            ? [Mix.resolve('react-refresh/babel')]
            : [];

        return {
            presets: [['@babel/preset-react', { runtime: 'automatic' }]],
            plugins
        };
    }

    /**
     * Determine if the React version supports fast refreshing.
     */
    supportsFastRefreshing() {
        return Mix.isHot() && semver.satisfies(this.library().version, '>=16.9.0');
    }

    /**
     * Load the currently installed React library.
     */
    library() {
        return require('react');
    }

    /**
     * Update CSS chunks to extract React styles
     */
    updateChunks() {
        if (this.options.extractStyles === false) {
            return;
        }

        this.chunks.add(
            'styles-js',
            this.styleChunkName(),
            [/.(j|t)s$/, module => module.type === 'css/mini-extract'],
            {
                chunks: 'all',
                enforce: true,
                type: 'css/mini-extract'
            }
        );

        this.chunks.add(
            'styles-jsx',
            this.styleChunkName(),
            [/.(j|t)sx?$/, module => module.type === 'css/mini-extract'],
            {
                chunks: 'all',
                enforce: true,
                type: 'css/mini-extract'
            }
        );
    }
    
    /**
     * Override the generated webpack configuration.
     *
     * @param {Object} config
     */
    webpackConfig(config) {
        // Loop through all rules
        config.module.rules = config.module.rules.map((rule) => {
            if (!rule.use && !rule.oneOf) {
                return rule;
            }

            // Loop through all loaders on regular use options
            rule.use = Array.isArray(rule.use) ? rule.use.map(this.replaceLoaderOptions) : rule.use;

            // Alternatively, loop through all of the oneOf options (if they exist)
            rule.oneOf = Array.isArray(rule.oneOf)
                // And then replace all the loaders on each individual option
                ? rule.oneOf.map(oneOf => {
                    oneOf.use = oneOf.use.map(this.replaceLoaderOptions);
                    return oneOf;
                })
                : rule.oneOf;

            return rule;
        });

        this.updateChunks();

        return config;
    }

    /**
     * This function replaces the loader options for any css-loader rules that are
     * found in the webpack config.
     * @param {*} rule
     */
    replaceLoaderOptions = (rule) => {
        // If the loader is not the css-loader, we can safely skip it
        if (rule.loader.indexOf('/css-loader/') === -1 && rule.loader !== 'css-loader' && rule !== "css-loader") {
            return rule;
        }

        if (!rule?.options?.modules)
            return rule;

        // Add our options to the loader
        let options = {
            ...(rule?.options ?? {}),
            modules: {
                ...(rule?.options?.modules ?? {}),
                mode: "local",
                localIdentName: this.options.localIdentName,
            },
        };

        // Convert string syntax to object syntax if neccessary
        rule =
            typeof rule === "string"
                ? {
                    rule,
                }
                : rule;

        // Inject our options into the loader
        rule.options = rule.options
            ? Object.assign({}, rule.options, options)
            : options;

        return rule;
    }

    /**
     * Get the name of the style chunk.
     *
     * @returns {string}
     */
    styleChunkName() {
        // If the user set extractStyles: true, we'll try
        // to append the React styles to an existing CSS chunk.
        if (this.options.extractStyles === true) {
            let chunk = this.chunks.find((chunk, id) => id.startsWith('styles-'));

            if (chunk) {
                return chunk.name;
            }
        }

        return this.extractFile().relativePathWithoutExtension();
    }

    /**
     * Get a new File instance for the extracted file.
     *
     * @returns {File}
     */
    extractFile() {
        return new File(this.extractFileName());
    }

    /**
     * Determine the extract file name.
     *
     * @return {string}
     */
    extractFileName() {
        let fileName =
            typeof this.options.extractStyles === 'string'
                ? this.options.extractStyles
                : '/css/app-styles.css';

        return fileName.replace(Config.publicPath, '').replace(/^\//, '');
    }
}

module.exports = React;
