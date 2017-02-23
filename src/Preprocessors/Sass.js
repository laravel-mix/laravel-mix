let Preprocessor = require('./Preprocessor');
let Mix = require('../Mix');

class Sass extends Preprocessor {
    /**
     * Fetch the Webpack loaders for Sass.
     */
    loaders(sourceMaps) {
        let loaders = [
            { loader: 'sass-loader', options: this.sassPluginOptions() }
        ];

        if (Mix.options.processCssUrls) {
            loaders.unshift(
                { loader: 'resolve-url-loader' + (sourceMaps ? '?sourceMap' : '') }
            );
        }

        return loaders;
    }


    /**
     * Fetch the Node-Sass-specififc plugin options.
     */
    sassPluginOptions() {
        return Object.assign({
            precision: 8,
            outputStyle: 'expanded'
        }, this.pluginOptions, { sourceMap: true })
    }
}

module.exports = Sass;
