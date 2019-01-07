let JavaScript = require('./JavaScript');

class React extends JavaScript {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        return ['babel-preset-react-app'];
    }

    /**
     * Babel config to be merged with Mix's defaults.
     */
    babelConfig() {
        return {
            presets: ['babel-preset-react-app']
        };
    }
}

module.exports = React;
