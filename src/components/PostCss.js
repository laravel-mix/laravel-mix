let Assert = require('../Assert');
let Preprocessor = require('./Preprocessor');

class PostCss extends Preprocessor {
    /**
     * The API name for the component.
     */
    name() {
        return 'postCss';
    }

    /**
     * Register the component.
     *
     * @param {*} src
     * @param {string} output
     * @param {Array} postCssPlugins
     */
    register(src, output, postCssPlugins = []) {
        Assert.preprocessor('postCss', src, output);

        src = new File(src);

        output = this.normalizeOutput(
            new File(output),
            src.nameWithoutExtension() + '.css'
        );

        this.details = (this.details || []).concat({
            type: 'postCss',
            src,
            output,
            postCssPlugins: [].concat(postCssPlugins)
        });
    }

    /**
     * Override the generated webpack configuration.
     *
     * @param {Object} config
     */
    webpackConfig(config) {
        config.module.rules.find(
            rule => rule.test.toString() === '/\\.css$/'
        ).exclude = this.details.map(postCss => postCss.src.path());
    }
}

module.exports = PostCss;
