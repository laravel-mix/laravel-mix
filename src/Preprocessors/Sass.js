let Preprocessor = require('./Preprocessor');

class Sass extends Preprocessor {
    /**
     * Fetch the Webpack loaders for Sass.
     */
    loaders(sourceMaps) {
        let loaders = [
            { loader: 'sass-loader', options: this.sassPluginOptions(sourceMaps) }
        ];

        if (global.options.processCssUrls) {
            loaders.unshift(
                { loader: 'resolve-url-loader' + (sourceMaps ? '?sourceMap' : '') }
            );
        }

        return loaders;
    }


    /**
     * Fetch the Node-Sass-specififc plugin options.
     */
    sassPluginOptions(sourceMaps) {
        return Object.assign({
            precision: 8,
            outputStyle: 'expanded'
        }, this.pluginOptions, { sourceMap: sourceMaps })
    }
}

module.exports = Sass;
