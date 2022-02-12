const { Component } = require('./Component');

/** @typedef {undefined | null | string | number | bigint | boolean} CodeValuePrimitive */
/** @typedef {() => CodeValuePrimitive} LazyCodeValue */
/** @typedef {CodeValuePrimitive | LazyCodeValue} CodeValue */

module.exports = class Define extends Component {
    /**
     * @type {Record<string, CodeValue>}
     * @internal
     **/
    definitions = {};

    /**
     *
     * @param {Record<string, CodeValue>} definitions
     */
    register(definitions) {
        this.definitions = {
            ...this.definitions,
            ...definitions
        };
    }

    /** @internal */
    get defaults() {
        return {
            'import.meta.env.PROD': () => this.context.api.inProduction(),
            'import.meta.env.DEV': () => !this.context.api.inProduction()
        };
    }

    /**
     * @param {Record<string, CodeValue>} definitions
     */
    resolve(definitions) {
        for (const [key, value] of Object.entries(definitions)) {
            if (typeof value === 'function') {
                definitions[key] = value();
            }
        }

        return definitions;
    }

    webpackPlugins() {
        const { DefinePlugin } = require('webpack');

        return [
            new DefinePlugin(
                this.resolve({
                    ...this.defaults,
                    ...this.definitions
                })
            )
        ];
    }
};
