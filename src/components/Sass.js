let Preprocessor = require('./Preprocessor');

class Sass extends Preprocessor {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        return ['node-sass@4.*', 'sass-loader@7.*'];
    }

    /**
     * Register the component.
     *
     * @param {*} src
     * @param {string} output
     * @param {Object} pluginOptions
     */
    register(src, output, pluginOptions = {}) {
        return this.preprocess(
            'sass',
            src,
            output,
            this.pluginOptions(pluginOptions)
        );
    }

    /**
     * Build the plugin options for sass-loader.
     *
     * @param {Object} pluginOptions
     * @returns {Object}
     */
    pluginOptions(pluginOptions) {
        return Object.assign(
            {
                precision: 8,
                outputStyle: 'expanded'
            },
            pluginOptions,
            { sourceMap: true }
        );
    }
}

module.exports = Sass;
