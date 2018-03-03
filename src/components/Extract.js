let webpack = require('webpack');

class Extract {
    constructor() {
        this.extractions = [];
    }

    register(libs, output) {
        this.extractions.push({ libs, output });
    }

    webpackEntry(entry) {
        this.extractions = this.extractions.map(
            entry.addExtraction.bind(entry)
        );

        // If we are extracting vendor libraries, then we also need
        // to extract Webpack's manifest file to assist with caching.
        if (this.extractions.length) {
            this.extractions.push(
                path.join(entry.base, 'manifest').replace(/\\/g, '/')
            );
        }
    }

    webpackPlugins() {
        // If we're extracting any vendor libraries, then we
        // need to add the CommonChunksPlugin to strip out
        // all relevant code into its own file.
        if (this.extractions.length) {
            return new webpack.optimize.CommonsChunkPlugin({
                names: this.extractions,
                minChunks: Infinity
            });
        }
    }
}

module.exports = Extract;
