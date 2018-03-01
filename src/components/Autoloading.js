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

        Config.autoload = aliases;

        return this;
    }

    webpackPlugins() {
        let webpack = require('webpack');

        return new webpack.ProvidePlugin(Config.autoload);
    }
}

module.exports = Autoloading;
