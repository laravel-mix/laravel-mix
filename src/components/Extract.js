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

        this.extractions.forEach(extraction => {
            extraction.output = this.extractionPath(extraction.output);

            if (extraction.libs.length) {
                this.entry.addExtraction(extraction);
            }

            this.addChunk(extraction);
        });
    }

    addChunk(extraction) {
        const libsPattern = extraction.libs.join('|');

        let pattern = '(?<!node_modules.*)[\\\\/]node_modules[\\\\/]';

        if (libsPattern.length > 0) {
            pattern = `${pattern}(${libsPattern})[\\\\\/]`;
        }

        this.chunks.add(
            `vendor${this.extractions.indexOf(extraction)}`,
            extraction.output.replace(/.js$/, ''),
            new RegExp(pattern, 'i'),
            {
                chunks: 'all',
                enforce: true
            }
        );
    }

    extractionPath(outputPath) {
        if (outputPath) {
            return new File(outputPath)
                .pathFromPublic(Config.publicPath)
                .replace(/\.js$/, '')
                .replace(/\\/g, '/');
        }

        return path.join(this.entry.base, 'vendor').replace(/\\/g, '/');
    }
}

module.exports = Extract;
