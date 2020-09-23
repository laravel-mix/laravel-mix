class Preact {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        return ['babel-preset-preact'];
    }

    /**
     * Babel config to be merged with Mix's defaults.
     */
    babelConfig() {
        return {
            presets: ['preact']
        };
    }
}

module.exports = Preact;
