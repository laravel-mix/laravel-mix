class Dispatcher {
    /**
     * Create a new Dispatcher instance.
     */
    constructor() {
        this.events = {};
    }


    /**
     * Listen for the given event.
     *
     * @param {string}   event
     * @param {Function} handler
     */
    listen(event, handler) {
        this.events[event] = (this.events[event] || []).concat(handler);
    }


    /**
     * Trigger all handlers for the given event.
     *
     * @param {string} event
     * @param {mixed} data
     */
    fire(event, data) {
        if (! this.events[event]) return false;

        this.events[event].forEach(handler => handler(data));
    }


    /**
     * Fetch all registered event listeners.
     */
    all() {
        return this.events;
    }
}

module.exports = Dispatcher;
