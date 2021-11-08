const path = require('path');
const { Component } = require('./Component');

module.exports = class SetPublicPath extends Component {
    /**
     * @param {string} defaultPath
     */
    register(defaultPath) {
        this.context.config.publicPath = path.normalize(defaultPath.replace(/\/$/, ''));
    }
};
