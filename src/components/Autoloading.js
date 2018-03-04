class Autoloading {
    name() {
        return 'autoload';
    }

    register(libs) {
        let aliases = {};

        Object.keys(libs).forEach(library => {
            [].concat(libs[library]).forEach(alias => {
                aliases[alias] = library;
            });
        });

        this.aliases = aliases;
    }

    webpackPlugins() {
        let webpack = require('webpack');

        return new webpack.ProvidePlugin(this.aliases);
    }
}

module.exports = Autoloading;
