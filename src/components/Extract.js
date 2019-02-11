let webpackMerge = require('webpack-merge');

class Extract {
    /**
     * Create a new component instance.
     */
    constructor() {
        this.entry = null;
        this.extractions = [];
    }

    /**
     * The name of the component.
     *
     * mix.extract() or mix.extractVendor()
     */
    name() {
        return ['extract', 'extractVendors'];
    }

    /**
     * Register the component.
     *
     * @param {*} libs
     * @param {string} output
     */
    register(libs = [], output) {
        // If the user provides an output path as the first argument, they probably
        // want to extract all node_module libraries to the specified file.
        if (
            arguments.length === 1 &&
            typeof libs === 'string' &&
            libs.endsWith('.js')
        ) {
            output = libs;
            libs = [];
        }

        this.extractions.push({ libs, output });
    }

    /**
     * Assets to append to the webpack entry.
     *
     * @param {Entry} entry
     */
    webpackEntry(entry) {
        this.entry = entry;

        this.extractions.forEach(extraction => {
            extraction.output = this.extractionPath(extraction.output);

            if (extraction.libs.length) {
                this.entry.addExtraction(extraction);
            }
        });
    }

    webpackConfig(config) {
        const newConfig = webpackMerge.smart(config, this.config());

        config.optimization = newConfig.optimization;
    }

    config() {
        return {
            optimization: {
                // If we are extracting vendor libraries, then we also need
                // to extract Webpack's manifest file to assist with caching.
                runtimeChunk: {
                    name: path
                        .join(this.entry.base, 'manifest')
                        .replace(/\\/g, '/')
                },

                splitChunks: this.createSplitChunks()
            }
        };
    }

    createSplitChunks() {
        let config = { cacheGroups: {} };

        for (const [index, extraction] of this.extractions.entries()) {
            if (extraction.libs.length) {
                config.cacheGroups[`vendor${index}`] = this.createCacheGroup(
                    extraction
                );
            }
        }

        // If the user didn't specify any libraries to extract,
        // they likely want to extract all vendor libraries.
        if (Object.keys(config.cacheGroups).length === 0) {
            config.chunks = 'all';
            config.name = this.extractions[0].output;
        }

        return config;
    }

    createCacheGroup(extraction) {
        const libsPattern = extraction.libs.join('|');
        const pattern = new RegExp(`(?<!node_modules.*)[\\\\/]node_modules[\\\\/](${libsPattern})[\\\\/]`, 'i');

        return {
            test: pattern,
            name: extraction.output,
            chunks: 'all',
            enforce: true
        };
    }

    extractionPath(outputPath) {
        if (outputPath) {
            return new File(outputPath)
                .pathFromPublic(Config.publicPath)
                .replace(/\.js$/, '')
                .replace(/\\/g, '/');
        }

        return path.join(this.entry.base, 'vendor').replace(/\\/g, '/');
    }
}

module.exports = Extract;
