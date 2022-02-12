const { Component } = require('./Component');

module.exports = class SetResourceRoot extends Component {
    /**
     * @param {string} path
     */
    register(path) {
        this.context.config.resourceRoot = path;
    }
};
