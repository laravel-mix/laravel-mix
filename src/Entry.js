let Collection = new require('./Collection');
let Verify = require('./Verify');

class Entry {
    /**
     * Create a new Entry instance.
     */
    constructor() {
        this.entry = new Collection;
        this.scripts = [];
        this.extractions = [];
    }


    /**
     * Add a script to the entry.
     *
     * @param {string|array} entry
     * @param {string} output
     */
    addScript(entry, output) {
        Verify.js(entry, output);

        entry = [].concat(entry).map(file => {
            return new File(path.resolve(file)).parsePath();
        });

        output = this.normalizeOutput(output, entry);

        this.entry.add(
            this.entryName(output),
            entry.map(src => src.path)
        );

        this.scripts = this.scripts.concat(entry);
        this.base = output.base.replace(global.options.publicPath, '');

        return this;
    }


    /**
     * Add a stylesheet to the entry.
     *
     * @param {string} src
     * @param {string} output
     */
    addStylesheet(src, output) {
        let name = Object.keys(this.get())[0];

        this.entry.add(name, path.resolve(src));

        return this;
    }


    /**
     * Add a set of vendor extractions to the entry.
     *
     * @param {array} libs
     * @param {string|null} output
     */
    addVendor(libs, output) {
        if (! this.hasScripts() && ! output) {
            throw new Error(
                'Please provide an output path as the second argument to ' +
                'mix.extract(),  or call mix.js() first.'
            );
        }

        let vendorPath = output
            ? output.replace(/\.js$/, '').replace(global.options.publicPath, '')
            : path.join(this.base, 'vendor').replace(/\\/g, '/');

        this.extractions.push(vendorPath);
        this.extractionBase = new File(vendorPath).parsePath().base;

        this.entry.add(vendorPath, libs);

        return this;
    }


    /**
     * Calculate the entry named from the output path.
     *
     * @param {object} output
     */
    entryName(output) {
        if (typeof output === 'string') {
            output = new File(path.resolve(output)).parsePath();
        }

        return output.pathWithoutExt
            .replace(/\\/g, '/')
            .replace(/\.js$/, '')
            .replace(global.options.publicPath + '/', '/');
    }

    /**
     * Normalize the full output path.
     *
     * @param {string} output
     * @param {string|array} entry
     */
    normalizeOutput(output, entry) {
        output = new File(output).parsePath();

        if (output.isDir) {
            output = new File(
                path.join(output.path, entry[0].file)
            ).parsePath();
        }

        return output;
    }


    /**
     * Fetch the Webpack-ready entry object.
     */
    get() {
        if (! this.entry.any()) {
            let file = new File(path.resolve(__dirname, 'mock-entry.js'));

            this.entry.add('mix', file.path());
        }

        return this.entry.get();
    }


    /**
     * Determine if there are any registered vendor extractions.
     */
    hasExtractions() {
        return this.extractions.length > 0;
    }


    /**
     * Fetch the vendor extractions list.
     */
    getExtractions() {
        // We also need to extract webpack's manifest file,
        // so that it doesn't bust the cache.
        return this.extractions.concat(
            path.join(this.extractionBase, 'manifest').replace(/\\/g, '/')
        );
    }

    /**
     * Determine if the requested entry includes script compilation.
     */
    hasScripts() {
        return this.scripts.length > 0;
    }


    /**
     * Fetch the user requested script compilations.
     */
    scripts() {
        return this.scripts;
    }


    /**
     * Reset the entry object.
     */
    reset() {
        return new Entry;
    }
}

module.exports = new Entry;
