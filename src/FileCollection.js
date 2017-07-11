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

        return new File(output.makeDirectories().path());
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
        let babelConfig = Config.babel();

        delete babelConfig.cacheDirectory;

        return babel.transform(
            contents, babelConfig
        ).code;
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
            return src.copyTo(destination.path());
        }

        if (src.contains('*')) {
            let files = glob.sync(src.path(), { nodir: true });

            if (! files.length) {
                console.log(`Notice: The ${src.path()} search produced no matches.`);
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
}

module.exports = FileCollection;
