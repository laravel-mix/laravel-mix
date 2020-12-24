let Preprocessor = require('./Preprocessor');

class Stylus extends Preprocessor {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        return ['stylus', 'stylus-loader'];
    }

    /**
     * Register the component.
     *
     * @param {*} src
     * @param {string} output
     * @param {Object} pluginOptions
     * @param {Array}  postCssPlugins
     */
    register(src, output, pluginOptions = {}, postCssPlugins = []) {
        return this.preprocess('stylus', src, output, pluginOptions, postCssPlugins);
    }

    chunkRegex() {
        return /\.(css|styl(us)?)$/;
    }
}

module.exports = Stylus;
