let Preprocessor = require('./Preprocessor');

class Less extends Preprocessor {
    dependencies() {
        return ['less-loader', 'less'];
    }

    register(src, output, pluginOptions = {}) {
        this.preprocess('less', src, output, pluginOptions);
    }

    webpackRules() {
        let rules = super.webpackRules();

        rules.push({
            test: /\.less$/,
            exclude: this.details.map(less => less.src.path()),
            loaders: ['style-loader', 'css-loader', 'less-loader']
        });

        return rules;
    }
}

module.exports = Less;
