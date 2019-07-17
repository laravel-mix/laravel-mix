class NotificationsTimeout {
    /**
     * The API name for the component.
     */
    name() {
        return ['setNotificationsTimeout'];
    }

    /**
     * Register the component.
     *  @param {int} timeout
     */
    register(timeout) {
        Config.notifications.timeout = timeout;
    }
}

module.exports = NotificationsTimeout;
