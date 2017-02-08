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
     * @param {string|Array}   events
     * @param {Function}       handler
     */
    listen(events, handler) {
        events = [].concat(events);

        events.forEach(event => {
            this.events[event] = (this.events[event] || []).concat(handler);
        });
    }


    /**
     * Trigger all handlers for the given event.
     *
     * @param {string} event
     * @param {*} data
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
