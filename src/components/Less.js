let Preprocessor = require('./Preprocessor');

class Less extends Preprocessor {
    dependencies() {
        return ['less-loader', 'less'];
    }

    register(src, output, pluginOptions = {}) {
        this.preprocess('less', src, output, pluginOptions);
    }

    webpackRules() {
        return {
            test: /\.less$/,
            exclude: Config.preprocessors.less
                ? Config.preprocessors.less.map(less => less.src.path())
                : [],
            loaders: ['style-loader', 'css-loader', 'less-loader']
        };
    }
}

module.exports = Less;
