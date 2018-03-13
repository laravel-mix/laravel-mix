class DisableNotifications {
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
        if (this.caller === 'disableSuccessNotifications') {
            Config.notifications = {
                onSuccess: false,
                onFailure: true
            };
        } else {
            Config.notifications = false;
        }
    }
}

module.exports = DisableNotifications;
