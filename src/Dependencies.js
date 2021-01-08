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
    static _queue = {
        /** @type {Dependency[]} */
        items: [],

        /** @type {boolean} */
        requiresReload: false
    };

    /**
     * Create a new Dependencies instance.
     *
     * @param {Dependency[]} dependencies
     */
    constructor(dependencies) {
        this.dependencies = dependencies
            .filter(dep => dep)
            .map(dep => this.normalize(dep));
    }

    /**
     * Create a new Dependencies instance.
     *
     * @param {Dependency|Dependency[]} dependencies
     */
    static queue(dependencies, requiresReload = false) {
        Dependencies._queue.items = Dependencies._queue.items.concat(dependencies);

        Dependencies._queue.requiresReload =
            Dependencies._queue.requiresReload || requiresReload;
    }

    /**
     * Create a new Dependencies instance.
     */
    static installQueued() {
        new Dependencies(Dependencies._queue.items).install(
            Dependencies._queue.requiresReload
        );
    }

    /**
     * Install all dependencies that aren't available.
     *
     * @param {Boolean} abortOnComplete
     */
    install(abortOnComplete = false) {
        let dependencies = this.dependencies.filter(dep => !dep.check());

        if (!dependencies.length) {
            return;
        }

        this.execute(this.buildInstallCommand(dependencies), abortOnComplete);
    }

    /**
     * Execute the provided console command.
     *
     * @param {string}  command
     * @param {Boolean} abortOnComplete
     */
    execute(command, abortOnComplete) {
        Log.feedback(
            'Additional dependencies must be installed. This will only take a moment.'
        );

        Log.feedback(`Running: ${command}`);

        childProcess.execSync(command);

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

            if (process.env.NODE_ENV !== 'test') {
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
