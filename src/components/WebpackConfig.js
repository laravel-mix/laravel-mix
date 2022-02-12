const { Component } = require('./Component');

/** @typedef {import('webpack').Configuration} Configuration */
/** @typedef {import('webpack')} webpack */

module.exports = class WebpackConfig extends Component {
    /**
     *
     * @param {((webpack: webpack, config: Configuration) => Configuration) | Configuration} config
     */
    register(config) {
        const merge = require('../builder/MergeWebpackConfig');
        const webpack = require('webpack');

        this.context.api.override(webpackConfig => {
            config =
                typeof config === 'function' ? config(webpack, webpackConfig) : config;

            Object.assign(webpackConfig, merge(webpackConfig, config));
        });
    }
};
