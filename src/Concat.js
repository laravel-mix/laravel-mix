let chokidar = require('chokidar');
let concatenate = require('concatenate');
let mkdir = require('mkdirp');
let md5 = require('md5');
let File = require('./File');

class Concat {
    /**
     * Create a new Concat instance.
     *
     * @param {object} events
     */
    constructor(events) {
        this.combinations = [];
        this.options = null;
        this.events = events;
    }

    /**
     * Initialize the concatenate.
     * 
     * @param  {object} options
     */
    initialize(options) {
        this.options = options;
        this.events.listen('build', this.run.bind(this));
        this.watch();
    }

    /**
     * Add a set of files to be concatenated.
     *
     * @param {object} files
     */
    add(combination) {
        this.combinations = this.combinations.concat({
            src: combination.src,
            output: combination.output,
            originOutput: combination.output
        });
    }


    /**
     * Watch all relevant files for changes.
     */
    watch() {
        if (! process.argv.includes('--watch')) return;

        this.combinations.forEach(combination => {
            chokidar.watch(combination.src, {
                persistent: true
            }).on('change', this.combine.bind(this, combination));
        });
    }

    /**
     * Process combination.
     * 
     * @param  {object} combination
     */
    combine(combination) {
        let parsedPath = File.find(combination.originOutput).parsePath();

        mkdir.sync(parsedPath.base);

        let all = concatenate.sync(combination.src, combination.originOutput);

        if (this.options.versioning) {
            let hash = md5(all);
            // Remove previous name-hashed file in watch mode.
            if (combination.originOutput !== combination.output) {
                File.find(combination.output).delete();
            }

            combination.output = `${parsedPath.base}/${parsedPath.name}.${hash}${parsedPath.ext}`
            File.rename(combination.originOutput, combination.output);
        }

        if (process.env.NODE_ENV === 'production') {
            new File(combination.output).minify();
        }

        this.events.fire('combined', combination);
    }

    /**
     * Combine the given files, or those from Mix.combine().
     *
     * @param {array|null} files
     */
    run() {
        this.combinations.forEach(combination => {
            this.combine(combination);
        });

        return this;
    }
}

module.exports = Concat;
