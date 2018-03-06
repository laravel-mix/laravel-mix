let glob = require('glob');

class PurifyCss {
    constructor() {
        this.passive = true;
    }

    dependencies() {
        if (Config.purifyCss) {
            this.requiresReload = true;

            return ['purifycss-webpack', 'purify-css'];
        }
    }

    boot() {
        if (Config.purifyCss) {
            Config.purifyCss = this.build(Config.purifyCss);
        }
    }

    webpackPlugins() {
        if (Config.purifyCss) {
            let CssPurifierPlugin = require('../webpackPlugins/CssPurifierPlugin');

            return CssPurifierPlugin.build();
        }
    }

    build(options) {
        if (typeof options === 'object' && options.paths) {
            let paths = options.paths;

            paths.forEach(path => {
                if (!path.includes('*')) return;

                options.paths.splice(paths.indexOf(path), 1);

                options.paths = paths.concat(glob.sync(path));
            });
        }

        return options;
    }
}

module.exports = PurifyCss;
