let Preprocessor = require('./Preprocessor');

class Stylus extends Preprocessor {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        return ['stylus-loader', 'stylus'];
    }

    /**
     * Register the component.
     *
     * @param {*} src
     * @param {string} output
     * @param {Object} pluginOptions
     */
    register(src, output, pluginOptions = {}) {
        return this.preprocess('stylus', src, output, pluginOptions);
    }
}

module.exports = Stylus;
