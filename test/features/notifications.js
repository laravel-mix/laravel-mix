import mix from './helpers/setup';

test.cb('it displays OS notifications', t => {
    compile(t, config => {
        // Find the webpack-notifier plugin. (Yeah, a little awkward...)
        let plugin = config.plugins.find(
            plugin => plugin.options && plugin.options.alwaysNotify === true
        );

        t.truthy(plugin);
    });
});

test.cb('it disables OS notifications', t => {
    mix.disableNotifications();

    compile(t, config => {
        // Find the webpack-notifier plugin. (Yeah, a little awkward...)
        let plugin = config.plugins.find(
            plugin => plugin.options && plugin.options.alwaysNotify === true
        );

        t.falsy(plugin);
    });
});

test.cb('it disables OS success notifications', t => {
    mix.disableSuccessNotifications();

    compile(t, config => {
        // Find the webpack-notifier plugin. (Yeah, a little awkward...)
        let plugin = config.plugins.find(
            // To disable success notifications, we only have to set the alwaysNotify
            // option on the webpack plugin to false.
            plugin => plugin.options && plugin.options.alwaysNotify === false
        );

        t.truthy(plugin);
    });
});

test('mix.disableNotifications()', t => {
    t.is(mix, mix.disableNotifications());
});

test.cb('it set OS notifications timeout', t => {
    let timeout = 2;
    mix.setNotificationsTimeout(timeout);

    compile(t, config => {
        // Find the webpack-notifier plugin. (Yeah, a little awkward...)
        let plugin = config.plugins.find(
            // Check the plugin timeout option
            plugin => plugin.options && plugin.options.timeout === timeout
        );

        t.truthy(plugin);
    });
});