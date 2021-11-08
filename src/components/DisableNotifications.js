const { Component } = require('./Component');

module.exports = class DisableNotifications extends Component {
    /**
     * The API name for the component.
     */
    name() {
        return ['disableNotifications', 'disableSuccessNotifications'];
    }

    /**
     * Register the component.
     */
    register() {
        const enabled = this.caller === 'disableSuccessNotifications' ? ['failure'] : [];

        this.context.config.notifications = {
            onSuccess: enabled.includes('success'),
            onFailure: enabled.includes('failure')
        };
    }
};
