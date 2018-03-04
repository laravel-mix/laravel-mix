class Browsersync {
    name() {
        return 'browserSync';
    }

    dependencies() {
        this.requiresReload = true;

        return ['browser-sync-webpack-plugin', 'browser-sync'];
    }

    register(config) {
        this.config = typeof config == 'string' ? { proxy: config } : config;
    }

    webpackPlugins() {
        let BrowserSyncPlugin = require('browser-sync-webpack-plugin');

        return new BrowserSyncPlugin(this.config(), { reload: false });
    }

    config() {
        return Object.assign(
            {
                host: 'localhost',
                port: 3000,
                proxy: 'app.dev',
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
            this.config
        );
    }
}

module.exports = Browsersync;
