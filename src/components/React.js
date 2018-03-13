let JavaScript = require('./JavaScript');

class React extends JavaScript {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        return ['babel-preset-react'].concat(super.dependencies());
    }

    /**
     * Babel config to be merged with Mix's defaults.
     */
    babelConfig() {
        return {
            presets: ['react']
        };
    }
}

module.exports = React;
