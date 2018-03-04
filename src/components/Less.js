let Preprocessor = require('./Preprocessor');

class Less extends Preprocessor {
    dependencies() {
        return ['less-loader', 'less'];
    }

    register(src, output, pluginOptions = {}) {
        this.preprocess('less', src, output, pluginOptions);
    }

    webpackRules() {
        return super.webpackRules().concat({
            test: /\.less$/,
            exclude: this.details.map(less => less.src.path()),
            loaders: ['style-loader', 'css-loader', 'less-loader']
        });
    }
}

module.exports = Less;
