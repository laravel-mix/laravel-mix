let merge = require('../builder/MergeWebpackConfig');

class WebpackConfig {
    register(config) {
        mix.override(webpackConfig => {
            config = typeof config == 'function' ? config(webpackConfig) : config;

            Object.assign(webpackConfig, merge(webpackConfig, config));
        });
    }
}

module.exports = WebpackConfig;
