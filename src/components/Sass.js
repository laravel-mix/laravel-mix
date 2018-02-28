let Preprocessor = require('./Preprocessor');

class Sass extends Preprocessor {
    register(src, output, pluginOptions = {}) {
        return this.preprocess(
            'sass',
            src,
            output,
            this.pluginOptions(pluginOptions)
        );
    }

    webpackRules() {
        return {
            test: /\.s[ac]ss$/,
            exclude: Config.preprocessors.sass
                ? Config.preprocessors.sass.map(sass => sass.src.path())
                : [],
            loaders: ['style-loader', 'css-loader', 'sass-loader']
        };
    }

    pluginOptions(pluginOptions) {
        return Object.assign(
            {
                precision: 8,
                outputStyle: 'expanded'
            },
            pluginOptions,
            { sourceMap: true }
        );
    }
}

module.exports = Sass;
