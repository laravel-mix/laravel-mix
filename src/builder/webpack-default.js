module.exports = function () {
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
            errors: false
        },

        performance: {
            hints: false
        },

        devtool: Config.sourcemaps,

        devServer: {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            historyApiFallback: true,
            noInfo: true,
            compress: true,
            quiet: true
        }
    };
};
