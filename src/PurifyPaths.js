let glob = require('glob');

class PurifyPaths {
    /**
     * Build up the proper Purify file paths.
     *
     * @param {Boolean|object} options
     */
    static build(options) {
        if (typeof options === 'object' && options.paths) {
            let paths = options.paths;

            paths.forEach(path => {
                if (! path.includes('*')) return;

                options.paths.splice(paths.indexOf(path), 1);

                options.paths = paths.concat(glob.sync(path));
            });
        }

        return options;
    }
}

module.exports = PurifyPaths;
