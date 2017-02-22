let md5 = require('md5');
let File = require('./File');
let chokidar = require('chokidar');
let concatenate = require('concatenate');
let babel;

class Concat {
    /**
     * Create a new Concat instance.
     *
     * @param {object} events
     */
    constructor(events) {
        this.events = events;
        this.versioning = false;
        this.combinations = [];

        this.events.listen('build', this.run.bind(this));
    }


    /**
     * Enable file versioning.
     */
    enableVersioning() {
        this.versioning = true;
    }


    /**
     * Add a set of files to be combined.
     *
     * @param {object} files
     */
    add(files) {
        this.combinations.push({
            src: files.src,
            output: files.output,
            outputOriginal: files.output,
            babel: !! files.babel
        });

        return this;
    }


    /**
     * Watch all relevant files for changes.
     *
     * @param {object|null} watcher
     */
    watch(watcher) {
        watcher = watcher || chokidar;

        if (! this.shouldWatch()) return;

        this.combinations.forEach(combination => {
            watcher.watch(combination.src, { persistent: true })
                   .on('change', this.combine.bind(this, combination));
        });
    }


    /**
     * Determine if file watching should be enabled.
     *
     * @return {boolean}
     */
    shouldWatch() {
        return this.any() && process.argv.includes('--watch');
    }


    /**
     * Process combination.
     *
     * @param {object} files
     */
    combine(files) {
        let output = File.find(files.output).makeDirectories();

        let mergedFileContents = concatenate.sync(files.src, files.output);

        if (files.babel && output.fileType === '.js') {
            output.write(this.babelify(mergedFileContents));
        }

        // If file versioning is enabled, then we'll
        // rename the output file to apply a hash.
        if (this.versioning) {
            let versionedPath = File.find(files.outputOriginal)
                .versionedPath(md5(mergedFileContents));

            files.output = output.rename(versionedPath).file;
        }

        if (process.env.NODE_ENV === 'production' || process.argv.includes('-p')) {
            new File(files.output).minify();
        }

        // We'll now fire an event, so that the Manifest class
        // can be refreshed to reflect these new files.
        this.events.fire('combined', files);
    }


    /**
     * Apply Babel to the given contents.
     *
     * @param {string} contents
     */
    babelify(contents) {
        if (! babel) babel = require('babel-core');

        return babel.transform(
            contents, { presets: ['es2015'] }
        ).code;
    }


    /**
     * Perform all relevant combinations.
     */
    run() {
        this.combinations.forEach(files => this.combine(files));

        return this;
    }


    /**
     * Determine if there are any files to concatenate.
     *
     * @return {boolean}
     */
    any() {
        return this.combinations.length > 0;
    }
}

module.exports = Concat;
