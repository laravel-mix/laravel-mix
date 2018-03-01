class Browsersync {
    name() {
        return 'browserSync';
    }

    dependencies() {
        this.requiresReload = true;

        return ['browser-sync-webpack-plugin', 'browser-sync'];
    }

    register(config) {
        if (typeof config === 'string') {
            config = { proxy: config };
        }

        Config.browserSync = config;

        return this;
    }

    webpackPlugins() {
        if (Mix.isUsing('browserSync')) {
            let BrowserSyncPlugin = require('browser-sync-webpack-plugin');

            return new BrowserSyncPlugin(this.config(), { reload: false });
        }
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
            Config.browserSync
        );
    }
}

module.exports = Browsersync;
