const { Component } = require('./Component');

module.exports = class Before extends Component {
    /**
     * @param  {() => void | Promise<void>} callback
     */
    register(callback) {
        this.context.mix.listen('init', callback);
    }
};
