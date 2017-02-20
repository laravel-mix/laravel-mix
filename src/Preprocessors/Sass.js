let Preprocessor = require('./Preprocessor');

class Sass extends Preprocessor {
    /**
     * Fetch the Webpack loaders for Sass.
     */
    loaders(sourceMaps) {
        return [
            { loader: 'resolve-url-loader' + (sourceMaps ? '?sourceMap' : '') },
            { loader: 'sass-loader', options: this.sassPluginOptions() }
        ];
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
