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
     */
    register(src, output, pluginOptions = {}) {
        this.preprocess('less', src, output, pluginOptions);
    }
}

module.exports = Less;
