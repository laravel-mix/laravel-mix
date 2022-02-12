const { Component } = require('./Component');

/** @typedef {import('../../types/browsersync').Options} BrowserSyncOptions */

module.exports = class BrowserSync extends Component {
    requiresReload = true;

    /** @type {BrowserSyncOptions} */
    userConfig = {};

    /**
     * Required dependencies for the component.
     */
    dependencies() {
        return ['browser-sync', 'browser-sync-webpack-plugin@^2.3.0'];
    }

    /**
     * Register the component.
     *
     * @param {string|BrowserSyncOptions} userConfig
     */
    register(userConfig) {
        this.userConfig =
            typeof userConfig == 'string' ? { proxy: userConfig } : userConfig;
    }

    /**
     * webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        let BrowserSyncPlugin = require('browser-sync-webpack-plugin');

        return [new BrowserSyncPlugin(this.config(), { reload: false })];
    }

    /**
     * The regex used to determine where the Browsersync
     * javascript snippet is injected onto each page.
     */
    regex() {
        return RegExp('(</body>|</pre>)(?!.*(</body>|</pre>))', 'is');
    }

    /**
     * Build the BrowserSync configuration.
     */
    config() {
        let userConfig = this.userConfig;
        let defaultConfig = {
            host: 'localhost',
            port: 3000,
            proxy: 'app.test',
            files: [
                'app/**/*.php',
                'resources/views/**/*.php',
                `${this.context.config.publicPath || 'public'}/**/*.(js|css)`
            ],
            snippetOptions: {
                rule: {
                    match: this.regex(),
                    fn: function (snippet, match) {
                        return snippet + match;
                    }
                }
            }
        };

        if (userConfig && userConfig.server) {
            delete defaultConfig.proxy;
        }

        return Object.assign(defaultConfig, userConfig);
    }
};
