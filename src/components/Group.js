/**
 * @typedef {(mix: import("../../types/index"), context: import("../Build/BuildContext").BuildContext) => void} GroupCallback
 */

class Group {
    /**
     *
     * @param {import('../Build/BuildContext').BuildContext} context
     */
    constructor(context) {
        this.context = context;
    }

    /**
     * Add resolution aliases to webpack's config
     *
     * @param {string} name
     * @param {GroupCallback} [callback]
     */
    register(name, callback) {
        if (!callback) {
            throw new Error('A callback must be passed to mix.group()');
        }

        // TODO: All groups should be registered all the time
        // The filtering should happen when we get ready to build
        // This could potentially allow group callbacks to be asynchronous
        const shouldBuild = name === process.env.MIX_GROUP || !process.env.MIX_GROUP;

        if (!shouldBuild) {
            return;
        }

        this.context.mix.addGroup(name, group =>
            callback(group.context.api, group.context)
        );
    }
}

module.exports = Group;
