const Preprocessor = require('./Preprocessor');

module.exports = class Sass extends Preprocessor {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        return [];
    }

    /**
     * Register the component.
     *
     * @param {any} src
     * @param {string} output
     * @param {Record<string, any>} pluginOptions
     * @param {import('postcss').AcceptedPlugin[]}  postCssPlugins
     */
    register(src, output, pluginOptions = {}, postCssPlugins = []) {
        return this.preprocess(
            'sass',
            src,
            output,
            this.pluginOptions(pluginOptions),
            postCssPlugins
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
                api: 'modern-compiler',
                implementation: require('sass-embedded'),
                sassOptions: {
                    precision: 8,
                    outputStyle: 'expanded'
                }
            },
            pluginOptions,
            { sourceMap: true }
        );
    }

    chunkRegex() {
        return /\.(css|s[ac]ss)$/;
    }
};
