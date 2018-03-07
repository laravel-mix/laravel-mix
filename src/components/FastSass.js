let Preprocessor = require('./Preprocessor');
let Verify = require('../Verify');

class FastSass extends Preprocessor {
    name() {
        return ['fastSass', 'standaloneSass'];
    }

    register(src, output, pluginOptions = {}) {
        Verify.exists(src);

        return this.preprocess('fastSass', src, output, pluginOptions);
    }

    webpackPlugins() {
        let FastSassPlugin = require('../webpackPlugins/FastSassPlugin');

        return (super.webpackPlugins() || []).concat(
            new FastSassPlugin(this.details)
        );
    }
}

module.exports = FastSass;
