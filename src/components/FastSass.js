let Preprocessor = require('./Preprocessor');
let Assert = require('../Assert');

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
        Assert.exists(src);

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
