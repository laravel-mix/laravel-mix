const babel = require('@babel/core');

/**
 * @typedef {string|string[]} BabelTargetsBrowserslist
 * @typedef {Record<string,string> & {browsers: BabelTargetsBrowserslist}} BabelTargetsPerEngine
 * @typedef {BabelTargetsBrowserslist | BabelTargetsPerEngine} BabelTargets
 */

/**
 * @typedef {object} AdditionalBabelOptions
 * @property {boolean} [cacheDirectory]
 * @property {BabelTargets} [targets]
 */

/** @typedef {import("@babel/core").TransformOptions & AdditionalBabelOptions} BabelOptions */

class BabelConfig {
    /**
     *
     * @param {import("./Mix")} mix
     */
    constructor(mix) {
        this.mix = mix || global.Mix;
    }

    /**
     * Generate the appropriate Babel configuration for the build.
     *
     * @param {BabelOptions} mixBabelConfig
     * @deprecated
     */
    static generate() {
        return new BabelConfig().generate();
    }

    /**
     * Generate the appropriate Babel configuration for the build.
     *
     * @param {BabelOptions} mixBabelConfig
     */
    generate() {
        return this.mergeAll([
            this.default(),
            this.getCustomConfig(this.mix.config.babelConfig),
            {
                root: this.mix.paths.root(),
                babelrc: true,
                configFile: true,
                babelrcRoots: ['.', this.mix.paths.root()]
            }
        ]);
    }

    /**
     * Fetch the user's .babelrc config file, if any.
     *
     * @deprecated
     */
    fetchBabelRc(path) {
        return File.exists(path) ? JSON.parse(File.find(path).read()) : {};
    }

    /**
     * Get the babel config setup when using mix.babelConfig()
     *
     * @internal
     * @param {import('@babel/core').TransformOptions} customOptions
     */
    getCustomConfig(customOptions) {
        const config = babel.loadPartialConfig(customOptions);

        return config ? config.options : {};
    }

    /**
     * Merge babel configs
     *
     * @param {BabelOptions[]} configs
     */
    mergeAll(configs) {
        const options = configs.reduce((prev, current) => {
            const presets = [
                ...(prev.presets || []),
                ...(current.presets || [])
            ].map(preset => babel.createConfigItem(preset, { type: 'preset' }));

            const plugins = [
                ...(prev.plugins || []),
                ...(current.plugins || [])
            ].map(preset => babel.createConfigItem(preset, { type: 'plugin' }));

            return Object.assign(prev, current, { presets, plugins });
        });

        options.plugins = this.filterConfigItems(options.plugins || []);
        options.presets = this.filterConfigItems(options.presets || []);

        return options;
    }

    /**
     * Filter merged presets or plugins
     *
     * @internal
     * @param {import("@babel/core").PluginItem[]} items
     * @returns {import("@babel/core").PluginItem[]}
     */
    filterConfigItems(configItems) {
        return configItems.reduce((unique, configItem) => {
            if (configItem.file != null) {
                const toDeleteIndex = unique.findIndex(
                    element =>
                        element.file && element.file.resolved === configItem.file.resolved
                );

                if (toDeleteIndex >= 0) {
                    unique.splice(toDeleteIndex, 1);
                }
            }

            return [...unique, configItem];
        }, []);
    }

    /** @deprecated */
    static default() {
        return new BabelConfig().default();
    }

    /**
     * Fetch the default Babel configuration.
     *
     * @internal
     * @returns {BabelOptions}
     */
    default() {
        return {
            cacheDirectory: true,
            presets: [
                ['@babel/preset-env', { modules: false, forceAllTransforms: true }]
            ],
            plugins: [
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-object-rest-spread',
                [
                    '@babel/plugin-transform-runtime',
                    {
                        helpers: false
                    }
                ]
            ]
        };
    }
}

module.exports = BabelConfig;
