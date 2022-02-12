const { Component } = require('./Component');

module.exports = class DumpWebpackConfig extends Component {
    /**
     * The optional name to be used when called by Mix.
     */
    name() {
        return ['dumpWebpackConfig', 'dump'];
    }

    /**
     * Register the component.
     */
    register() {
        this.context.listen('configReadyForUser', config => {
            this.context.logger.info(this.circularStringify(config));
        });
    }

    /**
     *
     * @param {any} item
     */
    circularStringify(item) {
        const cache = new Set();

        return JSON.stringify(
            item,
            (_, value) => {
                if (value instanceof RegExp) {
                    return value.toString();
                }

                if (typeof value === 'object' && value !== null) {
                    if (cache.has(value)) {
                        return undefined;
                    }

                    cache.add(value);
                }

                return value;
            },
            2
        );
    }
};
