let Mix = require('../Mix');
let path = require('path');
let WebpackExtractPlugin = require('extract-text-webpack-plugin')

class ExtractTextPluginFactory {
    /**
     * Create a new class instance.
     *
     * @param {string|boolean} cssPath
     */
    constructor(cssPath) {
        if (typeof cssPath === 'boolean') {
            cssPath = path.join(Mix.js.base, 'vue-styles.css');

            this.useDefault = true;
        }

        this.path = cssPath;
    }


    /**
     * Build up the necessary ExtractTextPlugin instance.
     */
    build() {
        if (Mix.preprocessors) {
            // If no output path is provided, we can use the default plugin.
            if (this.useDefault) return Mix.preprocessors[0].getExtractPlugin();

            // If what the user passed matches the output to mix.preprocessor(),
            // then we can use that plugin instead and append to it.
            if (this.pluginIsAlreadyBuilt()) return this.getPlugin();
        }

        // Otherwise, we'll setup a new plugin to toss the styles into it.
        return new WebpackExtractPlugin(this.outputPath());
    }


    /**
     * Check if the the provided path is already registered as an extract instance.
     */
    pluginIsAlreadyBuilt() {
        return Mix.preprocessors.find(
            preprocessor => preprocessor.output.path === this.path
        );
    }


    /**
     * Fetch the Extract plugin instance that matches the current output path.
     */
    getPlugin() {
        return Mix.preprocessors.find(
            preprocessor => preprocessor.getExtractPlugin().filename === this.outputPath()
        ).getExtractPlugin();
    }


    /**
     * Prepare the appropriate output path.
     */
    outputPath() {
        let segments = new Mix.File(this.path).parsePath();

        let regex = new RegExp('^(\.\/)?' + Mix.publicPath);
        let pathVariant = Mix.versioning ? 'hashedPath' : 'path';

        return segments[pathVariant].replace(regex, '').replace(/\\/g, '/');
    }
}

module.exports = ExtractTextPluginFactory;
