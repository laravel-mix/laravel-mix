const Assert = require('../Assert');
const File = require('../File');
const Preprocessor = require('./Preprocessor');

module.exports = class PostCss extends Preprocessor {
    /**
     * The Mix API name for the component.
     */
    name() {
        return ['postCss', 'css'];
    }

    /**
     * Register the component.
     *
     * @param {any} src
     * @param {string} output
     * @param {import('postcss').AcceptedPlugin[] | Record<string, any>} pluginOptions
     * @param {import('postcss').AcceptedPlugin[]} postCssPlugins
     */
    register(src, output, pluginOptions = {}, postCssPlugins = []) {
        // Backwards compat with earlier versions of Mix
        if (Array.isArray(pluginOptions) && postCssPlugins.length === 0) {
            postCssPlugins = pluginOptions;
            pluginOptions = {};
        }

        if (!Array.isArray(postCssPlugins)) {
            postCssPlugins = [postCssPlugins];
        }

        Assert.preprocessor('postCss', src, output);

        const srcFile = new File(src);

        const outputFile = this.normalizeOutput(
            new File(output),
            srcFile.nameWithoutExtension() + '.css'
        );

        this.details.push({
            type: 'postCss',
            src: srcFile,
            output: outputFile,
            pluginOptions,
            postCssPlugins
        });

        // Register a split chunk that takes everything generated
        // by this file and puts it in a separate file
        // We use a output-specific chunk name so we don't accidentally merge multiple files
        this._addChunks(
            `styles-${outputFile.relativePathWithoutExtension()}`,
            srcFile,
            outputFile
        );
    }

    /**
     * Override the generated webpack configuration.
     * @param {import('webpack').Configuration} config
     */
    webpackConfig(config) {
        config.module.rules.find(rule => rule.test.toString() === '/\\.p?css$/').exclude =
            this.details.map(postCss => postCss.src.path());
    }
};
