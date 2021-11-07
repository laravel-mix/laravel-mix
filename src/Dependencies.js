let Log = require('./Log');
let PackageManager = require('./PackageManager');
let { PackageDependency } = require('./PackageDependency');

class Dependencies {
    /** @type {PackageDependency[]} */
    items = [];

    requiresReload = false;

    /**
     * Create a new Dependencies instance.
     *
     * @param {import('./PackageDependency').Dependency[]} deps
     */
    enqueue(deps, requiresReload = false) {
        this.items.push(...deps.filter(dep => dep).map(PackageDependency.from));
        this.requiresReload = this.requiresReload || requiresReload;

        return this;
    }

    /**
     * Install all dependencies that aren't available.
     */
    async install() {
        const packages = await this.installablePackages();

        if (!packages.length) {
            return;
        }

        await this.execute(this.buildInstallCommand(packages));
    }

    async installablePackages() {
        const results = await Promise.all(
            this.items.map(async dep => {
                if (await dep.needsInstallation()) {
                    return dep;
                }

                return null;
            })
        );

        return /** @type {PackageDependency[]} */ (results.filter(Boolean));
    }

    /**
     * Execute the provided console command.
     *
     * @param {string}  command
     */
    async execute(command) {
        Log.feedback(
            'Additional dependencies must be installed. This will only take a moment.'
        );

        Log.feedback(`Running: ${command}`);

        const childProcess = require('child_process');
        const { promisify } = require('util');

        await promisify(childProcess.exec)(command);

        this.respond();
    }

    /**
     * Build the dependency install command.
     *
     * @param {PackageDependency[]} deps
     */
    buildInstallCommand(deps) {
        const list = deps.map(dep => dep.package).join(' ');

        switch (PackageManager.detect()) {
            case 'npm':
                return `npm install ${list} --save-dev --legacy-peer-deps`;

            case 'yarn':
                return `yarn add ${list} --dev`;
        }
    }

    /**
     * Complete the install process.
     */
    respond() {
        if (!this.requiresReload) {
            return;
        }

        Log.feedback('Finished. Please run Mix again.');

        if (process.env.NODE_ENV !== 'test') {
            process.exit(1);
        }
    }
}

module.exports = Dependencies;
