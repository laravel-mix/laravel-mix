let File = require('../File');
let Mix = require('../Mix');
let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

class Preprocessor {
    /**
     * Create a new Preprocessor instance.
     *
     * @param {string} src
     * @param {string} output
     * @param {object} pluginOptions
     */
    constructor(src, output, pluginOptions) {
        src = new File(path.resolve(src)).parsePath();
        output = new File(output).parsePath();

        if (output.isDir) {
            output = new File(
                path.join(output.path, src.name + '.css')
            ).parsePath();
        }

        this.src = src;
        this.output = output;
        this.pluginOptions = pluginOptions;
    }


    /**
     * Get the Webpack extract text plugin instance.
     */
    getExtractPlugin() {
        if (! this.extractPlugin) {
            this.extractPlugin = new ExtractTextPlugin(this.outputPath());
        }

        return this.extractPlugin;
    }


    /**
     * Prepare the Webpack rules for the preprocessor.
     */
    rules() {
        return {
            test: this.test(),
            use: this.getExtractPlugin().extract({
                fallback: 'style-loader',
                use: this.defaultLoaders().concat(this.loaders(Mix.sourceMaps))
            })
        };
    }


    /**
     * Get the regular expression test for the Extract plugin.
     */
    test() {
        return new RegExp(this.src.path.replace(/\\/g, '\\\\') + '$');
    }


    /**
     * Fetch the default Webpack loaders.
     */
    defaultLoaders() {
        let sourceMap = Mix.sourcemaps ? '?sourceMap' : '';

        return [
            { loader: (Mix.options.processCssUrls ? 'css-loader' : 'raw-loader') + sourceMap },
            { loader: 'postcss-loader' + sourceMap }
        ];
    }


    /**
     * Determine the appropriate CSS output path.
     *
     * @param {object} output
     */
    outputPath() {
        let regex = new RegExp('^(\.\/)?' + Mix.publicPath);
        let pathVariant = Mix.versioning ? 'hashedPath' : 'path';

        return this.output[pathVariant].replace(regex, '').replace(/\\/g, '/');
    }
}

module.exports = Preprocessor;
