let chokidar = require('chokidar');
let concatenate = require('concatenate');
let File = require('./File');

class Concat {
    /**
     * Create a new Concat instance.
     *
     * @param {object} events
     */
    constructor(events) {
        this.files = [];

        events.listen('build', this.run.bind(this));
    }


    /**
     * Add a set of files to be concatenated.
     *
     * @param {object} files
     */
    add(files) {
        this.files = this.files.concat(files);
    }


    /**
     * Watch all relevant files for changes.
     */
    watch() {
        if (! process.argv.includes('--watch')) return;

        let watchers = [].concat.apply(
            [], this.files.map(set => set.src)
        );

        chokidar.watch(watchers, {
            persistent: true
        }).on('change', this.run.bind(this));
    }


    /**
     * Combine the given files, or those from Mix.combine().
     *
     * @param {array|null} files
     */
    run() {
        this.files.forEach(file => {
            require('mkdirp').sync(
                File.find(file.output).parsePath().base
            );

           concatenate.sync(file.src, file.output);

            if (process.env.NODE_ENV === 'production') {
                new File(file.output).minify();
            }
        });

        return this;
    }
}

module.exports = Concat;
