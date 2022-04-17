const { escapeRegExp } = require('lodash')
const WebpackConfig = require('../builder/WebpackConfig');
const { BuildContext } = require('./BuildContext');

/**
 * @typedef {(api: BuildContext['api'], context: BuildContext) => void|Promise<void>} GroupCallback
 */

/**
 * Manages build groups
 */
exports.BuildGroup = class BuildGroup {
    /**
     * @param {object} param0
     * @param {string} param0.name
     * @param {GroupCallback} param0.callback
     * @param {import('../Mix')} param0.mix
     * @internal
     */
    constructor({ name, mix, callback }) {
        this.name = name;
        this.mix = mix;
        this.callback = callback;
        this.context = new BuildContext(mix);
    }

    /**
     * @internal
     *
     * For parallel build mode if we get to it. Probably won't.
     */
    async build() {
        const webpack = require('webpack');

        return await webpack(await this.config());
    }

    /**
     * Build the webpack configs for this context and all of its children
     *
     * @internal
     */
    async config() {
        return new WebpackConfig(this.mix).build();
    }

    /**
     * @internal
     */
    async setup() {
        return this.whileCurrent(() => this.callback(this.context.api, this.context));
    }

    /**
     * @template T
     * @param {() => T} callback
     * @returns {Promise<T>}
     */
    async whileCurrent(callback) {
        this.mix.pushCurrent(this);

        try {
            return await callback();
        } finally {
            this.mix.popCurrent();
        }
    }

    get enabled() {
        let requestedGroup = `${process.env.MIX_GROUP}`.trim()

        // All groups should be built when no group is specified
        if (requestedGroup.length === 0) {
            return true;
        }

        // This group name matches exactly so it should be built
        if (this.name === requestedGroup) {
            return true;
        }

        // Check this group against the requested group
        return this.toPattern(requestedGroup).test(this.name);
    }

    /**
     *
     * @private
     * @param {string} requestedGroup
     */
    toPattern(requestedGroup) {
        // The user has specified their own regex pattern
        if (requestedGroup.startsWith('/') && requestedGroup.endsWith('/')) {
            return new RegExp(`${requestedGroup.slice(1, -1)}`, 'i');
        }

        // This is a simple string so replace wildcards with a zero-or-more wildcard
        // Lifted from Illuminate\Support\Str::is(…)
        requestedGroup = escapeRegExp(requestedGroup).replace('\*', '.*');

        return new RegExp(`^${requestedGroup}\\z`, 'u');
    }
};
