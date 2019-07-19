let merge = require('babel-merge');

class BabelConfig {
    /**
     * Generate the appropriate Babel configuration for the build.
     *
     * @param {Object} mixBabelConfig
     * @param {String} babelRcPath
     */
    static generate(mixBabelConfig, babelRcPath) {
        return merge.all(
            [
                BabelConfig.default(),
                new BabelConfig().fetchBabelRc(babelRcPath),
                mixBabelConfig
            ],
            {
                arrayMerge: (destinationArray, sourceArray, options) =>
                    sourceArray
            }
        );
    }

    /**
     * Fetch the user's .babelrc config file, if any.
     *
     * @param {String} path
     */
    fetchBabelRc(path) {
        return File.exists(path) ? JSON.parse(File.find(path).read()) : {};
    }

    /**
     * Fetch the default Babel configuration.
     */
    static default() {
        return {
            cacheDirectory: true,
            presets: [
                [
                    '@babel/preset-env',
                    {
                        modules: false,
                        forceAllTransforms: true
                    }
                ]
            ],
            plugins: [
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-object-rest-spread',
                [
                    '@babel/plugin-transform-runtime',
                    {
                        helpers: false
                    }
                ]
            ]
        };
    }
}

module.exports = BabelConfig;
