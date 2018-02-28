let Verify = require('../Verify');

class Preprocessor {
    /**
     * Register a generic CSS preprocessor.
     *
     * @param {string} type
     * @param {string} src
     * @param {string} output
     * @param {object} pluginOptions
     */
    preprocess(type, src, output, pluginOptions = {}) {
        Verify.preprocessor(type, src, output);

        src = new File(src);

        output = this.normalizeOutput(
            new File(output),
            src.nameWithoutExtension() + '.css'
        );

        Config.preprocessors[type] = (Config.preprocessors[type] || []).concat({
            src,
            output,
            pluginOptions
        });

        if (type === 'fastSass') {
            Mix.addAsset(output);
        }

        return this;
    }

    /**
     * Generate a full output path, using a fallback
     * file name, if a directory is provided.
     *
     * @param {Object} output
     * @param {Object} fallbackName
     */
    normalizeOutput(output, fallbackName) {
        if (output.isDirectory()) {
            output = new File(path.join(output.filePath, fallbackName));
        }

        return output;
    }
}

module.exports = Preprocessor;
