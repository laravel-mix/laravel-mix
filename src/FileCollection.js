let concat = require('concat');
let path = require('path');
let fs = require('fs-extra');
let babel = require('@babel/core');
let glob = require('glob');
let _ = require('lodash');
let { promisify } = require('util');
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
     *
     * @param {string|File|(string|File)[]} src
     */
    async normalizeSourceFiles(src) {
        // 1. Always work with an array of sources
        let sources = Array.isArray(src) ? src : [src]

        // 2. Ensure we're working with File objects
        let files = sources.map(file => {
            return typeof file === 'string'
                ? new File(file)
                : file
        })

        let globAsync = promisify(glob)

        // 3. Expand globs
        let groups = await Promise.all(files.map(async file => {
            if (! file.contains('*')) {
                return [file]
            }

            let files = await globAsync(file.path(), { nodir: true });

            if (!files.length) {
                Log.feedback(`Notice: The ${file.path()} search produced no matches.`);
            }

            return files.map(filepath => new File(filepath))
        }))

        return groups.flat()
    }

    /**
     * Copy the src files to the given destination.
     *
     * @param {File} destination
     * @param {string[]|File} [src]
     * @return {Promise<void>}
     */
    async copyTo(destination, src = this.files) {
        this.assets = this.assets || []

        let sourceFiles = await this.normalizeSourceFiles(src)

        // Copy an array of files to the destination file/directory
        // file -> file: no change in destination file name
        // directory -> file: this is an error
        // file -> directory: change name
        // directory -> directory: don't change name
        await Promise.all(sourceFiles.map(async file => {
            const dest = file.isFile() && destination.isDirectory()
                ? destination.append(file.name())
                : destination

            await file.copyToAsync(dest.path());
        }))

        if (destination.isDirectory()) {
            this.assets = await destination.listContentsAsync()
        } else {
            this.assets = [destination]
        }
    }

    get mix() {
        return global.Mix;
    }
}

module.exports = FileCollection;
