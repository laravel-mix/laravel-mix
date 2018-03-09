let Preprocessor = require('./Preprocessor');

class Less extends Preprocessor {
    dependencies() {
        return ['less-loader', 'less'];
    }

    register(src, output, pluginOptions = {}) {
        this.preprocess('less', src, output, pluginOptions);
    }
}

module.exports = Less;
