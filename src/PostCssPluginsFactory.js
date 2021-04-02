let postcssrc = require('postcss-load-config');

class PostCssPluginsFactory {
    /**
     * Create a new instance.
     * @param {Object} preprocessor
     * @param {Config} Config
     */
    constructor(preprocessor, Config) {
        this.preprocessor = preprocessor;
        this.Config = Config;

        this.plugins = [];
    }

    /**
     * Load all relevant PostCSS plugins.
     */
    load() {
        this.loadConfigFile()
            .loadGlobalPlugins()
            .loadLocalPlugins()
            .loadAutoprefixer()
            .loadCssNano();

        return this.plugins;
    }

    /**
     * Load the user's postcss.config.js file, if any.
     */
    loadConfigFile() {
        try {
            this.plugins = [...this.plugins, ...postcssrc.sync().plugins];
        } catch (e) {
            // No postcss.config.js file exists.
        }

        return this;
    }

    /**
     * Load any global postcss plugins that have been passed to Mix.
     */
    loadGlobalPlugins() {
        if (this.Config.postCss && this.Config.postCss.length) {
            this.plugins = [...this.plugins, ...this.Config.postCss];
        }

        return this;
    }

    /**
     * Load any postcss plugins that were passed to the Mix command.
     */
    loadLocalPlugins() {
        if (this.preprocessor.postCssPlugins && this.preprocessor.postCssPlugins.length) {
            this.plugins = [...this.plugins, ...this.preprocessor.postCssPlugins];
        }

        return this;
    }

    /**
     * Add autoprefixer to the plugins list.
     */
    loadAutoprefixer() {
        if (this.Config.autoprefixer) {
            this.plugins.push(require('autoprefixer')(this.Config.autoprefixer));
        }

        return this;
    }

    /**
     * Add CSSNano to the plugins list.
     */
    loadCssNano() {
        if (this.Config.production && this.Config.cssNano !== false) {
            this.plugins.push(
                require('cssnano')({
                    preset: ['default', this.Config.cssNano]
                })
            );
        }

        return this;
    }
}

module.exports = PostCssPluginsFactory;
