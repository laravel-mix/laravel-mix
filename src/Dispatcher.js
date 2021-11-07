/** @typedef {(...args: any) => void|Promise<void>} Handler */

const { concat } = require('lodash');

class Dispatcher {
    /**
     * Create a new Dispatcher instance.
     */
    constructor() {
        /** @type {Record<string, Handler[]>} */
        this.events = {};
    }

    /**
     * Listen for the given event.
     *
     * @param {string|string[]}   events
     * @param {Handler}       handler
     */
    listen(events, handler) {
        events = concat([], events);

        events.forEach(event => {
            this.events[event] = (this.events[event] || []).concat(handler);
        });

        return this;
    }

    /**
     * Trigger all handlers for the given event.
     *
     * @param {string} event
     * @param {any} [data]
     */
    async fire(event, data) {
        if (!this.events[event]) return false;

        return Promise.all(this.events[event].map(handler => handler(data)));
    }

    /**
     * Fetch all registered event listeners.
     */
    all() {
        return this.events;
    }
}

module.exports = Dispatcher;
