let merge = require('../builder/MergeWebpackConfig');

/** @typedef {import('webpack').Configuration} Configuration */
/** @typedef {import('webpack')} webpack */

class WebpackConfig {
    /**
     *
     * @param {((webpack: webpack, config: Configuration) => Configuration)|Configuration} config
     */
    register(config) {
        global.Mix.api.override(webpackConfig => {
            config = typeof config == 'function' ? config(webpackConfig) : config;

            Object.assign(webpackConfig, merge(webpackConfig, config));
        });
    }
}

module.exports = WebpackConfig;
