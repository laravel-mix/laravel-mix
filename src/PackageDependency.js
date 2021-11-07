/**
 * @typedef {object} DependencyObject
 * @property {string} package
 * @property {(name: string) => boolean} [check]
 */

/**
 * @typedef {string | DependencyObject} Dependency
 */

exports.PackageDependency = class PackageDependency {
    /** @type {string} */
    package;

    /** @type {string} */
    name;

    /** @type {(name: string) => boolean | Promise<boolean>} */
    checkFn;

    /**
     *
     * @param {Dependency} dep
     */
    static from(dep) {
        const depObj = typeof dep === 'string' ? { package: dep } : dep;

        return new PackageDependency(depObj.package, depObj.check);
    }

    /**
     *
     * @param {string} pkg
     * @param {(name: string) => boolean} [checkFn]
     */
    constructor(pkg, checkFn) {
        this.package = pkg;
        this.name = pkg.replace(/(?!^@)@.+$/, '');
        this.checkFn = checkFn || (() => true);
    }

    async needsInstallation() {
        return !(await this.isInstalled()) || !(await this.isValid());
    }

    async isInstalled() {
        try {
            require.resolve(this.name);

            return true;
        } catch (e) {
            return false;
        }
    }

    async isValid() {
        return this.checkFn(this.name);
    }
};
