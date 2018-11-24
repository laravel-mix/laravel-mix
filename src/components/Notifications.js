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
                hint: process.platform === 'linux' ? 'int:transient:1' : undefined,
		timeout: Config.notifierTimeout != undefined ? Config.notifierTimeout : '5',
                contentImage: Mix.paths.root(
                    'node_modules/laravel-mix/icons/laravel.png'
                )
            });
        }
    }
}

module.exports = Notifications;
