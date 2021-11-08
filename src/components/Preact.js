const { Component } = require('./Component');

module.exports = class Preact extends Component {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        return ['babel-preset-preact'];
    }

    register() {
        if (
            arguments.length === 2 &&
            typeof arguments[0] === 'string' &&
            typeof arguments[1] === 'string'
        ) {
            throw new Error(
                'mix.preact() is now a feature flag. Use mix.js(source, destination).preact() instead'
            );
        }
    }

    /**
     * Babel config to be merged with Mix's defaults.
     */
    babelConfig() {
        return {
            presets: ['preact']
        };
    }
};
