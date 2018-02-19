let File = require('./File');
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
        this.src = src;
        this.output = output;
        this.pluginOptions = pluginOptions;
        this.shouldWatch = process.argv.includes('--watch');

        Mix.addAsset(this.output);
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
        this.command = spawn(
            path.resolve('./node_modules/.bin/node-sass'),
            [this.src.path(), this.output.path()].concat(this.options(watch)),
            { shell: true }
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
            '--output-style=' + (Mix.inProduction() ? 'compressed' : 'expanded')
        ];

        if (watch) sassOptions.push('--watch');

        if (this.pluginOptions.includePaths) {
            this.pluginOptions.includePaths.forEach(path =>
                sassOptions.push('--include-path=' + path)
            );
        }

        if (this.pluginOptions.importer) {
            sassOptions.push('--importer ' + this.pluginOptions.importer);
        }

        if (Mix.isUsing('sourcemaps') && !Mix.inProduction()) {
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
            if (output.includes('Error')) event = 'error';
            if (output.includes('Wrote CSS')) event = 'success';

            callback(output, event);
        });
    }

    /**
     * Handle successful compilation.
     *
     * @param {string} output
     */
    onSuccess(output) {
        console.log('\n');
        console.log(output);

        if (Config.notifications.onSuccess) {
            notifier.notify({
                title: 'Laravel Mix',
                message: 'Sass Compilation Successful',
                contentImage: 'node_modules/laravel-mix/icons/laravel.png'
            });
        }
    }

    /**
     * Handle failed compilation.
     *
     * @param {string} output
     */
    onFail(output) {
        output = output.replace(
            /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
            ''
        );

        console.log('\n');
        console.log('Sass Compilation Failed!');
        console.log();
        console.log(output);

        if (Mix.isUsing('notifications')) {
            notifier.notify({
                title: 'Laravel Mix',
                subtitle: 'Sass Compilation Failed',
                message: JSON.parse(output).message,
                contentImage: 'node_modules/laravel-mix/icons/laravel.png'
            });
        }

        if (!this.shouldWatch) process.exit();
    }
}

module.exports = StandaloneSass;
