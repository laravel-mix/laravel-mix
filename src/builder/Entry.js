class Entry {
    /**
     * Create a new Entry instance.
     */
    constructor() {
        this.structure = {};
        this.base = '';
    }

    /**
     * Fetch the underlying entry structure.
     */
    get() {
        return this.structure;
    }

    /**
     * Get the object keys for the structure.
     */
    keys() {
        return Object.keys(this.structure);
    }

    /**
     * Add a key key-val pair to the structure.
     *
     * @param {string} key
     * @param {mixed}  val
     */
    add(key, val) {
        this.structure[key] = (this.structure[key] || []).concat(val);

        return this;
    }

    /**
     * Add a new key-val pair, based on a given output path.
     *
     * @param {mixed}  val
     * @param {Object} output
     * @param {Object} fallback
     */
    addFromOutput(val, output, fallback) {
        output = this.normalizePath(output, fallback);

        return this.add(this.createName(output), val);
    }

    /**
     * Add a vendor extraction.
     *
     * @param {Object} extraction
     */
    addExtraction(extraction) {
        if (!Mix.bundlingJavaScript && !extraction.output) {
            throw new Error(
                'Please provide an output path as the second argument to mix.extract().'
            );
        }

        let vendorPath = extraction.output
            ? new File(extraction.output)
                  .pathFromPublic(Config.publicPath)
                  .replace(/\.js$/, '')
                  .replace(/\\/g, '/')
            : path.join(this.base, 'vendor').replace(/\\/g, '/');

        this.add(vendorPath, extraction.libs);

        return vendorPath;
    }

    /**
     * Add a default entry script to the structure.
     */
    addDefault() {
        this.add(
            'mix',
            new File(path.resolve(__dirname, 'mock-entry.js')).path()
        );
    }

    /**
     * Build the proper entry name, based on a given output.
     *
     * @param {Object} output
     */
    createName(output) {
        let name = output
            .pathFromPublic(Config.publicPath)
            .replace(/\.js$/, '')
            .replace(/\\/g, '/');

        this.base = path.parse(name).dir;

        return name;
    }

    /**
     * Normalize the given output path.
     *
     * @param {Object} output
     * @param {Object} fallback
     */
    normalizePath(output, fallback) {
        // All output paths need to start at the project's public dir.
        if (!output.pathFromPublic().startsWith('/' + Config.publicPath)) {
            output = new File(
                path.join(Config.publicPath, output.pathFromPublic())
            );
        }

        // If the output points to a directory, we'll grab a file name from the fallback src.
        if (output.isDirectory()) {
            output = new File(
                path.join(
                    output.filePath,
                    fallback.nameWithoutExtension() + '.js'
                )
            );
        }

        return output;
    }
}

module.exports = Entry;
