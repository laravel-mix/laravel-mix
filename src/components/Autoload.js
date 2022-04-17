const { concat } = require('lodash');
const { Component } = require('./Component');

module.exports = class Autoload extends Component {
    /** @type {Record<string, string|string[]>} */
    aliases = {};

    /**
     * Register the component.
     *
     * @param  {Record<string, string | string[]>} libs
     */
    register(libs) {
        for (let [library, aliases] of Object.entries(libs)) {
            const lib = library.includes('.') ? library.split('.') : [library];

            for (const alias of Array.isArray(aliases) ? aliases : [aliases]) {
                this.aliases[alias] = lib;
            }
        }
    }

    /**
     * webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        const { ProvidePlugin } = require('webpack');

        return [new ProvidePlugin(this.aliases)];
    }
};
