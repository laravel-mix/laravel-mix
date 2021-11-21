const { Component } = require('./Component');

module.exports = class Notifications extends Component {
    passive = true;

    /**
     * webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        if (!this.enabled) {
            return [];
        }

        if (process.env.DISABLE_NOTIFICATIONS === '1') {
            return [];
        }

        const WebpackNotifierPlugin = require('webpack-notifier');

        return [
            new WebpackNotifierPlugin({
                appID: 'Laravel Mix',

                title: 'Laravel Mix',
                alwaysNotify: this.context.config.notifications.onSuccess,
                timeout: false,
                hint: process.platform === 'linux' ? 'int:transient:1' : undefined,
                contentImage: this.context.paths.root(
                    'node_modules/laravel-mix/icons/laravel.png'
                )
            })
        ];
    }

    get enabled() {
        const { notifications } = this.context.config;

        return notifications && (notifications.onSuccess || notifications.onFailure);
    }
};
