let childProcess = require('child_process');
let File = require('../src/File');
let argv = require('yargs').argv;

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
        this.dependencies
            .reject(dependency => {
                try {
                    return require.resolve(
                        dependency.replace(/(?!^@)@.+$/, '')
                    );
                } catch (e) {}
            })
            .tap(dependencies => {
                this.execute(
                    this.buildInstallCommand(dependencies),
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
    execute(command, abortOnComplete) {
        console.log(
            'Additional dependencies must be installed. ' +
                'This will only take a moment.'
        );

        childProcess.execSync(command);

        this.respond(abortOnComplete);
    }

    /**
     * Build the dependency install command.
     *
     * @param {Object} dependencies
     */
    buildInstallCommand(dependencies) {
        dependencies = [].concat(dependencies).join(' ');

        if (File.exists('yarn.lock')) {
            return `yarn add ${dependencies} --dev --production=false`;
        }

        return `npm install ${dependencies} --save-dev --production=false`;
    }

    /**
     * Complete the install process.
     *
     * @param {Boolean} abortOnComplete
     */
    respond(abortOnComplete) {
        console.log(
            typeof abortOnComplete === 'string'
                ? abortOnComplete
                : 'Finished. Please run Mix again.'
        );

        if (!argv['$0'].includes('ava')) {
            process.exit();
        }
    }
}

module.exports = Dependencies;
