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

        // We'll try to copy the given file to the new destination...
        try {
            src.copyTo(destination.path());
        }

        // However, if there was an issue or file not found, we'll take
        // one more pass and try to copy the hashed version of the file
        // instead.
        catch (e) {
            try {
                // Try to find a hashed version of the src file in the manifest.
                src = new File(Mix.manifest.get(src.pathFromPublic()));

                // Then update the destination to reflect the already hashed file name.
                destination = new File(destination.base()).append(src.name());

                src.copyTo(destination.path());
            } catch (e) {
                return false;
            }

            Mix.manifest.add(destination.pathFromPublic()).refresh();
        }

        // We'll finally add this newly copied file to our custom
        // assets list, so that it can be optionally versioned,
        // and listed in the mix-manifest.json file.
        Mix.addAsset(destination);

        return destination.path();
    }
}

module.exports = FileCollection;
