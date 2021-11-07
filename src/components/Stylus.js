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
     * @param {any} src
     * @param {string} output
     * @param {Record<string, any>} pluginOptions
     * @param {import('postcss').AcceptedPlugin[]}  postCssPlugins
     */
    register(src, output, pluginOptions = {}, postCssPlugins = []) {
        return this.preprocess('stylus', src, output, pluginOptions, postCssPlugins);
    }

    chunkRegex() {
        return /\.(css|styl(us)?)$/;
    }
}

module.exports = Stylus;
