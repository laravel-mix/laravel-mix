let Preprocessor = require('./Preprocessor');
let Verify = require('../Verify');

class FastSass extends Preprocessor {
    /**
     * The API name for the component.
     */
    name() {
        return ['fastSass', 'standaloneSass'];
    }

    /**
     * Register the component.
     *
     * @param {*} src
     * @param {string} output
     * @param {Object} pluginOptions
     */
    register(src, output, pluginOptions = {}) {
        Verify.exists(src);

        return this.preprocess('fastSass', src, output, pluginOptions);
    }

    /**
     * webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        let FastSassPlugin = require('../webpackPlugins/FastSassPlugin');

        return (super.webpackPlugins() || []).concat(
            new FastSassPlugin(this.details)
        );
    }
}

module.exports = FastSass;
