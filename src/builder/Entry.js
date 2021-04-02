let path = require('path');
let File = require('../File');

class Entry {
    /**
     * Create a new Entry instance.
     * @param {import("../Mix")} mix
     */
    constructor(mix) {
        // TODO: Simplify in Mix 7 -- Here for backwards compat if a plugin creates this class directly
        this.mix = mix || global.Mix;

        /** @type {Record<string, string[]>} */
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
     * @param {any}  val
     */
    add(key, val) {
        this.structure[key] = (this.structure[key] || []).concat(val);

        return this;
    }

    /**
     * Add a new key-val pair, based on a given output path.
     *
     * @param {any}  val
     * @param {Object} output
     * @param {Object} fallback
     */
    addFromOutput(val, output, fallback) {
        output = this.normalizePath(output, fallback);

        return this.add(this.createName(output), val);
    }

    /**
     * Add a default entry script to the structure.
     */
    addDefault() {
        this.add('mix', new File(path.resolve(__dirname, 'mock-entry.js')).path());
    }

    hasDefault() {
        return (this.structure.mix || []).some(path => path.includes('mock-entry.js'));
    }

    /**
     * Build the proper entry name, based on a given output.
     *
     * @param {Object} output
     */
    createName(output) {
        let name = output
            .pathFromPublic(this.mix.config.publicPath)
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
        let pathFromPublicDir = output.pathFromPublic();
        if (
            !pathFromPublicDir.startsWith('/' + this.mix.config.publicPath) &&
            !pathFromPublicDir.startsWith('\\' + this.mix.config.publicPath)
        ) {
            output = new File(
                path.join(this.mix.config.publicPath, output.pathFromPublic())
            );
        }

        // If the output points to a directory, we'll grab a file name from the fallback src.
        if (output.isDirectory()) {
            output = new File(
                path.join(output.filePath, fallback.nameWithoutExtension() + '.js')
            );
        }

        return output;
    }
}

module.exports = Entry;
