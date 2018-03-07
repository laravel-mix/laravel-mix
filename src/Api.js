let Verify = require('./Verify');
let webpack = require('webpack');
let path = require('path');

class Api {
    /**
     * Enable sourcemap support.
     *
     * @param {Boolean} productionToo
     * @param {string}  type
     */
    sourceMaps(productionToo = true, type = 'eval-source-map') {
        if (Mix.inProduction()) {
            type = productionToo ? 'source-map' : false;
        }

        Config.sourcemaps = type;

        return this;
    }

    /**
     * Override the default path to your project's public directory.
     *
     * @param {string} defaultPath
     */
    setPublicPath(defaultPath) {
        Config.publicPath = path.normalize(defaultPath.replace(/\/$/, ''));

        return this;
    }

    /**
     * Set a prefix for all generated asset paths.
     *
     * @param {string} path
     */
    setResourceRoot(path) {
        Config.resourceRoot = path;

        return this;
    }

    /**
     * Merge custom config with the provided webpack.config file.
     *
     * @param {object} config
     */
    webpackConfig(config) {
        config = typeof config == 'function' ? config(webpack) : config;

        Config.webpackConfig = require('webpack-merge').smart(
            Config.webpackConfig,
            config
        );

        return this;
    }

    /**
     * Merge custom Babel config with Mix's default.
     *
     * @param {object} config
     */
    babelConfig(config) {
        Config.babelConfig = config;

        return this;
    }

    /* Set Mix-specific options.
     *
     * @param {object} options
     */
    options(options) {
        Config.merge(options);

        return this;
    }

    /**
     * Register a Webpack build event handler.
     *
     * @param {Function} callback
     */
    then(callback) {
        Mix.listen('build', callback);

        return this;
    }

    /**
     * Helper for determining a production environment.
     */
    inProduction() {
        return Mix.inProduction();
    }
}

module.exports = Api;
