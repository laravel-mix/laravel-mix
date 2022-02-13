const { Component } = require('./Component');

module.exports = class Override extends Component {
    /**
     *
     * @param {()=>void|Promise<void>} callback
     */
    register(callback) {
        this.context.mix.listen('configReadyForUser', callback);
    }
};
