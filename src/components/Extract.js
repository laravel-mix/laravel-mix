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

            // FIXME: This is not ideal
            // The webpack docs state that entries should not be used for vendor extraction
            // However if there are no uses of a library then they will not be extracted
            // Is there a better way to handle this?
            if (extraction.libs.length) {
                this.entry.addExtraction(extraction);
            } else {
                this.addChunk(extraction);
            }
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
