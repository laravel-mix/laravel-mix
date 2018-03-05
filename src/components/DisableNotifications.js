class DisableNotifications {
    name() {
        return ['disableNotifications', 'disableSuccessNotifications'];
    }

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
