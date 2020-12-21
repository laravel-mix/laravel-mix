let Assert = require('../Assert');
let File = require('../File');
let Preprocessor = require('./Preprocessor');

class PostCss extends Preprocessor {
    /**
     * The Mix API name for the component.
     */
    name() {
        return ['postCss', 'css'];
    }

    /**
     * Register the component.
     *
     * @param {*} src
     * @param {string} output
     * @param {Array|Object} pluginOptions
     * @param {Array} postCssPlugins
     */
    register(src, output, pluginOptions = {}, postCssPlugins = []) {
        // Backwards compat with earlier versions of Mix
        if (Array.isArray(pluginOptions) && postCssPlugins.length === 0) {
            postCssPlugins = pluginOptions;
            pluginOptions = {};
        }

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
            pluginOptions,
            postCssPlugins: [].concat(postCssPlugins)
        });

        // Register a split chunk that takes everything generated
        // by this file and puts it in a separate file
        // We use a output-specific chunk name so we don't accidentally merge multiple files
        this._addChunks(`styles-${output.relativePathWithoutExtension()}`, src, output);
    }

    /**
     * Override the generated webpack configuration.
     *
     * @param {Object} config
     */
    webpackConfig(config) {
        config.module.rules.find(
            rule => rule.test.toString() === '/\\.p?css$/'
        ).exclude = this.details.map(postCss => postCss.src.path());
    }
}

module.exports = PostCss;
