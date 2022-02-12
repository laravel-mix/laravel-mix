const { Component } = require('./Component');

module.exports = class Before extends Component {
    /**
     * Register the component.
     *
     * @param  {Function} callback
     * @return {void}
     */
    register(callback) {
        this.context.listen('init', callback);
    }
};
