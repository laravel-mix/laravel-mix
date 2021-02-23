let Log = require('../Log');

class DumpWebpackConfig {
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
        Mix.listen('configReadyForUser', config => {
            RegExp.prototype.toJSON = function () {
                return this.toString();
            };

            Log.info(this.circularStringify(config));
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
}

module.exports = DumpWebpackConfig;
