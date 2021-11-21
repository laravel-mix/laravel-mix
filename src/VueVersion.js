class VueVersion {
    /**
     *
     * @param {import("./Mix")} mix
     */
    constructor(mix) {
        this.mix = mix;
    }

    /**
     * Vue versions that are supported by Mix.
     *
     * @returns {number[]}
     */
    supported() {
        return [2, 3];
    }

    /**
     * Detect and validate the current version of Vue for the build.
     *
     * @param {string|number|null|undefined} [version]
     * @returns {number}
     */
    detect(version) {
        version = parseInt(`${version}`);

        if (!version || isNaN(version)) {
            try {
                return this.detect(require(this.mix.resolve('vue')).version);
            } catch (e) {
                this.fail();
            }
        }

        if (this.supported().includes(version)) {
            return version;
        }

        this.fail();
    }

    /**
     * Abort and log that a supported version of Vue wasn't found.
     * @returns {never}
     */
    fail() {
        this.mix.logger.error(
            `We couldn't find a supported version of Vue in your project. ` +
                `Please ensure that it's installed (npm install vue).`
        );

        throw new Error('Unable to detect vue version');
    }
}

module.exports = VueVersion;
