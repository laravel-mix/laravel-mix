let childProcess = require('child_process');
let Log = require('./Log');
let argv = require('yargs').argv;
let PackageManager = require('./PackageManager');

/**
 * @typedef {object} DependencyObject
 * @property {string} package
 * @property {(obj: any) => boolean} [check]
 */

/**
 * @typedef {string|DependencyObject} Dependency
 */

class Dependencies {
    /**
     * Create a new Dependencies instance.
     *
     * @param {Dependency[]} dependencies
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
        let dependencies = this.dependencies
            .map(dep => this.normalize(dep))
            .filter(dep => !dep.check());

        if (!dependencies.length) {
            return;
        }

        this.execute(
            this.buildInstallCommand(dependencies),
            dependencies,
            abortOnComplete
        );
    }

    /**
     * Execute the provided console command.
     *
     * @param {string}  command
     * @param {DependencyObject[]}   dependencies
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

        dependencies.forEach(d => Log.feedback('- ' + d.package));

        this.respond(abortOnComplete);
    }

    /**
     * Build the dependency install command.
     *
     * @param {DependencyObject[]}  dependencies
     */
    buildInstallCommand(dependencies) {
        dependencies = dependencies.map(dep => dep.package).join(' ');

        switch (PackageManager.detect()) {
            case 'npm':
                return `npm install ${dependencies} --save-dev --legacy-peer-deps`;

            case 'yarn':
                return `yarn add ${dependencies} --dev`;
        }
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

    /**
     * @param {Dependency} dep
     * @returns {DependencyObject}
     */
    normalize(dep) {
        if (typeof dep === 'string') {
            dep = { package: dep };
        }

        const name = dep.package.replace(/(?!^@)@.+$/, '');

        function isInstalled() {
            try {
                require.resolve(name);

                return true;
            } catch (e) {
                return false;
            }
        }

        function isValid() {
            return dep.check ? dep.check(require(name)) : true;
        }

        return {
            ...dep,
            check: () => isInstalled() && isValid()
        };
    }
}

module.exports = Dependencies;
