let childProcess = require('child_process');
let Log = require('./Log');
let argv = require('yargs').argv;
let collect = require('collect.js');

class Dependencies {
    /**
     * Create a new Dependencies instance.
     *
     * @param {Object} dependencies
     */
    constructor(dependencies) {
        this.dependencies = dependencies;
    }

    /**
     * Install all dependencies that aren't available.
     *
     * @param {Boolean} abortOnComplete
     */
    install(abortOnComplete = false) {
        collect(this.dependencies)
            .reject(dependency => {
                try {
                    return require.resolve(
                        dependency.replace(/(?!^@)@.+$/, '')
                    );
                } catch (e) {}
            })
            .pipe(dependencies => {
                if (!dependencies.count()) {
                    return;
                }

                this.execute(
                    this.buildInstallCommand(dependencies.all()),
                    dependencies.all(),
                    abortOnComplete
                );
            });
    }

    /**
     * Execute the provided console command.
     *
     * @param {string}  command
     * @param {Boolean} abortOnComplete
     */
    execute(command, dependencies, abortOnComplete) {
        Log.feedback(
            'Additional dependencies must be installed. This will only take a moment.'
        );

        Log.feedback(`Running: ${command}`);

        childProcess.execSync(command);

        Log.feedback(
            'Okay, done. The following packages have been installed and saved to your package.json dependencies list:'
        );

        dependencies.forEach(d => Log.feedback('- ' + d));

        this.respond(abortOnComplete);
    }
    /**
     * Build the dependency install command.
     *
     * @param {Object}  dependencies
     * @param {Boolean} forceNpm
     */
    buildInstallCommand(dependencies) {
        dependencies = [].concat(dependencies).join(' ');

        return `npm install ${dependencies} --save-dev --production=false`;
    }

    /**
     * Complete the install process.
     *
     * @param {Boolean} abortOnComplete
     */
    respond(abortOnComplete) {
        if (abortOnComplete) {
            Log.feedback(
                typeof abortOnComplete === 'string'
                    ? abortOnComplete
                    : 'Finished. Please run Mix again.'
            );

            if (!argv['$0'].includes('ava')) {
                process.exit();
            }
        }
    }
}

module.exports = Dependencies;
