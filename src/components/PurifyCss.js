let AutomaticComponent = require('./AutomaticComponent');
let glob = require('glob');

class PurifyCss extends AutomaticComponent {
    /**
     * Required dependencies for the component.
     */
    dependencies() {
        if (Config.purifyCss) {
            this.requiresReload = true;

            return ['purifycss-webpack', 'purify-css'];
        }
    }

    /**
     * Override the generated webpack configuration.
     *
     * @param {Object} config
     */
    webpackConfig(config) {
        if (Config.purifyCss) {
            Config.purifyCss = this.build(Config.purifyCss);

            let CssPurifierPlugin = require('../webpackPlugins/CssPurifierPlugin');

            config.plugins.push(CssPurifierPlugin.build());
        }
    }

    /**
     * Build the CSSPurifier plugin options.
     *
     * @param {Object} options
     */
    build(options) {
        if (typeof options === 'object') {
            if (options.paths) {
                let paths = options.paths;

                paths.forEach(path => {
                    if (!path.includes('*')) return;

                    options.paths.splice(paths.indexOf(path), 1);

                    options.paths = paths.concat(glob.sync(path));
                });
            }
            options.minimize = options.hasOwnProperty('minimize')
                ? options.minimize
                : Mix.inProduction();
        }

        return options;
    }
}

module.exports = PurifyCss;
