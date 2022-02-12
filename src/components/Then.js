const { Component } = require('./Component');

module.exports = class Then extends Component {
    /**
     * The API name for the component.
     */
    name() {
        return ['then', 'after'];
    }

    /**
     * @param {() => void | Promise<void>} callback
     */
    register(callback) {
        this.context.listen('build', callback);
    }
};
