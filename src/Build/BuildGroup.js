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
        // TODO: We should run setup as early as possible
        // Maybe in Mix.init?
        await this.setup();

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

    get shouldBeBuilt() {
        // TODO: Support simple wildcards? like foo_* and support regex when using slashes /foo_.*/
        const pattern = new RegExp(`^${process.env.MIX_GROUP || '.*'}$`, 'i');

        return !!this.name.match(pattern);
    }

    /**
     * @internal
     * @deprecated
     */
    makeCurrent() {
        global.Config = this.context.config;
        this.context.chunks.makeCurrent();

        return this;
    }
};
