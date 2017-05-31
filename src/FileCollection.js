let concatenate = require('concatenate');
let babel = require('babel-core');
let glob = require('glob');

class FileCollection {
    /**
     * Create a new FileCollection instance.
     *
     * @param {Array|string} files
     */
    constructor(files = []) {
        this.files = [].concat(files);
    }


    /**
     * Fetch the underlying files.
     */
    get() {
        return this.files;
    }


    /**
     * Merge all files in the collection into one.
     *
     * @param {object} output
     * @param {object} wantsBabel
     */
    merge(output, wantsBabel = false) {
        let contents = concatenate.sync(
            this.files, output.makeDirectories().path()
        );

        if (this.shouldCompileWithBabel(wantsBabel, output)) {
            output.write(this.babelify(contents));
        }

        return this;
    }


    /**
     * Determine if we should add a Babel pass to the concatenated file.
     *
     * @param {Boolean}  wantsBabel
     * @param {Object}  output
     */
    shouldCompileWithBabel(wantsBabel, output) {
        return wantsBabel && output.extension() === '.js';
    }


    /**
     * Apply Babel to the given contents.
     *
     * @param {string} contents
     */
    babelify(contents) {
        return babel.transform(
            contents, { presets: ['env'] }
        ).code;
    }


    /**
     * Copy the src files to the given destination.
     *
     * @param {string} destination
     * @param {string|array|null} src
     */
    copyTo(destination, src = this.files) {
        this.destination = destination;

        if (Array.isArray(src)) {
            src.forEach(file => this.copyTo(destination, new File(file)));

            return this;
        }

        if (src.contains('*') || src.isDirectory()) {
            if (src.isDirectory()) src = src.append('*');

            return this.copyTo(destination, glob.sync(src.path()));
        }

        if (destination.isDirectory()) {
            destination = destination.append(src.name());
        }

        Mix.addAsset(destination);

        src.copyTo(destination.path());

        return this;
    }
}

module.exports = FileCollection;
