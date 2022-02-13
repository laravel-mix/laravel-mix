const { Component } = require("./Component.js")
const { BuildGroup } = require("../Build/BuildGroup.js")

module.exports = class Group extends Component {
    /**
     * Add resolution aliases to webpack's config
     *
     * @param {string} name
     * @param {import('../Build/BuildGroup.js').GroupCallback} [callback]
     */
    register(name, callback) {
        if (!callback) {
            throw new Error('Using mix.group() requires a callback to configure the group');
        }

        this.context.mix.groups.push(new BuildGroup({
            name,
            mix: this.context.mix,
            callback,
        }))
    }
}
