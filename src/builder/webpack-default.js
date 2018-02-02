module.exports = function() {
    return {
        context: Mix.paths.root(),

        entry: {},

        output: {},

        module: { rules: [] },

        plugins: [],

        stats: {
            hash: false,
            version: false,
            timings: false,
            children: false,
            errorDetails: false,
            chunks: false,
            modules: false,
            reasons: false,
            source: false,
            publicPath: false
        },

        performance: {
            hints: false
        },

        devtool: Config.sourcemaps,

        devServer: {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            contentBase: path.resolve(Config.publicPath),
            historyApiFallback: true,
            noInfo: true,
            compress: true,
            quiet: true
        }
    };
};
