let Preprocessor = require('./Preprocessor');

class Less extends Preprocessor {
    /**
     * Fetch the Webpack loaders for Less.
     */
    loaders(sourceMaps) {
        return [{
            loader: 'less-loader' + (sourceMaps ? '?sourceMap' : ''),
            options: this.pluginOptions
        }];
    }
}

module.exports = Less;
