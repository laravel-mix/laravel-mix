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
            RegExp.prototype.toJSON = function() {
                return this.toString();
            };

            Log.info(JSON.stringify(config, null, 2));
        });
    }
}

module.exports = DumpWebpackConfig;
