let concat = require('concat');
let path = require('path');
let fs = require('fs');
let babel = require('@babel/core');
let glob = require('glob');
let _ = require('lodash');
let Log = require('./Log');
let File = require('./File');

class FileCollection {
    /**
     * Create a new FileCollection instance.
     *
     * @param {string|string[]} files
     */
    constructor(files = []) {
        /** @type {string[]} */
        this.files = _.concat([], files);
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
     * @param {File} output
     * @param {boolean} wantsBabel
     */
    async merge(output, wantsBabel = false) {
        /** @type {string} */
        // @ts-ignore
        const contents = await concat(this.files, output.makeDirectories().path());

        if (this.shouldCompileWithBabel(wantsBabel, output)) {
            const code = this.babelify(contents);

            if (code) {
                output.write(code);
            }
        }

        return new File(output.makeDirectories().path());
    }

    /**
     * Determine if we should add a Babel pass to the concatenated file.
     *
     * @param {Boolean} wantsBabel
     * @param {File} output
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

        const result = babel.transform(contents, babelConfig);

        return result && result.code;
    }

    /**
     * Copy the src files to the given destination.
     *
     * @param {File} destination
     * @param {string[]|File} [src]
     * @return {void|string}
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
