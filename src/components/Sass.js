let Preprocessor = require('./Preprocessor');

class Sass extends Preprocessor {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        this.requiresReload = true;

        return tap(['sass-loader@8.*', 'sass'], dependencies => {
            if (Config.processCssUrls) {
                dependencies.push('resolve-url-loader@3.1.0');
            }
        });
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
