let concat = require('concat');
let path = require('path');
let fs = require('fs');
let babel = require('@babel/core');
let glob = require('glob');
let Log = require('./Log');
let File = require('./File');

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
        return concat(this.files, output.makeDirectories().path()).then(contents => {
            if (this.shouldCompileWithBabel(wantsBabel, output)) {
                output.write(this.babelify(contents));
            }

            return new File(output.makeDirectories().path());
        });
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
        let babelConfig = this.mix.config.babel();

        delete babelConfig.cacheDirectory;

        return babel.transform(contents, babelConfig).code;
    }

    /**
     * Copy the src files to the given destination.
     *
     * @param {string} destination
     * @param {string|array|null} src
     */
    copyTo(destination, src = this.files) {
        this.assets = this.assets || [];

        this.destination = destination;

        if (Array.isArray(src)) {
            src.forEach(file => this.copyTo(destination, new File(file)));

            return;
        }

        if (src.isDirectory()) {
            src.copyTo(destination.path());

            this.assets = fs.readdirSync(src.path()).map(file => {
                return new File(path.resolve(destination.path(), file));
            });

            return;
        }

        if (src.contains('*')) {
            let files = glob.sync(src.path(), { nodir: true });

            if (!files.length) {
                Log.feedback(`Notice: The ${src.path()} search produced no matches.`);
            }

            return this.copyTo(destination, files);
        }

        if (destination.isDirectory()) {
            destination = destination.append(src.name());
        }

        src.copyTo(destination.path());

        this.assets = this.assets.concat(destination);

        return destination.path();
    }

    get mix() {
        return global.Mix;
    }
}

module.exports = FileCollection;
