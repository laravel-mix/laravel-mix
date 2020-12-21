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

        return this;
    }

    /**
     * Trigger all handlers for the given event.
     *
     * @param {string} event
     * @param {*} data
     */
    async fire(event, data) {
        if (!this.events[event]) return false;

        return Promise.allSettled(this.events[event].map(handler => handler(data)));
    }

    /**
     * Fetch all registered event listeners.
     */
    all() {
        return this.events;
    }
}

module.exports = Dispatcher;
