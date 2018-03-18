class Browsersync {
    /**
     * The API name for the component.
     */
    name() {
        return 'browserSync';
    }

    /**
     * Required dependencies for the component.
     */
    dependencies() {
        this.requiresReload = true;

        return ['browser-sync', 'browser-sync-webpack-plugin@2.0.1'];
    }

    /**
     * Register the component.
     *
     * @param {Object} userConfig
     */
    register(userConfig) {
        this.userConfig =
            typeof userConfig == 'string' ? { proxy: userConfig } : userConfig;
    }

    /**
     * webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        let BrowserSyncPlugin = require('browser-sync-webpack-plugin');

        return new BrowserSyncPlugin(this.config(), { reload: false });
    }

    /**
     * Build the BrowserSync configuration.
     */
    config() {
        return Object.assign(
            {
                host: 'localhost',
                port: 3000,
                proxy: 'app.test',
                files: [
                    'app/**/*.php',
                    'resources/views/**/*.php',
                    'public/js/**/*.js',
                    'public/css/**/*.css'
                ],
                snippetOptions: {
                    rule: {
                        match: /(<\/body>|<\/pre>)/i,
                        fn: function(snippet, match) {
                            return snippet + match;
                        }
                    }
                }
            },
            this.userConfig
        );
    }
}

module.exports = Browsersync;
