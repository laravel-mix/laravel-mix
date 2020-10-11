let webpack = require('webpack');

class WebpackConfig {
    register(config) {
        config = typeof config == 'function' ? config(webpack) : config;

        Config.webpackConfig = require('../builder/MergeWebpackConfig')(
            Config.webpackConfig,
            config
        );

        return this;
    }
}

module.exports = WebpackConfig;
