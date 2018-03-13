let AutomaticComponent = require('./AutomaticComponent');

class Notifications extends AutomaticComponent {
    /**
     * webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        if (Mix.isUsing('notifications')) {
            let WebpackNotifierPlugin = require('webpack-notifier');

            return new WebpackNotifierPlugin({
                title: 'Laravel Mix',
                alwaysNotify: Config.notifications.onSuccess,
                contentImage: Mix.paths.root(
                    'node_modules/laravel-mix/icons/laravel.png'
                )
            });
        }
    }
}

module.exports = Notifications;
