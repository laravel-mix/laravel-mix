class React {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        return ['@babel/preset-react'];
    }

    register() {
        if (
            arguments.length === 2 &&
            typeof arguments[0] === 'string' &&
            typeof arguments[1] === 'string'
        ) {
            throw new Error(
                'mix.react() is now a feature flag. Use mix.js(source, destination).react() instead'
            );
        }
    }

    /**
     * Babel config to be merged with Mix's defaults.
     */
    babelConfig() {
        return {
            presets: [['@babel/preset-react', { runtime: 'automatic' }]]
        };
    }
}

module.exports = React;
