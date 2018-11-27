class Autoload {
    /**
     * Register the component.
     *
     * @param  {Object} libs
     * @return {void}
     */
    register(libs) {
        let aliases = {};

        Object.keys(libs).forEach(library => {
            [].concat(libs[library]).forEach(alias => {
                aliases[alias] = library.includes('.')
                    ? library.split('.')
                    : library;
            });
        });

        this.aliases = aliases;
    }

    /**
     * webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        let webpack = require('webpack');

        return new webpack.ProvidePlugin(this.aliases);
    }
}

module.exports = Autoload;
