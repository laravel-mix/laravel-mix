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
     * Generate the appropriate Babel configuration for the build.
     *
     * @param {BabelOptions} mixBabelConfig
     */
    static generate(mixBabelConfig) {
        return BabelConfig.mergeAll([
            BabelConfig.default(),
            BabelConfig.getUserConfig(mixBabelConfig)
        ]);
    }

    /**
     * Fetch the user's .babelrc config file, if any.
     *
     * @param {BabelOptions} customOptions
     */
    static getUserConfig(customOptions) {
        const config = babel.loadPartialConfig({
            filename: '.babelrc',
            ...customOptions
        });

        return config ? config.options : {};
    }

    /**
     * Merge babel configs
     *
     * @param {BabelOptions[]} configs
     */
    static mergeAll(configs) {
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
     * @param {import("@babel/core").PluginItem[]} items
     * @returns {import("@babel/core").PluginItem[]}
     */
    static filterConfigItems(configItems) {
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

    /**
     * Fetch the default Babel configuration.
     *
     * @returns {BabelOptions}
     */
    static default() {
        return {
            cacheDirectory: true,
            presets: ['@babel/preset-env'],
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
