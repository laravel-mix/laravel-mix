const { concat } = require('lodash');
const { Component } = require('./Component');

module.exports = class Autoload extends Component {
    /** @type {Record<string, string|string[]>} */
    aliases = {};

    /**
     * Register the component.
     *
     * @param  {Record<string, string>} libs
     * @return {void}
     */
    register(libs) {
        Object.keys(libs).forEach(library => {
            concat([], libs[library]).forEach(alias => {
                this.aliases[alias] = library.includes('.')
                    ? library.split('.')
                    : library;
            });
        });
    }

    /**
     * webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        const { ProvidePlugin } = require('webpack');

        return [new ProvidePlugin(this.aliases)];
    }
};
