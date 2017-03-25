let Verify = require('./Verify');

class Scripts {
    /**
     * Create a new Scripts instance.
     */
    constructor() {
        this.scripts = [];
        this.base = '';
    }


    /**
     * Add a new compile request to the collection.
     *
     * @param {string|array} entry
     * @param {output} output
     */
    add(entry, output) {
        Verify.js(entry, output);

        entry = [].concat(entry).map(file => {
            return new File(path.resolve(file)).parsePath();
        });

        output = this.normalizeOutput(output, entry);

        this.scripts.push({ entry, output });

        this.base = output.base.replace(global.options.publicPath, '');
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
     * Determine if their are any registered scripts.
     */
    any() {
        return this.scripts.length > 0;
    }


    /**
     * Fetch the underlying scripts collection.
     */
    get() {
        return this.scripts;
    }


    /**
     * Reset all registered scripts.
     */
    reset() {
        this.scripts = [];

        return this;
    }


    /**
     * Iterate over all registered scripts.
     *
     * @param {Function} callback
     */
    forEach(callback) {
        return this.scripts.forEach(callback);
    }
}

module.exports = Scripts;
