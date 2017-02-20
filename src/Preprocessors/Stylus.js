let Preprocessor = require('./Preprocessor');

class Stylus extends Preprocessor {
    /**
     * Fetch the Webpack loaders for Stylus.
     */
    loaders(sourceMaps) {
        return [{
            loader: 'stylus-loader' + (sourceMaps ? '?sourceMap' : ''),
            options: this.pluginOptions
        }];
    }
}

module.exports = Stylus;
