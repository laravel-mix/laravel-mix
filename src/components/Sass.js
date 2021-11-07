let Preprocessor = require('./Preprocessor');

class Sass extends Preprocessor {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        this.requiresReload = true;

        const deps = ['sass-loader@^12.1.0', 'sass'];

        if (Config.processCssUrls) {
            deps.push('resolve-url-loader@^4.0.0');
        }

        return deps;
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
}

module.exports = Sass;
