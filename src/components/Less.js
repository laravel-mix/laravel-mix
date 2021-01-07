let Preprocessor = require('./Preprocessor');

class Less extends Preprocessor {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        return ['less-loader', 'less'];
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
        return this.preprocess('less', src, output, pluginOptions, postCssPlugins);
    }

    chunkRegex() {
        return /\.(css|less)$/;
    }
}

module.exports = Less;
