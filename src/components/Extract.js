let path = require('path');
let File = require('../File');
let { Chunks } = require('../Chunks');

class Extract {
    /**
     * Create a new component instance.
     */
    constructor() {
        this.entry = null;
        this.extractions = [];
        this.chunks = Chunks.instance();
        this.chunks.runtime = true;
    }

    /**
     * The name of the component.
     *
     * mix.extract() or mix.extractVendor()
     */
    name() {
        return ['extract', 'extractVendors'];
    }

    /**
     * Register the component.
     *
     * @param {*} libs
     * @param {string} output
     */
    register(libs = [], output) {
        // If the user provides an output path as the first argument, they probably
        // want to extract all node_module libraries to the specified file.
        if (
            arguments.length === 1 &&
            typeof libs === 'string' &&
            libs.endsWith('.js')
        ) {
            output = libs;
            libs = [];
        }

        this.extractions.push({ libs, output });
    }

    /**
     * Assets to append to the webpack entry.
     *
     * @param {Entry} entry
     */
    webpackEntry(entry) {
        this.entry = entry;
        this.chunks.entry = entry;

        if (!Mix.bundlingJavaScript) {
            throw new Error('You must compile JS to extract vendor code');
        }

        this.extractions.forEach(extraction => {
            extraction.output = this.extractionPath(extraction.output);

            this.addChunk(extraction);
        });
    }

    addChunk(extraction) {
        let pattern = '(?<!node_modules.*)[\\\\/]node_modules[\\\\/]';

        /*
        // The FIXME above means that this code should never fire when extraction.libs
        // is empty. We'll leave this code here in case a better solution comes along
        const libsPattern = extraction.libs.join('|');

        if (libsPattern.length > 0) {
            pattern = `${pattern}(${libsPattern})`;
        }
        */

        this.chunks.add(
            `vendor${this.extractions.indexOf(extraction)}`,
            extraction.output.replace(/\.js$/, ''),
            new RegExp(pattern, 'i'),
            {
                chunks: 'all',
                enforce: true
            }
        );
    }

    extractionPath(outputPath) {
        if (outputPath) {
            return new File(outputPath).normalizedOutputPath();
        }

        return path.join(this.entry.base, 'vendor').replace(/\\/g, '/');
    }
}

module.exports = Extract;
