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
     */
    run() {
        this.compile();

        if (this.shouldWatch) this.watch();
    }


    /**
     * Compile Sass.
     *
     * @param {Boolean} watch
     */
    compile(watch = false) {
        let output = this.output.path;

        if (! output.startsWith(options.publicPath)) {
            output = path.join(options.publicPath, output);
        }

        this.command = spawn(
            'node-sass', [this.src.path, output].concat(this.options(watch))
        );

        this.whenOutputIsAvailable((output, event) => {
            if (event === 'error') this.onFail(output);
            if (event === 'success') this.onSuccess(output);
        });

        return this;
    }

    /**
     * Fetch the node-sass options.
     *
     * @param {Boolean} watch
     */
    options(watch) {
        let sassOptions = [
            '--precision=8',
            '--output-style=' + (global.options.production ? 'compressed' : 'expanded'),
        ];

        if (watch) sassOptions.push('--watch');

        if (this.pluginOptions.includePaths) {
            this.pluginOptions.includePaths.forEach(
                path => sassOptions.push('--include-path=' + path)
            );
        }

        if (global.options.sourcemaps && ! global.options.production) {
            sassOptions.push('--source-map-embed');
        }

        return sassOptions;
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
        console.log(output);

        notifier.notify({
            title: 'Laravel Mix',
            message: 'Sass Compilation Successful',
            contentImage: 'node_modules/laravel-mix/icons/laravel.png'
        });

        global.events.fire(
            'standalone-sass-compiled', File.find(this.output.path)
        );
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
