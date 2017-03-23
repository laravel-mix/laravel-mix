let File = require('../File');
let path = require('path');
let spawn = require('child_process').spawn;
let notifier = require('node-notifier');

class StandaloneSass {
    /**
     * Create a new StandaloneSass instance.
     *
     * @param {string} src
     * @param {string} output
     * @param {object} pluginOptions
     */
    constructor(src, output, pluginOptions) {
        src = new File(path.resolve(src)).parsePath();
        output = new File(output).parsePath();

        if (output.isDir) {
            output = new File(
                path.join(output.path, src.name + '.css')
            ).parsePath();
        }

        this.src = src;
        this.output = output;
        this.pluginOptions = pluginOptions;
        this.shouldWatch = process.argv.includes('--watch');
    }


    /**
     * Run the node-sass compiler.
     *
     * @param {Boolean} inProduction
     */
    run(inProduction) {
        this.inProduction = inProduction;

        this.compile();

        if (this.shouldWatch) this.watch(true);

        this.whenOutputIsAvailable((output, event) => {
            if (event === 'error') this.onFail(output);
            if (event === 'success') this.onSuccess(output);
        });
    }


    /**
     * Compile Sass.
     *
     * @param {Boolean} watch
     */
    compile(watch) {
        this.command = spawn('node-sass', [
            this.src.path,
            this.output.path,
            watch ? '-w' : '',
            '--precision=8',
            '--output-style=' + (this.inProduction ? 'compressed' : 'expanded')
        ]);

        return this;
    }


    /**
     * Compile Sass, while registering a watcher.
     */
    watch() {
        return this.compile(true);
    }


    /**
     * Register a callback for when output is available.
     *
     * @param {Function} callback
     */
    whenOutputIsAvailable(callback) {
        this.command.stderr.on('data', output => {
            output = output.toString();

            let event = 'change';
            if (/Error/.test(output)) event = 'error';
            if (/Wrote CSS/.test(output)) event = 'success';

            callback(output, event);
        });
    }


    /**
     * Handle successful compilation.
     *
     * @param {string} output
     */
    onSuccess(output) {
        console.log("\n");
        console.log('Sass Compilation Successful!');

        notifier.notify({
            title: 'Laravel Mix',
            message: 'Sass Compilation Successful',
            contentImage: 'node_modules/laravel-mix/icons/laravel.png'
        });
    }


    /**
     * Handle failed compilation.
     *
     * @param {string} output
     */
    onFail(output) {
        console.log("\n");
        console.log('Sass Compilation Failed!');
        console.log();
        console.log(output);

        notifier.notify({
            title: 'Laravel Mix',
            subtitle: 'Sass Compilation Failed',
            message: JSON.parse(output).message,
            contentImage: 'node_modules/laravel-mix/icons/laravel.png'
        });

        if (! this.shouldWatch) process.exit();
    }
}

module.exports = StandaloneSass;
