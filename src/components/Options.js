const { Component } = require('./Component');

module.exports = class Options extends Component {
    /**
     * @param {Record<string, any>} options
     */
    register(options) {
        this.context.config.merge(options);

        this.messages(options).forEach(msg => this.context.logger.message(msg));
    }

    /**
     *
     * @param {any} options
     */
    messages(options) {
        /** @type {import("../Log").LogMessage[]} */
        const messages = [];

        if ('extractVueStyles' in options) {
            messages.push({
                type: 'warn',
                text: 'The option extractVueStyles has been moved. Please pass the extractStyles option to mix.vue() instead.'
            });
        }

        if ('globalVueStyles' in options) {
            messages.push({
                type: 'warn',
                text: 'The option globalVueStyles has been moved. Please pass the globalStyles option to mix.vue() instead.'
            });
        }

        if ('extractVueStyles' in options || 'globalVueStyles' in options) {
            messages.push({
                type: 'info',
                text: `Example:\n${this.buildVueExample(options)}`
            });
        }

        return messages;
    }

    /**
     *
     * @param {any} options
     * @returns {string}
     */
    buildVueExample(options) {
        const props = {};

        if ('extractVueStyles' in options) {
            props['extractStyles'] = options.extractVueStyles;
        }

        if ('globalVueStyles' in options) {
            props['globalStyles'] = options.globalVueStyles;
        }

        return `mix.vue(${JSON.stringify(props, null, 2)}})`;
    }
};
